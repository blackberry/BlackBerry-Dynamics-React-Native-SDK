/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

import com.good.gd.apache.http.client.methods.HttpGet;
import com.good.gd.apache.http.impl.client.DefaultProxyAuthenticationHandler;
import com.good.gd.apache.http.impl.client.DefaultTargetAuthenticationHandler;
import com.good.gd.net.GDHttpClient;

import com.good.gd.apache.http.Header;
import com.good.gd.apache.http.HttpEntity;
import com.good.gd.apache.http.HttpResponse;
import com.good.gd.apache.http.client.methods.HttpUriRequest;
import com.good.gd.apache.http.params.HttpConnectionParams;
import com.good.gd.apache.http.params.HttpParams;
import com.good.gd.apache.http.protocol.BasicHttpContext;
import com.good.gd.apache.http.protocol.HttpContext;
import com.good.gd.apache.http.util.EntityUtils;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

import android.util.Log;

import android.os.AsyncTask;

import com.facebook.react.bridge.ReadableMapKeySetIterator;

public class Downloader extends AsyncTask<DownloadParams, long[], DownloadResult> {
  private DownloadParams mParam;
  private AtomicBoolean mAbort = new AtomicBoolean(false);
  private HttpUriRequest mRequest = null;
  DownloadResult res;

  protected DownloadResult doInBackground(DownloadParams... params) {
    mParam = params[0];
    res = new DownloadResult();

    new Thread(new Runnable() {
      public void run() {
        try {
          download(mParam, res);
          mParam.onTaskCompleted.onTaskCompleted(res);
        } catch (Exception ex) {
          res.exception = ex;
          mParam.onTaskCompleted.onTaskCompleted(res);
        }
      }
    }).start();

    return res;
  }

  private void download(DownloadParams param, DownloadResult res) throws Exception {
    InputStream input = null;
    OutputStream output = null;

    try {
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

      final HttpParams httpParams = gdHttpClient.getParams();
      if (param.connectionTimeout != 0) {
        HttpConnectionParams.setConnectionTimeout(httpParams, param.connectionTimeout);
      }
      if (param.readTimeout != 0) {
        HttpConnectionParams.setSoTimeout(httpParams, param.readTimeout);
      }

      final HttpUriRequest request = new HttpGet(param.src.toString());

      ReadableMapKeySetIterator iterator = param.headers.keySetIterator();

      while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        String value = param.headers.getString(key);
        request.setHeader(key, value);
      }

      mRequest = request;
      final HttpResponse httpResponse = gdHttpClient.execute(request, httpContext);
      mRequest = null;

      if (request.isAborted()) {
        throw new Exception("Download has been aborted");
      }

      int statusCode = httpResponse.getStatusLine().getStatusCode();
      long lengthOfFile = 0;

      if(statusCode >= 200 && statusCode < 300) {
        final Header headers[] = httpResponse.getAllHeaders();
        Map<String, String> headersFlat = new HashMap<>();

        for (int i = 0; i < headers.length; i++) {
          final Header header = headers[i];
          String headerKey = header.getName();
          String valueKey = header.getValue();

          if (headerKey != null && valueKey != null) {
            headersFlat.put(headerKey, valueKey);
          }
        }

        if (mParam.onDownloadBegin != null) {
          mParam.onDownloadBegin.onDownloadBegin(statusCode, lengthOfFile, headersFlat);
        }

        final HttpEntity entity = httpResponse.getEntity();
        if (entity != null && entity.getContentLength() != 0) {
          lengthOfFile = entity.getContentLength();
          final byte[] content = EntityUtils.toByteArray(entity);
          input = new ByteArrayInputStream(content);
          output = param.dest;

          byte data[] = new byte[8 * 1024];
          long total = 0;
          int count;
          double lastProgressValue = 0;
          long lastProgressEmitTimestamp = 0;
          boolean hasProgressCallback = mParam.onDownloadProgress != null;

          while ((count = input.read(data)) != -1) {
            if (mAbort.get()) throw new Exception("Download has been aborted");

            total += count;

            if (hasProgressCallback) {
              if (param.progressInterval > 0) {
                long timestamp = System.currentTimeMillis();
                if (timestamp - lastProgressEmitTimestamp > param.progressInterval) {
                  lastProgressEmitTimestamp = timestamp;
                  publishProgress(new long[]{lengthOfFile, total});
                }
              } else if (param.progressDivider <= 0) {
                publishProgress(new long[]{lengthOfFile, total});
              } else {
                double progress = Math.round(((double) total * 100) / lengthOfFile);
                if (progress % param.progressDivider == 0) {
                  if ((progress != lastProgressValue) || (total == lengthOfFile)) {
                    Log.d("Downloader", "EMIT: " + progress + ", TOTAL:" + total);
                    lastProgressValue = progress;
                    publishProgress(new long[]{lengthOfFile, total});
                  }
                }
              }
            }

            output.write(data, 0, count);
          }

          output.flush();
          res.bytesWritten = total;
        }
      }
      res.statusCode = statusCode;
  } finally {
      if (output != null) output.close();
      if (input != null) input.close();
    }
  }

  protected void stop() {
    if (mRequest != null) {
      mRequest.abort();
    }
    mAbort.set(true);
  }

  @Override
  protected void onProgressUpdate(long[]... values) {
    super.onProgressUpdate(values);
    if (mParam.onDownloadProgress != null) {
      mParam.onDownloadProgress.onDownloadProgress(values[0][0], values[0][1]);
    }
  }

  protected void onPostExecute(Exception ex) {

  }
}
