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

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

import java.net.URL;
import java.util.ArrayList;

public class UploadParams {
    public interface onUploadComplete{
        void onUploadComplete(UploadResult res);
    }
    public interface onUploadProgress{
        void onUploadProgress(int totalBytesExpectedToSend,int totalBytesSent);
    }
    public interface onUploadBegin{
        void onUploadBegin();
    }
    public URL src;
    public ArrayList<ReadableMap> files;
    public boolean binaryStreamOnly;
    public String name;
    public ReadableMap headers;
    public ReadableMap fields;
    public String method;
    public onUploadComplete onUploadComplete;
    public onUploadProgress onUploadProgress;
    public onUploadBegin onUploadBegin;
    public ReactApplicationContext context;
}
