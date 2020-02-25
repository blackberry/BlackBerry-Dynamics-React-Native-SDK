/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Blob API of react-native (Java part)
 * from https://github.com/facebook/react-native/blob/0.61-stable/ReactAndroid/src/main/java/com/facebook/react/modules/blob/FileReaderModule.java
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * <p>This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 */

package com.blackberry.bbd.reactnative.networking;

import android.util.Base64;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;


@ReactModule(name = RNReactNativeBbdFileReaderModule.NAME)
public class RNReactNativeBbdFileReaderModule extends ReactContextBaseJavaModule {

  protected static final String NAME = "RNReactNativeBbdFileReader";
  private static final String ERROR_INVALID_BLOB = "ERROR_INVALID_BLOB";

  public RNReactNativeBbdFileReaderModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  private RNReactNativeBbdBlobModule getBlobModule() {
    return getReactApplicationContext().getNativeModule(RNReactNativeBbdBlobModule.class);
  }

  @ReactMethod
  public void readAsText(ReadableMap blob, String encoding, Promise promise) {

    byte[] bytes = getBlobModule().resolve(
        blob.getString("blobId"),
        blob.getInt("offset"),
        blob.getInt("size"));

    if (bytes == null) {
      promise.reject(ERROR_INVALID_BLOB, "The specified blob is invalid");
      return;
    }

    try {
      promise.resolve(new String(bytes, encoding));
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void readAsDataURL(ReadableMap blob, Promise promise) {
    byte[] bytes = getBlobModule().resolve(
        blob.getString("blobId"),
        blob.getInt("offset"),
        blob.getInt("size"));

    if (bytes == null) {
      promise.reject(ERROR_INVALID_BLOB, "The specified blob is invalid");
      return;
    }

    try {
      StringBuilder sb = new StringBuilder();
      sb.append("data:");

      if (blob.hasKey("type") && !blob.getString("type").isEmpty()) {
        sb.append(blob.getString("type"));
      } else {
        sb.append("application/octet-stream");
      }

      sb.append(";base64,");
      sb.append(Base64.encodeToString(bytes, Base64.NO_WRAP));

      promise.resolve(sb.toString());
    } catch (Exception e) {
      promise.reject(e);
    }
  }
}
