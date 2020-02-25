/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original @react-native-community/async-storage
 * from https://github.com/react-native-community/async-storage/
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.blackberry.bbd.reactnative.asyncstorage;

import javax.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

/**
 * Helper class for database errors.
 */
public class AsyncStorageErrorUtil {

  /**
   * Create Error object to be passed back to the JS callback.
   */
  /* package */ public static WritableMap getError(@Nullable String key, String errorMessage) {
    WritableMap errorMap = Arguments.createMap();
    errorMap.putString("message", errorMessage);
    if (key != null) {
      errorMap.putString("key", key);
    }
    return errorMap;
  }

  /* package */ public static WritableMap getInvalidKeyError(@Nullable String key) {
    return getError(key, "Invalid key");
  }

  /* package */ public static WritableMap getInvalidValueError(@Nullable String key) {
    return getError(key, "Invalid Value");
  }

  /* package */ public static WritableMap getDBError(@Nullable String key) {
    return getError(key, "Database Error");
  }


}
