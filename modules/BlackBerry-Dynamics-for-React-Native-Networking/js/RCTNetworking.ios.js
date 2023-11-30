/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Networking module of react-native (JavaScript part)
 * from https://github.com/facebook/react-native/blob/0.70-stable/Libraries/Network/RCTNetworking.ios.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import RCTDeviceEventEmitter from 'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter';
import NativeNetworkingIOS from './NativeNetworkingIOS';
import {type NativeResponseType} from './XMLHttpRequest';
import convertRequestBody, {type RequestBody} from './convertRequestBody';
import type {EventSubscription} from 'react-native/Libraries/vendor/emitter/EventEmitter';

type RCTNetworkingEventDefinitions = $ReadOnly<{
  didSendNetworkData: [
    [
      number, // requestId
      number, // progress
      number, // total
    ],
  ],
  didReceiveNetworkResponse: [
    [
      number, // requestId
      number, // status
      ?{[string]: string}, // responseHeaders
      ?string, // responseURL
    ],
  ],
  didReceiveNetworkData: [
    [
      number, // requestId
      string, // response
    ],
  ],
  didReceiveNetworkIncrementalData: [
    [
      number, // requestId
      string, // responseText
      number, // progress
      number, // total
    ],
  ],
  didReceiveNetworkDataProgress: [
    [
      number, // requestId
      number, // loaded
      number, // total
    ],
  ],
  didCompleteNetworkResponse: [
    [
      number, // requestId
      string, // error
      boolean, // timeOutError
    ],
  ],
}>;

const BbdRCTNetworking = {
  addListener<K: $Keys<RCTNetworkingEventDefinitions>>(
    eventType: K,
    listener: (...$ElementType<RCTNetworkingEventDefinitions, K>) => mixed,
    context?: mixed,
  ): EventSubscription {
    return RCTDeviceEventEmitter.addListener(eventType, listener, context);
  },

  sendRequest(
    method: string,
    trackingName: string,
    url: string,
    headers: {...},
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
  },

  abortRequest(requestId: number) {
    NativeNetworkingIOS.abortRequest(requestId);
  },

  clearCookies(callback: (result: boolean) => void) {
    NativeNetworkingIOS.clearCookies(callback);
  },
};

module.exports = BbdRCTNetworking;
