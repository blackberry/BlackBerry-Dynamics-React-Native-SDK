/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original WebSocket API of react-native
 * from https://github.com/facebook/react-native/blob/0.61-stable/Libraries/Network
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <SystemConfiguration/SystemConfiguration.h>

#import <React/RCTEventEmitter.h>

@interface BbdRCTNetInfo : RCTEventEmitter

- (instancetype)initWithHost:(NSString *)host;

@end
