/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
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

package com.blackberry.bbd.reactnative.networking.core;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import java.io.IOException;
import java.net.SocketTimeoutException;

/**
 * Util methods to send network responses to JS.
 */
public class ResponseUtil {
    public static void onDataSend(
            RCTDeviceEventEmitter eventEmitter,
            int requestId,
            long progress,
            long total) {
        WritableArray args = Arguments.createArray();
        args.pushInt(requestId);
        args.pushInt((int) progress);
        args.pushInt((int) total);
        eventEmitter.emit("didSendNetworkData", args);
    }

    public static void onIncrementalDataReceived(
            RCTDeviceEventEmitter eventEmitter,
            int requestId,
            String data,
            long progress,
            long total) {
        WritableArray args = Arguments.createArray();
        args.pushInt(requestId);
        args.pushString(data);
        args.pushInt((int) progress);
        args.pushInt((int) total);

        eventEmitter.emit("didReceiveNetworkIncrementalData", args);
    }

    public static void onDataReceivedProgress(
            RCTDeviceEventEmitter eventEmitter,
            int requestId,
            long progress,
            long total) {
        WritableArray args = Arguments.createArray();
        args.pushInt(requestId);
        args.pushInt((int) progress);
        args.pushInt((int) total);

        eventEmitter.emit("didReceiveNetworkDataProgress", args);
    }

    public static void onDataReceived(
            RCTDeviceEventEmitter eventEmitter,
            int requestId,
            String data) {
        WritableArray args = Arguments.createArray();
        args.pushInt(requestId);
        args.pushString(data);

        eventEmitter.emit("didReceiveNetworkData", args);
    }

    public static void onDataReceived(
            RCTDeviceEventEmitter eventEmitter,
            int requestId,
            WritableMap data) {
        WritableArray args = Arguments.createArray();
        args.pushInt(requestId);
        args.pushMap(data);

        eventEmitter.emit("didReceiveNetworkData", args);
    }

    public static void onRequestError(
            RCTDeviceEventEmitter eventEmitter,
            int requestId,
            String error,
            Throwable e) {
        WritableArray args = Arguments.createArray();
        args.pushInt(requestId);
        args.pushString(error);

        if ((e != null) && (e.getClass() == SocketTimeoutException.class)) {
            args.pushBoolean(true); // last argument is a time out boolean
        }

        eventEmitter.emit("didCompleteNetworkResponse", args);
    }

    public static void onRequestSuccess(RCTDeviceEventEmitter eventEmitter, int requestId) {
        WritableArray args = Arguments.createArray();
        args.pushInt(requestId);
        args.pushNull();

        eventEmitter.emit("didCompleteNetworkResponse", args);
    }

    public static void onResponseReceived(
            RCTDeviceEventEmitter eventEmitter,
            int requestId,
            int statusCode,
            WritableMap headers,
            String url) {
        WritableArray args = Arguments.createArray();
        args.pushInt(requestId);
        args.pushInt(statusCode);
        args.pushMap(headers);
        args.pushString(url);

        eventEmitter.emit("didReceiveNetworkResponse", args);
    }
}
