/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original @react-native-community/async-storage package version 1.18.0
 * from https://github.com/react-native-community/async-storage/
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-ignore Module '"react-native"' has no exported member 'TurboModuleRegistry'.
import { NativeModules, TurboModuleRegistry } from 'react-native';
import { shouldFallbackToLegacyNativeModule } from './shouldFallbackToLegacyNativeModule';

let RCTAsyncStorage =
  
  NativeModules['RNReactNativeBbdAsyncStorage'] ||
  NativeModules['RNCAsyncStorage'];
  NativeModules['PlatformLocalStorage'] // Support for external modules, like react-native-windows

if (!RCTAsyncStorage && shouldFallbackToLegacyNativeModule()) {
  // TurboModuleRegistry falls back to NativeModules so we don't have to try go
  // assign NativeModules' counterparts if TurboModuleRegistry would resolve
  // with undefined.
  if (TurboModuleRegistry) {
    RCTAsyncStorage =
      TurboModuleRegistry.get('AsyncSQLiteDBStorage') ||
      TurboModuleRegistry.get('AsyncLocalStorage');
  } else {
    RCTAsyncStorage =
      NativeModules['AsyncSQLiteDBStorage'] ||
      NativeModules['AsyncLocalStorage'];
  }
}

export default RCTAsyncStorage;
