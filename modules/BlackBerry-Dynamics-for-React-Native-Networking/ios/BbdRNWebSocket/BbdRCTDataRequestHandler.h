/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original WebSocket API of react-native
 * from https://github.com/facebook/react-native/blob/0.70-stable/Libraries/Network
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTInvalidating.h>
#import <React/RCTURLRequestHandler.h>

/**
 * This is the default RCTURLRequestHandler implementation for data URL requests.
 */
@interface BbdRCTDataRequestHandler : NSObject <RCTURLRequestHandler, RCTInvalidating>

@end
