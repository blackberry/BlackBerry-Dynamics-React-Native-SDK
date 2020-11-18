/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Networking API of react-native (Java part)
 * from https://github.com/facebook/react-native/blob/0.61-stable/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java
 *
 * <p>Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.blackberry.bbd.reactnative.networking;

import android.net.Uri;
import android.util.Log;

import com.blackberry.bbd.apache.core.http.Consts;
import com.blackberry.bbd.apache.http.entity.GzipCompressingEntity;
import com.blackberry.bbd.apache.http.entity.GzipDecompressingEntity;
import com.blackberry.bbd.apache.core.http.ContentType;
import com.blackberry.bbd.apache.http.entity.mime.FormBodyPartBuilder;
import com.blackberry.bbd.apache.http.entity.mime.MultipartEntityBuilder;
import com.blackberry.bbd.apache.core.util.CharsetUtils;

import com.blackberry.bbd.reactnative.networking.core.GDHttpRequestDelegate;
import com.blackberry.bbd.reactnative.networking.core.content.FileBody;
import com.blackberry.bbd.reactnative.networking.core.content.InputStreamBody;
import com.blackberry.bbd.reactnative.networking.core.content.StringBody;
import com.blackberry.bbd.reactnative.networking.core.cookie.BasicCookieStore;
import com.blackberry.bbd.reactnative.networking.core.entities.OnProgressEvent;
import com.blackberry.bbd.reactnative.networking.core.entities.ProgressFileEntity;
import com.blackberry.bbd.reactnative.networking.core.entities.ProgressInputStreamEntity;
import com.blackberry.bbd.reactnative.networking.core.entities.ProgressStringEntity;
import com.blackberry.bbd.reactnative.networking.core.entities.ProgressUrlEncodedFormEntity;
import com.blackberry.bbd.reactnative.networking.core.utils.GDFileUtils;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import com.facebook.react.modules.network.ForwardingCookieHandler;
import com.facebook.react.modules.network.ResponseUtil;
import com.facebook.react.modules.network.ProgressiveStringDecoder;

import com.good.gd.apache.commons.codec.binary.Base64;
import com.good.gd.apache.http.Header;
import com.good.gd.apache.http.HeaderElement;
import com.good.gd.apache.http.HttpEntity;
import com.good.gd.apache.http.HttpResponse;
import com.good.gd.apache.http.HttpResponseInterceptor;
import com.good.gd.apache.http.client.CookieStore;
import com.good.gd.apache.http.client.methods.HttpDelete;
import com.good.gd.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import com.good.gd.apache.http.client.methods.HttpGet;
import com.good.gd.apache.http.client.methods.HttpHead;
import com.good.gd.apache.http.client.methods.HttpOptions;
import com.good.gd.apache.http.client.methods.HttpPost;
import com.good.gd.apache.http.client.methods.HttpPut;
import com.good.gd.apache.http.client.methods.HttpPatch;
import com.good.gd.apache.http.client.methods.HttpTrace;
import com.good.gd.apache.http.client.methods.HttpUriRequest;
import com.good.gd.apache.http.conn.ConnectTimeoutException;
import com.good.gd.apache.http.impl.client.DefaultProxyAuthenticationHandler;
import com.good.gd.apache.http.impl.client.DefaultTargetAuthenticationHandler;
import com.good.gd.apache.http.impl.client.RequestWrapper;
import com.good.gd.apache.http.params.HttpConnectionParams;
import com.good.gd.apache.http.params.HttpParams;
import com.good.gd.apache.http.ParseException;
import com.good.gd.apache.http.protocol.BasicHttpContext;
import com.good.gd.apache.http.protocol.ExecutionContext;
import com.good.gd.apache.http.protocol.HTTP;
import com.good.gd.apache.http.protocol.HttpContext;
import com.good.gd.apache.http.util.EntityUtils;

import com.good.gd.net.GDHttpClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketTimeoutException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.nio.charset.UnsupportedCharsetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import okio.Buffer;


/**
 * Implements the XMLHttpRequest JavaScript interface.
 */
@ReactModule(name = RNReactNativeBbdNetworkingModule.NAME)
public final class RNReactNativeBbdNetworkingModule extends ReactContextBaseJavaModule {

  /**
   * Allows to implement a custom fetching process for specific URIs. It is the handler's job
   * to fetch the URI and return the JS body payload.
   */
  public interface UriHandler {
    /**
     * Returns if the handler should be used for an URI.
     */
    boolean supports(Uri uri, String responseType);

    /**
     * Fetch the URI and return the JS body payload.
     */
    WritableMap fetch(Uri uri) throws IOException;
  }

  /**
   * Allows adding custom handling to build the {@link RequestBody} from the JS body payload.
   */
  public interface RequestBodyHandler {
    /**
     * Returns if the handler should be used for a JS body payload.
     */
    boolean supports(ReadableMap map);

    /**
     * Returns the {@link RequestBody} for the JS body payload.
     */
    RequestBody toRequestBody(ReadableMap map, String contentType);
  }

  /**
   * Allows adding custom handling to build the JS body payload from the {@link ResponseBody}.
   */
  public interface ResponseHandler {
    /**
     * Returns if the handler should be used for a response type.
     */
    boolean supports(String responseType);

    /**
     * Returns the JS body payload for the {@link ResponseBody}.
     */
    WritableMap toResponseData(ResponseBody body) throws IOException;
  }

  protected static final String NAME = "RNReactNativeBbdNetworking";

  private static final String TAG = "RNReactNativeBbdNetworkingModule";

  // JS request properties
  private static final String CONTENT_ENCODING_HEADER_NAME = "content-encoding";
  private static final String CONTENT_TYPE_HEADER_NAME = "content-type";
  private static final String REQUEST_BODY_KEY_STRING = "string";
  private static final String REQUEST_BODY_KEY_URI = "uri";
  private static final String REQUEST_BODY_KEY_FORMDATA = "formData";
  private static final String REQUEST_BODY_KEY_BASE64 = "base64";
  private static final String USER_AGENT_HEADER_NAME = "user-agent";
  private static final int MAX_CHUNK_SIZE_BETWEEN_FLUSHES = 8 * 1024; // 8K
  // JSONObject response data types
  private static final String BLOB_RESPONSE_TYPE = "blob";
  private static final String RESPONSE_TEXT_KEY = "responseText";
  private static final String RESPONSE_BASE64_KEY = "responseBase64";
  // JSONObject response properties
  private static final String RESPONSE_URL = "responseURL";
  private static final String HEADERS_KEY = "headers";
  private static final String STATUS_KEY = "status";
  private static final String STATUS_TEXT_KEY = "statusText";
  private static final String RESPONSE_STATE_KEY = "responseState";
  private static final String REQUEST_ABORTED_KEY = "isAborted";
  private static final String TIMEOUT_KEY = "isTimeout";

  private final GDHttpRequestDelegate gdHttpRequestDelegate = new GDHttpRequestDelegate();
  private final Map<String, HttpUriRequest> requests = new ConcurrentHashMap<String, HttpUriRequest>();
  private final BasicCookieStore cookiestore = new BasicCookieStore();
  private CookieStore persistentCookieStore = null;

  private final @Nullable String mDefaultUserAgent;
  private final List<RequestBodyHandler> mRequestBodyHandlers = new ArrayList<>();
  private final List<UriHandler> mUriHandlers = new ArrayList<>();
  private final List<ResponseHandler> mResponseHandlers = new ArrayList<>();

  private final Map<String, AuthorizeHttpClient> authorizeHttpClients = new ConcurrentHashMap<String, AuthorizeHttpClient>();
  private ForwardingCookieHandler mCookieHandler;

  private ExecutorService executorService;

  public RNReactNativeBbdNetworkingModule(
    @Nonnull ReactApplicationContext reactContext,
    @Nullable String defaultUserAgent) {
    super(reactContext);
    mDefaultUserAgent = defaultUserAgent;
    mCookieHandler = new ForwardingCookieHandler(reactContext);
    executorService = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
  }

  public RNReactNativeBbdNetworkingModule(@Nonnull ReactApplicationContext reactContext) {
    this(reactContext, null);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public boolean canOverrideExistingModule() {
    return true;
  }

  @Override
  public void onCatalystInstanceDestroy() {
    mRequestBodyHandlers.clear();
    mResponseHandlers.clear();
    mUriHandlers.clear();
    requests.clear();
    authorizeHttpClients.clear();
  }

  public void addUriHandler(UriHandler handler) {
    mUriHandlers.add(handler);
  }

  public void addRequestBodyHandler(RequestBodyHandler handler) {
    mRequestBodyHandlers.add(handler);
  }

  public void addResponseHandler(ResponseHandler handler) {
    mResponseHandlers.add(handler);
  }

  public void removeUriHandler(UriHandler handler) {
    mUriHandlers.remove(handler);
  }

  public void removeRequestBodyHandler(RequestBodyHandler handler) {
    mRequestBodyHandlers.remove(handler);
  }

  public void removeResponseHandler(ResponseHandler handler) {
    mResponseHandlers.remove(handler);
  }

  private static class AuthorizeHttpClient {
    private final GDHttpClient httpClient;
    private final HttpContext httpContext;

    private AuthorizeHttpClient(
      final GDHttpClient httpClient,
      final HttpContext httpContext) {

      this.httpClient = httpClient;
      this.httpContext = httpContext;
    }
  }

  private static class RequestParams {

    private final String method;
    private final String url;
    private final int requestId;
    private final String responseType;
    private final boolean useIncrementalUpdates;
    private final int timeout;
    private final boolean withCredentials;
    private final Map<String, String> headers;
    private HttpEntity httpEntity;

    private RequestParams(
      String method,
      String url,
      final int requestId,
      ReadableArray headers,
      ReadableMap data,
      final String responseType,
      final boolean useIncrementalUpdates,
      int timeout,
      boolean withCredentials,
      RequestBodyHandler handler,
      ReactApplicationContext context,
      final OnProgressEvent progressEvent) throws IOException {

      this.method = method;
      this.url = url;
      this.timeout = timeout;
      this.withCredentials = withCredentials;
      this.responseType = responseType;
      this.requestId = requestId;
      this.useIncrementalUpdates = useIncrementalUpdates;

      this.headers = getRequestHeaders(headers);

      String contentTypeStr = null;
      String contentEncoding = null;
      if (this.headers != null) {
        contentEncoding = this.headers.get(CONTENT_ENCODING_HEADER_NAME);
        contentTypeStr = this.headers.get(CONTENT_TYPE_HEADER_NAME);
      }

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
        }
      }

      if (data == null || method.toLowerCase().equals("get") || method.toLowerCase().equals("head")) {
        // Nothing in data payload.
        this.httpEntity = null;
      }
      else if (handler != null) {
        // blob data will be handled by BlobModule using RequestBodyHandler here
        try {
          final RequestBody requestBody = handler.toRequestBody(data, contentTypeStr);
          final Buffer buffer = new Buffer();
          requestBody.writeTo(buffer);
          final byte body[] = buffer.readByteArray();
          if (body.length > 0) {
            this.httpEntity = new ProgressInputStreamEntity(new ByteArrayInputStream(body), body.length, progressEvent);
            ((ProgressInputStreamEntity)this.httpEntity).setContentType(contentTypeStr);
          }
          else {
            // Nothing in data payload.
            this.httpEntity = null;
          }
        }
        catch (Exception e) {
          // Nothing in data payload.
          this.httpEntity = null;
        }
      }
      else if (data.hasKey(REQUEST_BODY_KEY_STRING)) {
        final String body = data.getString(REQUEST_BODY_KEY_STRING);
        if (body != null) {
          if (charsetName != null) {
            if (contentEncoding != null && (contentEncoding.equalsIgnoreCase("gzip"))) {
              final HttpEntity baseEntity = new ProgressStringEntity(body, charsetName, progressEvent);
              ((ProgressStringEntity)this.httpEntity).setContentType(contentTypeStr);
              this.httpEntity = new GzipCompressingEntity(baseEntity);
            }
            else {
              this.httpEntity = new ProgressStringEntity(body, charsetName, progressEvent);
              ((ProgressStringEntity)this.httpEntity).setContentType(contentTypeStr);
            }
          }
          else if (contentTypeStr != null) {
            this.httpEntity = new ProgressStringEntity(body, HTTP.UTF_8, progressEvent);
            ((ProgressStringEntity)this.httpEntity).setContentType(contentTypeStr);
          }
          else {
            this.httpEntity = new ProgressUrlEncodedFormEntity(body, progressEvent);
          }
        }
        else {
          // Nothing in data payload, at least nothing we could understand anyway.
          this.httpEntity = null;
        }
      }
      else if (data.hasKey(REQUEST_BODY_KEY_BASE64)) {
        final String base64String = data.getString(REQUEST_BODY_KEY_BASE64);
        if (base64String != null || contentTypeStr != null) {
          if (charsetName == null) {
            charsetName = HTTP.UTF_8;
          }
          final byte body[] = Base64.decodeBase64(base64String.getBytes(charsetName));
          this.httpEntity = new ProgressInputStreamEntity(new ByteArrayInputStream(body), body.length, progressEvent);
          ((ProgressInputStreamEntity)this.httpEntity).setContentType(contentTypeStr);
        }
        else {
          // Nothing in data payload, at least nothing we could understand anyway.
          this.httpEntity = null;
        }
      }
      else if (data.hasKey(REQUEST_BODY_KEY_URI)) {
        if (contentTypeStr != null) {
          final String uriStr = data.getString(REQUEST_BODY_KEY_URI);
          // retrieve real path and access directly.
          final File file = createFile(uriStr, context);
          if (file != null) {
            this.httpEntity = new ProgressFileEntity(file, contentTypeStr, progressEvent);
          }
          else {
            // no access permission (include "signature" and "signatureOrSystem" protection level) or cannot retrieve real path.
            // access with relative path using ContentProvider.
            try {
              final InputStream is = GDFileUtils.getInputStreamFromUriString(uriStr, context);
              this.httpEntity = new ProgressInputStreamEntity(is, progressEvent);
              ((ProgressInputStreamEntity)this.httpEntity).setContentType(contentTypeStr);
            }
            catch (Exception e) {
              // file unavailable
              this.httpEntity = null;
            }
          }
        }
        else {
          // Nothing Content-Type.
          this.httpEntity = null;
        }
      }
      else if (data.hasKey(REQUEST_BODY_KEY_FORMDATA)) {
        if (contentTypeStr == null) {
          contentTypeStr = "multipart/form-data";
        }
        if (charsetName == null) {
          charsetName = HTTP.UTF_8;
        }
        ReadableArray parts = data.getArray(REQUEST_BODY_KEY_FORMDATA);
        final MultipartEntityBuilder body = createPostBody(parts, contentTypeStr, charsetName, context, progressEvent);
        if (body != null) {
          this.httpEntity = body.build();
          // replace content-type with params(boundary and charset)
          contentTypeStr = this.httpEntity.getContentType().getValue();
          this.headers.put(CONTENT_TYPE_HEADER_NAME, contentTypeStr);
        }
        else {
          // Nothing in data payload, at least nothing we could understand anyway.
          this.httpEntity = null;
        }
      }
      else {
        // Nothing in data payload, at least nothing we could understand anyway.
        this.httpEntity = null;
      }
    }

    private Map<String, String> getRequestHeaders(final ReadableArray headersArray) {
        if (headersArray == null) {
          return null;
        }
        final Map<String, String> map = new HashMap<>();
        for (int headersIdx = 0, size = headersArray.size(); headersIdx < size; headersIdx++) {
          ReadableArray header = headersArray.getArray(headersIdx);
          if (header == null || header.size() != 2) {
            return null;
          }
          String headerName = header.getString(0);
          String headerValue = header.getString(1);
          if (headerName == null || headerValue == null) {
            return null;
          }
          map.put(headerName, headerValue);
        }
        return map;
    }

    private MultipartEntityBuilder createPostBody(
            final ReadableArray body,
            final String contentTypeStr,
            final String charsetName,
            final ReactApplicationContext context,
            final OnProgressEvent progressEvent) {
      final MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();

      final ContentType contentType = ContentType.parse(contentTypeStr);
      multipartEntityBuilder.setContentType(contentType);
      multipartEntityBuilder.setCharset(CharsetUtils.lookup(charsetName));
      // emulates browser compatibility
      multipartEntityBuilder.setLaxMode();

      for (int i = 0, size = body.size(); i < size; i++) {
        final ReadableMap bodyPart = body.getMap(i);
        if (bodyPart == null) {
          // Missing or invalid FormData part.
          return null;
        }

        final String fieldName = bodyPart.getString("fieldName");
        // Determine part's content-type and content-disposition
        final ReadableArray headersArray = bodyPart.getArray("headers");
        Map<String, String> headers = getRequestHeaders(headersArray);
        if (headers == null || fieldName == null) {
          // Missing or invalid header format for FormData part.
          return null;
        }

        ContentType partContentType = null;
        final String contentDisposition = headers.get("content-disposition");
        final String partContentTypeStr = headers.get(CONTENT_TYPE_HEADER_NAME);
        if (partContentTypeStr != null) {
          partContentType = ContentType.parse(partContentTypeStr);
        }

        if (bodyPart.hasKey(REQUEST_BODY_KEY_STRING)) {
          final String bodyValue = bodyPart.getString(REQUEST_BODY_KEY_STRING);
          if (bodyValue == null) {
            // Missing or invalid FormData part.
            return null;
          }
          else if (partContentType == null) {
            partContentType = ContentType.create("text/html", Consts.UTF_8);
          }

          final FormBodyPartBuilder formBodyPartBuilder =
                  FormBodyPartBuilder.create(
                  fieldName,
                  new StringBody(bodyValue, partContentType, progressEvent));

          if (contentDisposition != null) {
            formBodyPartBuilder.addField("content-disposition", contentDisposition);
          }
          // No need to add the content-type header because formBodyPartBuilder gets it explicitly as an
          // argument and doesn't expect it in the field array.
          multipartEntityBuilder.addPart(formBodyPartBuilder.build());
        }
        else if (bodyPart.hasKey(REQUEST_BODY_KEY_URI)) {
          if (partContentType == null) {
            // Binary FormData part needs a content-type header.
            return null;
          }
          // The body part is a "blob", which in React Native just means
          // an object with a `uri` attribute. Optionally, it can also
          // have a `name` and `type` attribute to specify filename and
          // content type (cf. web Blob interface.)
          final String fileUri = bodyPart.getString(REQUEST_BODY_KEY_URI);
          final String fileName = bodyPart.getString("name");
          final String fileType = bodyPart.getString("type");
          if (fileUri == null || fileName == null || fileType == null) {
            // Missing or invalid FormData part.
            return null;
          }
          // retrieve real path and access directly.
          final File file = createFile(fileUri, context);
          if (file != null) {
            final FormBodyPartBuilder formBodyPartBuilder =
                  FormBodyPartBuilder.create(
                  fieldName,
                  new FileBody(file, partContentType, fileName, progressEvent));

            if (contentDisposition != null) {
              formBodyPartBuilder.addField("content-disposition", contentDisposition);
            }
            // No need to add the content-type header because formBodyPartBuilder gets it explicitly as an
            // argument and doesn't expect it in the field array.
            multipartEntityBuilder.addPart(formBodyPartBuilder.build());
          }
          else {
            // no access permission (include "signature" and "signatureOrSystem" protection level) or cannot retrieve real path.
            // access with relative path using ContentProvider.
            try {
              final InputStream is = GDFileUtils.getInputStreamFromUriString(fileUri, context);
              final FormBodyPartBuilder formBodyPartBuilder =
                      FormBodyPartBuilder.create(
                              fieldName,
                              new InputStreamBody(is, partContentType, fileName, progressEvent));

              if (contentDisposition != null) {
                formBodyPartBuilder.addField("content-disposition", contentDisposition);
              }
              // No need to add the content-type header because formBodyPartBuilder gets it explicitly as an
              // argument and doesn't expect it in the field array.
              multipartEntityBuilder.addPart(formBodyPartBuilder.build());

            } catch (Exception e) {
              // file unavailable
              return null;
            }
          }
        }
        else {
          // Unrecognized FormData part.
          return null;
        }
      }
      return multipartEntityBuilder;
    }

    private File createFile(String uri, ReactApplicationContext context) {
      final String path = GDFileUtils.getRealPath(uri, context);
      if (path != null) {
        File file = new File(path);
        if (file.exists()) {
          return file;
        }
        // if does not exist in public, assume it's in secure container.
        file = new com.good.gd.file.File(path);
        if (file.exists()) {
          return file;
        }
        // does not existing in secure container also.
        return null;
      }
      // cannot retrieve real path or no access permission
      return null;
    }

    private Map<String, String> getHeaders() {
          return headers;
    }

    private HttpEntity getEntity() {
          return httpEntity;
    }
  }

  @ReactMethod
  public void sendRequest(
    final String method,
    final String url,
    final int requestId,
    final ReadableArray headers,
    final ReadableMap data,
    final String responseType,
    final boolean useIncrementalUpdates,
    final int timeout,
    final boolean withCredentials) {

    final RCTDeviceEventEmitter eventEmitter = getEventEmitter();

    final OnProgressEvent progressEventCallback = new OnProgressEvent() {
      @Override
      public void publishProgress(final int progress,
                                  final long loaded,
                                  final long total) {
        FLog.d(TAG, "sending - progress: %d loaded: %d total: %d", progress, loaded, total);
        // handle request body progress
        ResponseUtil.onDataSend(
          eventEmitter,
          requestId,
          loaded,
          total);
      }
    };

    try {
      Uri uri = Uri.parse(url);
      // Check if a handler is registered for Uri
      for (UriHandler handler : mUriHandlers) {
        if (handler.supports(uri, responseType)) {
          // local contents will be handled by BlobModule using UriHandler here
          final WritableMap res = handler.fetch(uri);
          ResponseUtil.onDataReceived(eventEmitter, requestId, res);
          ResponseUtil.onRequestSuccess(eventEmitter, requestId);
          return;
        }
      }
    } catch (IOException e) {
      ResponseUtil.onRequestError(eventEmitter, requestId, e.getMessage(), e);
      return;
    }

    // Check if a handler is registered for RequestBody
    RequestBodyHandler handler = null;
    if (data != null) {
      for (RequestBodyHandler curHandler : mRequestBodyHandlers) {
        if (curHandler.supports(data)) {
          handler = curHandler;
          break;
        }
      }
    }

    final RequestBodyHandler finalHandler = handler;
    executorService.submit(new Runnable() {
      @Override
      public void run() {
        try {
          final RequestParams requestParams = new RequestParams(
            method,
            url,
            requestId,
            headers,
            data,
            responseType,
            useIncrementalUpdates,
            timeout,
            withCredentials,
            finalHandler,
            getReactApplicationContext(),
            progressEventCallback);

          executeRequest(requestParams);
        } catch (Throwable th) {
          FLog.e(TAG, "Failed to send url request: " + url, th);
          ResponseUtil.onRequestError(eventEmitter, requestId, th.getMessage(), th);
        }
      }
    });
  }

  private void executeRequest(final RequestParams requestParams) throws JSONException {
    final RCTDeviceEventEmitter eventEmitter = getEventEmitter();

    GDHttpClient gdHttpClient = null;
    HttpContext httpContext = null;
    final Uri uri = Uri.parse(requestParams.url);
    final String httpHost = uri.getHost();

    // retrieve gdHttpClient and HttpContext if app request any http authorization,
    // allow app to continue http authorization sequence.
    if (requestParams.headers.containsKey("authorization")
            || requestParams.headers.containsKey("proxy-authorization")) {
      final AuthorizeHttpClient authHttpClient = authorizeHttpClients.get(httpHost);
      if (authHttpClient != null) {
        gdHttpClient = authHttpClient.httpClient;
        httpContext = authHttpClient.httpContext;
      }
    }

    if (gdHttpClient == null) {
      gdHttpClient = gdHttpRequestDelegate.getHttpClient();
      httpContext = new BasicHttpContext();

      gdHttpClient.addResponseInterceptor(new HttpResponseInterceptor() {
        @Override
        public void process(final HttpResponse response, final HttpContext context) throws IOException {
          // interceptor process would be called for received response headers or entity
          HttpEntity entity = response.getEntity();
          if (entity != null) {
            Header ceheader = entity.getContentEncoding();
            if (ceheader != null) {
              HeaderElement[] codecs = ceheader.getElements();
              for (int i = 0; i < codecs.length; i++) {
                if (codecs[i].getName().equalsIgnoreCase("gzip")) {
                  response.setEntity( new GzipDecompressingEntity(response.getEntity()));
                  entity = response.getEntity();
                }
              }
            }

            // If JS is listening for progress updates, install a ProgressResponseBody that intercepts the
            // response and counts bytes received.
            if (requestParams.useIncrementalUpdates) {
              if (requestParams.responseType.equals("text")) {
                // For 'text' responses we continuously send response data with progress info to
                // JS below, so no need to do anything here.
                return;
              }

              // data received progress would be reported in one time.
              // that's http client restriction for now.
              if (entity != null) {
                final long contentLength = entity.getContentLength();
                ResponseUtil.onDataReceivedProgress(eventEmitter, requestParams.requestId, contentLength, contentLength);
              }
            }
          }
        }
      });

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

      // get built-in persistent CookieStore
      persistentCookieStore = gdHttpClient.getCookieStore();

      if(requestParams.withCredentials) {
        Map<String, List<String>> cookieMap = null;
        try {
          cookieMap = mCookieHandler.get(new URI(requestParams.url), new HashMap<String, List<String>>());
          requestParams.headers.put("Cookie", cookieMap.get("Cookie").get(0));
        } catch (IOException | URISyntaxException | NullPointerException e) {
          FLog.e(TAG, "Could not attach cookie header.");
        }
      }

      if (!requestParams.withCredentials) {
        cookiestore.noCookies(true);
        gdHttpClient.setCookieStore(cookiestore);
      }
    }

    final HttpUriRequest request = buildRequestFromArguments(requestParams);

    if (requestParams.timeout > 0) {
      setTimeOut(gdHttpClient, requestParams.timeout);
    }

    requests.put(String.valueOf(requestParams.requestId), request);

    final HttpResponse httpResponse;
    try {
      httpResponse = gdHttpRequestDelegate.httpClientExecute(gdHttpClient, request, httpContext);

      if (request.isAborted()) {
        ResponseUtil.onRequestError(
          eventEmitter,
          requestParams.requestId,
          "Aborted executing request: " + requestParams.url,
          null);
      }
      else {
        final int httpStatus = Integer.parseInt(buildStatusString(httpResponse));
        ResponseUtil.onResponseReceived(
                eventEmitter,
                requestParams.requestId,
                httpStatus,
                translateHeaders(httpResponse.getAllHeaders()),
                buildResponseUrlString(httpContext));

        // store gdHttpClient and HttpContext if status is "401 Unauthorized" or "407 Proxy Authentication Required",
        // allow app to continue http authorization sequence.
        if ((httpStatus == 401 || httpStatus == 407) && httpHost != null) {
          authorizeHttpClients.put(httpHost, new AuthorizeHttpClient(gdHttpClient, httpContext));
        }
        else if (httpHost != null && authorizeHttpClients.containsKey(httpHost)) {
          authorizeHttpClients.remove(httpHost);
        }

        // Check if a handler is registered
        for (ResponseHandler handler : mResponseHandlers) {
          if (handler.supports(requestParams.responseType)) {
            // blob data will be handled by BlobModule using ResponseHandler here
            final HttpEntity entity = httpResponse.getEntity();
            if (entity != null && entity.getContentLength() != 0) {
              final byte[] content = EntityUtils.toByteArray(entity);
              if (content.length > 0) {
                final Header header = entity.getContentType();
                final String contentTypeStr = header.getValue();
                final ResponseBody responseBody = ResponseBody.create(MediaType.parse(contentTypeStr), content);
                final WritableMap res = handler.toResponseData(responseBody);
                ResponseUtil.onDataReceived(eventEmitter, requestParams.requestId, res);
                ResponseUtil.onRequestSuccess(eventEmitter, requestParams.requestId);
                requests.remove(String.valueOf(requestParams.requestId));
                return;
              }
            }
            ResponseUtil.onDataReceived(eventEmitter, requestParams.requestId, "");
            ResponseUtil.onRequestSuccess(eventEmitter, requestParams.requestId);
            requests.remove(String.valueOf(requestParams.requestId));
            return;
          }
        }

        // If JS wants progress updates during the download, and it requested a text response,
        // periodically send response data updates to JS.
        if (requestParams.useIncrementalUpdates && requestParams.responseType.equals("text")) {
          readWithProgress(eventEmitter, requestParams.requestId, httpResponse);
          ResponseUtil.onRequestSuccess(eventEmitter, requestParams.requestId);
          requests.remove(String.valueOf(requestParams.requestId));
          return;
        }

        // Otherwise send the data in one big chunk, in the format that JS requested.
        String responseString = "";
        final JSONObject responseJson = handleResponse(httpResponse,requestParams, httpContext);

        if (requestParams.responseType.equals("text")) {
          responseString = responseJson.getString(RESPONSE_TEXT_KEY);
        }
        else if (requestParams.responseType.equals("base64")){
          responseString = responseJson.getString(RESPONSE_BASE64_KEY);
        }
        else if (requestParams.responseType.equals("blob")) {
          // blob: do not support here
          // blob data will be handled by BlobModule using ResponseHandler
          responseString = "";
        }
        else {
          // default response is text
          responseString = responseJson.getString(RESPONSE_TEXT_KEY);
        }
        ResponseUtil.onDataReceived(eventEmitter, requestParams.requestId, responseString);
        ResponseUtil.onRequestSuccess(eventEmitter, requestParams.requestId);
      }
      requests.remove(String.valueOf(requestParams.requestId));

    }
    catch (final ConnectTimeoutException exception) {
      final String errorMessage;
      if (request.isAborted()) {
        errorMessage = "ConnectTimeoutException while executing request and aborted: " + requestParams.url;
      }
      else {
        errorMessage = "ConnectTimeoutException while executing request: " + requestParams.url;
      }
      ResponseUtil.onRequestError(eventEmitter, requestParams.requestId, errorMessage, exception);

      requests.remove(String.valueOf(requestParams.requestId));

    } catch (final SocketTimeoutException exception) {
      final String errorMessage;
      if (request.isAborted()) {
        errorMessage = "SocketTimeoutException while executing request and aborted: " + requestParams.url;
      }
      else {
        errorMessage = "SocketTimeoutException while executing request: " + requestParams.url;
      }
      ResponseUtil.onRequestError(eventEmitter, requestParams.requestId, errorMessage, exception);

      requests.remove(String.valueOf(requestParams.requestId));

    }
    catch (final IOException exception) {
      final String errorMessage;
      if (request.isAborted()) {
        errorMessage = "IOException while executing request and aborted: " + requestParams.url;
      }
      else {
        errorMessage = "IOException while executing request: " + requestParams.url;
      }
      ResponseUtil.onRequestError(eventEmitter, requestParams.requestId, errorMessage, exception);

      requests.remove(String.valueOf(requestParams.requestId));
    }
  }

  private JSONObject buildAbortResponse() throws JSONException {
    final JSONObject jsonObject = new JSONObject();
    jsonObject.put(REQUEST_ABORTED_KEY, true);
    jsonObject.put(TIMEOUT_KEY, false);

    return jsonObject;
  }

  private JSONObject handleResponse(
    final HttpResponse response,
    RequestParams requestParams,
    HttpContext requestContext) throws JSONException {

    final JSONObject answer = new JSONObject();
    final String headersString = buildHeadersString(response);
    final String statusString = buildStatusString(response);
    final String statusText = buildStatusText(response);
    final String responseStateString = buildResponseStateString(response);
    final String responseUrl = buildResponseUrlString(requestContext);

    if (requestParams.responseType.equals("base64")){
      answer.put(RESPONSE_BASE64_KEY, buildBase64Response(response));
      answer.put(RESPONSE_TEXT_KEY, "");
    }
    else if (requestParams.responseType.equals("blob")) {
      // blob: do not support here
      // blob data will be handled by BlobModule using ResponseHandler
      answer.put(RESPONSE_TEXT_KEY, "");
    }
    else {
       // default response is text
      answer.put(RESPONSE_TEXT_KEY, buildResponseText(response).replaceAll("\\P{Print}", ""));
    }

    answer.put(HEADERS_KEY, headersString);
    answer.put(STATUS_KEY, statusString);
    answer.put(STATUS_TEXT_KEY, statusText);
    answer.put(RESPONSE_STATE_KEY, responseStateString);
    answer.put(REQUEST_ABORTED_KEY, false);
    answer.put(TIMEOUT_KEY, false);
    answer.put(RESPONSE_URL, responseUrl);

    return answer;
  }

  private String buildBase64Response(final HttpResponse response) {
    HttpEntity entity = response.getEntity();
    byte[] responseBytes;
    try {
      responseBytes = EntityUtils.toByteArray(entity);

      byte[] base64encoded = Base64.encodeBase64(responseBytes);

      return new String(base64encoded, Charset.forName("UTF-8"));
    }
    catch (IOException e) {
      Log.e(getClass().getSimpleName(),"buildBase64Response "+e);
    }

    return null;
  }

  private String buildHeadersString(final HttpResponse response) {
    final StringBuilder headersString = new StringBuilder();
    final Header headers[] = response.getAllHeaders();
    for (int i = 0; i < headers.length; i++) {
      final Header header = headers[i];
      headersString.append(header.getName());
      headersString.append(":");
      if (header.getValue() != null) {
        headersString.append(header.getValue());
      }
      if (i != headers.length - 1) {
        headersString.append("\n");
      }
    }
    return headersString.toString();
  }

  private String buildStatusString(final HttpResponse response) {
    return Integer.toString(response.getStatusLine().getStatusCode());
  }

  private String buildStatusText(final HttpResponse response) {
    return response.getStatusLine().toString();
  }

  private String buildResponseUrlString(final HttpContext context) {
    try {
      RequestWrapper currentRequest = (RequestWrapper) context.getAttribute(
              ExecutionContext.HTTP_REQUEST
      );

      return currentRequest.getOriginal()
              .getRequestLine()
              .getUri();
    }
    catch (final RuntimeException exception) {
      Log.e(getClass().getSimpleName(), "buildResponseUrlString " + exception);
      return "";
    }
  }

  private String buildResponseStateString(final HttpResponse response) {
    return "";
  }

  private String buildResponseText(final HttpResponse response) {
    String responseText = "";
    try {
      final HttpEntity entity = response.getEntity();
      if (entity != null) {
        responseText = gdHttpRequestDelegate.getHttpEntityAsString(entity);
      }
    }
    catch (final IOException ioException) {
      return responseText;
    }
    return responseText;
  }

  private void setTimeOut(final GDHttpClient httpClient, final int timeout) {
    final HttpParams httpParams = httpClient.getParams();
    HttpConnectionParams.setConnectionTimeout(httpParams, timeout);
    HttpConnectionParams.setSoTimeout(httpParams, timeout);
  }

  private HttpUriRequest buildRequestFromArguments(final RequestParams params) {
    final String requestTypeLowerCase = params.method.toLowerCase();
    final String url = params.url;

    final HttpUriRequest request;
    if (requestTypeLowerCase.equals("post")) {
      request = new HttpPost(url);
    }
    else if (requestTypeLowerCase.equals("get")) {
      request = new HttpGet(url);
    }
    else if (requestTypeLowerCase.equals("put")) {
      request = new HttpPut(url);
    }
    else if (requestTypeLowerCase.equals("patch")) {
      request = new HttpPatch(url);
    }
    else if (requestTypeLowerCase.equals("delete")) {
      request = new HttpDelete(url);
    }
    else if (requestTypeLowerCase.equals("head")) {
      request = new HttpHead(url);
    }
    else if (requestTypeLowerCase.equals("trace")) {
      request = new HttpTrace(url);
    }
    else if (requestTypeLowerCase.equals("options")) {
      request = new HttpOptions(url);
    }
    else {
      request = new CustomHttpMethod(requestTypeLowerCase, url);
    }

    if (params.getHeaders() != null) {
      addHeadersToRequest(request, params.getHeaders());
    }

    if (!request.containsHeader(USER_AGENT_HEADER_NAME) && mDefaultUserAgent != null ) {
      request.setHeader(USER_AGENT_HEADER_NAME, mDefaultUserAgent);
    }

    if (request instanceof HttpEntityEnclosingRequestBase
            && params.getEntity() != null) {
      ((HttpEntityEnclosingRequestBase) request)
              .setEntity(params.getEntity());

      request.setHeader("X-Requested-With", "XMLHttpRequest");
    }

    return request;
  }

  private void addHeadersToRequest(final HttpUriRequest request, final Map<String, String> headers) {
    for (Map.Entry<String, String> header : headers.entrySet()) {
      final String key = header.getKey();
      final String value = header.getValue();
      request.setHeader(key, value);
    }
  }


  private void readWithProgress(
    RCTDeviceEventEmitter eventEmitter,
    int requestId,
    final HttpResponse response) throws IOException {

    final HttpEntity entity = response.getEntity();
    if (entity == null) {
      return;
    }

    String charset = EntityUtils.getContentCharSet(entity);
    if (charset == null) {
      charset = HTTP.UTF_8;
    }

    byte[] content = EntityUtils.toByteArray(entity);
    long contentLength = content.length;
    long totalBytesRead = 0;

    ProgressiveStringDecoder streamDecoder = new ProgressiveStringDecoder(Charset.forName(charset));
    InputStream inputStream = new ByteArrayInputStream(content);

    try {
      byte[] buffer = new byte[MAX_CHUNK_SIZE_BETWEEN_FLUSHES];
      int read;
      while ((read = inputStream.read(buffer)) != -1) {
        ResponseUtil.onIncrementalDataReceived(
          eventEmitter,
          requestId,
          streamDecoder.decodeNext(buffer, read),
          totalBytesRead += read,
          contentLength);
      }
    }
    finally {
      inputStream.close();
    }
  }

  private static WritableMap translateHeaders(Header[] headers) {
    WritableMap responseHeaders = Arguments.createMap();
    for (int i = 0; i < headers.length; i++) {
      String headerName = headers[i].getName();
      // multiple values for the same header
      if (responseHeaders.hasKey(headerName)) {
        responseHeaders.putString(
                headerName,
                responseHeaders.getString(headerName) + ", " + headers[i].getValue());
      }
      else {
        responseHeaders.putString(headerName, headers[i].getValue());
      }
    }
    return responseHeaders;
  }

  private static class CustomHttpMethod extends HttpEntityEnclosingRequestBase {
    private final String methodName;
    public CustomHttpMethod(final String methodName) {
      super();
      this.methodName = methodName;
    }

    public CustomHttpMethod(final String methodName, final URI uri) {
      this(methodName);
      setURI(uri);
    }

    public CustomHttpMethod(final String methodName, final String uri) {
      this(methodName);
      setURI(URI.create(uri));
    }

    @Override
    public String getMethod() {
      return methodName;
    }
  }

  @ReactMethod
  public void abortRequest(final int requestId) {
    final HttpUriRequest request = requests.get(String.valueOf(requestId));
    if (request != null) {
      request.abort();
    }
  }

  @ReactMethod
  public void clearCookies(com.facebook.react.bridge.Callback callback) {
    cookiestore.clear();
    if (persistentCookieStore != null) {
      persistentCookieStore.clear();
    }
    if (callback != null) {
      callback.invoke(true);
    }
  }

  private RCTDeviceEventEmitter getEventEmitter() {
    return getReactApplicationContext().getJSModule(RCTDeviceEventEmitter.class);
  }

}