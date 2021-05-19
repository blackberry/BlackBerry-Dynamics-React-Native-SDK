/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.blackberry.bbd.reactnative.filesystem;

import com.blackberry.bbd.apache.core.http.Consts;
import com.blackberry.bbd.apache.core.http.ContentType;
import com.blackberry.bbd.apache.http.entity.mime.FormBodyPartBuilder;
import com.blackberry.bbd.apache.http.entity.mime.MultipartEntityBuilder;
import com.blackberry.bbd.apache.core.util.CharsetUtils;

import com.blackberry.bbd.reactnative.networking.core.content.FileBody;
import com.blackberry.bbd.reactnative.networking.core.content.StringBody;
import com.blackberry.bbd.reactnative.networking.core.entities.OnProgressEvent;

import com.blackberry.bbd.reactnative.networking.core.GDHttpRequestDelegate;

import com.facebook.common.logging.FLog;
import com.good.gd.apache.http.Header;
import com.good.gd.apache.http.HttpEntity;
import com.good.gd.apache.http.HttpResponse;
import com.good.gd.apache.http.ParseException;
import com.good.gd.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import com.good.gd.apache.http.client.methods.HttpPost;
import com.good.gd.apache.http.client.methods.HttpPut;
import com.good.gd.apache.http.client.methods.HttpUriRequest;
import com.good.gd.apache.http.impl.client.DefaultProxyAuthenticationHandler;
import com.good.gd.apache.http.impl.client.DefaultTargetAuthenticationHandler;
import com.good.gd.apache.http.protocol.BasicHttpContext;
import com.good.gd.apache.http.protocol.HTTP;
import com.good.gd.apache.http.protocol.HttpContext;

import com.good.gd.net.GDHttpClient;

import android.os.AsyncTask;
import android.webkit.MimeTypeMap;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NoSuchKeyException;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.nio.charset.Charset;
import java.nio.charset.UnsupportedCharsetException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class Uploader extends AsyncTask<UploadParams, int[], UploadResult> {
    private final GDHttpRequestDelegate gdHttpRequestDelegate = new GDHttpRequestDelegate();
    private UploadParams mParams;
    private UploadResult res;
    private AtomicBoolean mAbort = new AtomicBoolean(false);
    private HttpUriRequest mRequest = null;
    private int byteSentTotal;
    private long totalFileLength;

    @Override
    protected UploadResult doInBackground(UploadParams... uploadParams) {
        mParams = uploadParams[0];
        res = new UploadResult();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    upload(mParams, res);
                    mParams.onUploadComplete.onUploadComplete(res);
                } catch (Exception e) {
                    res.exception = e;
                    mParams.onUploadComplete.onUploadComplete(res);
                }
            }
        }).start();
        return res;
    }

    private void upload(UploadParams params, UploadResult result) throws Exception {
        int statusCode;
        totalFileLength = 0;
        BufferedInputStream responseStream = null;
        BufferedReader responseStreamReader = null;
        String name, filename, filetype;

        try {
            Object[] files = params.files.toArray();
            boolean binaryStreamOnly = params.binaryStreamOnly;

            if (binaryStreamOnly) {
                throw new Exception("binaryStreamOnly not supported");
            }

            final OnProgressEvent progressEventCallback = new OnProgressEvent() {
                @Override
                public void publishProgress(final int progress,
                                          final long loaded,
                                          final long total) {
                    FLog.d("Uploader", "sending - progress: %d loaded: %d total: %d", progress, loaded, total);

                    if (progress > 0) {
                        if (mParams.onUploadProgress != null ) {
                            mParams.onUploadProgress.onUploadProgress((int) totalFileLength, byteSentTotal + (int)loaded);
                        }
                        if (loaded == total) {
                            byteSentTotal += (int)loaded;
                        }
                    }
                }
            };

            final Map<String, String> headrmap = new HashMap<>();
            ReadableMapKeySetIterator headerIterator = params.headers.keySetIterator();
            while (headerIterator.hasNextKey()) {
                String key = headerIterator.nextKey();
                String value = params.headers.getString(key);
                if (key != null || value != null) {
                    headrmap.put(key, value);
                }
            }

            String contentTypeStr = headrmap.get("content-type");
            String charsetName = null;
            if (contentTypeStr != null) {
                try {
                    final ContentType contentType = ContentType.parse(contentTypeStr);
                    final Charset charset = contentType.getCharset();
                    if (charset != null) {
                        charsetName = charset.name();
                    }
                }
                catch (ParseException | UnsupportedCharsetException e) {
                    // unsupported content-type
                    contentTypeStr = null;
                }
            }
            if (contentTypeStr == null) {
                contentTypeStr = "multipart/form-data";
            }
            if (charsetName == null) {
                charsetName = HTTP.UTF_8;
            }

            final ContentType contentType = ContentType.parse(contentTypeStr);
            final MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
            multipartEntityBuilder.setContentType(contentType);
            multipartEntityBuilder.setCharset(CharsetUtils.lookup(charsetName));
            multipartEntityBuilder.setLaxMode();

            ReadableMapKeySetIterator fieldsIterator = params.fields.keySetIterator();
            while (fieldsIterator.hasNextKey()) {
                String fieldName = fieldsIterator.nextKey();
                String bodyValue = params.fields.getString(fieldName);

                byte[] bytes = bodyValue.getBytes("UTF-8");
                int sizeInBytes = bytes.length;
                totalFileLength += (long)sizeInBytes;

                ContentType partContentType = ContentType.create("text/html", Consts.UTF_8);
                final FormBodyPartBuilder formBodyPartBuilder =
                        FormBodyPartBuilder.create(
                        fieldName,
                        new StringBody(bodyValue, partContentType, progressEventCallback));

                multipartEntityBuilder.addPart(formBodyPartBuilder.build());
            }

            for (ReadableMap map : params.files) {
                try {
                    name = map.getString("name");
                    filename = map.getString("filename");
                    filetype = map.getString("filetype");
                } catch (NoSuchKeyException e) {
                    name = map.getString("name");
                    filename = map.getString("filename");
                    filetype = getMimeType(map.getString("filepath"));
                }
                File file;
                String filepath = map.getString("filepath");
                if (BbdRNFileSystemModule.isSecureAbsolutePath(filepath, mParams.context)) {
                    file = new com.good.gd.file.File(filepath);
                }
                else {
                    file = new File(filepath);
                }

                final ContentType contenttype = ContentType.create(filetype);

                long fileLength = file.length();
                totalFileLength += fileLength;

                final FormBodyPartBuilder formBodyPartBuilder =
                        FormBodyPartBuilder.create(
                                filename,
                        new FileBody(file, contenttype, name, progressEventCallback));

                multipartEntityBuilder.addPart(formBodyPartBuilder.build());
            }

            final HttpEntity httpEntity = multipartEntityBuilder.build();
            // replace content-type with params(boundary and charset)
            contentTypeStr = httpEntity.getContentType().getValue();
            headrmap.put("content-type", contentTypeStr);

            final GDHttpClient gdHttpClient = new GDHttpClient();
            final HttpContext httpContext = new BasicHttpContext();

            // disable built-in TargetAuthenticationHandler
            gdHttpClient.setTargetAuthenticationHandler(new DefaultTargetAuthenticationHandler() {
                @Override
                public boolean isAuthenticationRequested(
                        final HttpResponse response,
                        final HttpContext context) {
                    return false;
                }
            });

            // disable built-in ProxyAuthenticationHandler
            gdHttpClient.setProxyAuthenticationHandler(new DefaultProxyAuthenticationHandler() {
                @Override
                public boolean isAuthenticationRequested(
                        final HttpResponse response,
                        final HttpContext context) {
                    return false;
                }
            });

            final HttpUriRequest request;
            final String url = params.src.toString();
            final String requestTypeLowerCase = params.method.toLowerCase();
            if (requestTypeLowerCase.equals("post")) {
                request = new HttpPost(url);
            }
            else {
                request = new HttpPut(url);
            }
            ((HttpEntityEnclosingRequestBase) request).setEntity(httpEntity);

            headrmap.put("X-Requested-With", "XMLHttpRequest");
            for (Map.Entry<String, String> header : headrmap.entrySet()) {
                final String key = header.getKey();
                final String value = header.getValue();
                request.setHeader(key, value);
            }

            byteSentTotal = 0;
            mRequest = request;

            if (mParams.onUploadBegin != null) {
                mParams.onUploadBegin.onUploadBegin();
            }

            final HttpResponse httpResponse = gdHttpClient.execute(request, httpContext);
            mRequest = null;

            if (request.isAborted()) {
                throw new Exception("Upload has been aborted");
            }

            statusCode = httpResponse.getStatusLine().getStatusCode();
            res.statusCode = statusCode;

            final Header headers[] = httpResponse.getAllHeaders();
            WritableMap responseHeaders = Arguments.createMap();
            for (int i = 0; i < headers.length; i++) {
                final Header header = headers[i];
                responseHeaders.putString(header.getName(), header.getValue());
            }
            res.headers = responseHeaders;

            String responseText = "";
            final HttpEntity responseEntity = httpResponse.getEntity();
            if (responseEntity != null) {
                responseText = gdHttpRequestDelegate.getHttpEntityAsString(responseEntity);
            }
            res.body = responseText;
        } finally {

        }
    }

    protected String getMimeType(String path) {
        String type = null;
        String extension = MimeTypeMap.getFileExtensionFromUrl(path);
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.toLowerCase());
        }
        if (type == null) {
            type = "*/*";
        }
        return type;
    }

    protected void stop() {
        if (mRequest != null) {
            mRequest.abort();
        }
        mAbort.set(true);
    }
}
