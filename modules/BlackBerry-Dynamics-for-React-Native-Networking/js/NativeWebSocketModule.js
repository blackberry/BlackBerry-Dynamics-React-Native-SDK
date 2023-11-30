/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original WebSocket API of react-native
 * from https://github.com/facebook/react-native/tree/0.70-stable/Libraries/WebSocket
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
  +connect: (
    url: string,
    protocols: ?Array<string>,
    options: {|headers?: Object|},
    socketID: number,
  ) => void;
  +send: (message: string, forSocketID: number) => void;
  +sendBinary: (base64String: string, forSocketID: number) => void;
  +ping: (socketID: number) => void;
  +close: (code: number, reason: string, socketID: number) => void;

  // RCTEventEmitter
  +addListener: (eventName: string) => void;
  +removeListeners: (count: number) => void;
}

export default (TurboModuleRegistry.getEnforcing<Spec>(
  'BbdRNWebSocketModule',
): Spec);
