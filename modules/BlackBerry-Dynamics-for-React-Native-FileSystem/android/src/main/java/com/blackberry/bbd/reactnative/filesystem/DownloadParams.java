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

import java.io.OutputStream;
import java.net.URL;
import java.util.*;

import com.facebook.react.bridge.ReadableMap;

public class DownloadParams {
  public interface OnTaskCompleted {
    void onTaskCompleted(DownloadResult res);
  }

  public interface OnDownloadBegin {
    void onDownloadBegin(int statusCode, long contentLength, Map<String, String> headers);
  }

  public interface OnDownloadProgress {
    void onDownloadProgress(long contentLength, long bytesWritten);
  }

  public URL src;
  public OutputStream dest;
  public ReadableMap headers;
  public int progressInterval;
  public float progressDivider;
  public int readTimeout;
  public int connectionTimeout;
  public OnTaskCompleted onTaskCompleted;
  public OnDownloadBegin onDownloadBegin;
  public OnDownloadProgress onDownloadProgress;
}