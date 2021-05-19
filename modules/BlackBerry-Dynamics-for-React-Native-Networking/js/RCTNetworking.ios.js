/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Networking module of react-native (JavaScript part)
 * from https://github.com/facebook/react-native/blob/0.61-stable/Libraries/Network/RCTNetworking.ios.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

import { NativeEventEmitter } from 'react-native/index';

import convertRequestBody from './convertRequestBody';

import NativeNetworkingIOS from './NativeNetworkingIOS';
import type {NativeResponseType} from './XMLHttpRequest';
import type {RequestBody} from './convertRequestBody';

class BbdRCTNetworking extends NativeEventEmitter {
  constructor() {
    super(NativeNetworkingIOS);
  }

  sendRequest(
    method: string,
    trackingName: string,
    url: string,
    headers: Object,
    data: RequestBody,
    responseType: NativeResponseType,
    incrementalUpdates: boolean,
    timeout: number,
    callback: (requestId: number) => void,
    withCredentials: boolean,
  ) {
    const body = convertRequestBody(data);
    NativeNetworkingIOS.sendRequest(
      {
        method,
        url,
        data: {...body, trackingName},
        headers,
        responseType,
        incrementalUpdates,
        timeout,
        withCredentials,
      },
      callback,
    );
  }

  abortRequest(requestId: number) {
    NativeNetworkingIOS.abortRequest(requestId);
  }

  clearCookies(callback: (result: boolean) => void) {
    NativeNetworkingIOS.clearCookies(callback);
  }
}

module.exports = (new BbdRCTNetworking(): BbdRCTNetworking);
