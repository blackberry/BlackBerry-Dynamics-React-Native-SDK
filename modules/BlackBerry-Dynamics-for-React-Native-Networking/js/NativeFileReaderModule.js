/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original fetch API from Networking of react-native
 * from https://github.com/facebook/react-native/blob/0.70-stable/Libraries/Blob/NativeFileReaderModule.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import * as TurboModuleRegistry from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export interface Spec extends TurboModule {
  +readAsDataURL: (data: Object) => Promise<string>;
  +readAsText: (data: Object, encoding: string) => Promise<string>;
}

export default (TurboModuleRegistry.getEnforcing<Spec>(
  'RNReactNativeBbdFileReader',
): Spec);
