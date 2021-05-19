/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original WebSocket API of react-native
 * from https://github.com/facebook/react-native/tree/0.63-stable/Libraries/WebSocket
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTEventEmitter.h>
#import <BlackBerryDynamics/GD/GDNETiOS.h>
#import "JFRWebSocket.h"

NS_ASSUME_NONNULL_BEGIN

@protocol BbdRNWebSocketContentHandler <NSObject>

- (id)processWebsocketMessage:(id __nullable)message
                  forSocketID:(NSNumber *)socketID
                     withType:(NSString *__nonnull __autoreleasing *__nonnull)type;

@end

@interface BbdRNWebSocketModule : RCTEventEmitter

@property(nonatomic, strong)JFRWebSocket *socket;

// Register a custom handler for a specific websocket. The handler will be strongly held by the WebSocketModule.
- (void)setContentHandler:(id<BbdRNWebSocketContentHandler> __nullable)handler forSocketID:(NSNumber *)socketID;

- (void)sendData:(NSData *)data forSocketID:(nonnull NSNumber *)socketID;

@end

@interface RCTBridge (BbdRNWebSocketModule)

- (BbdRNWebSocketModule *)bbdWebSocketModule;

@end

NS_ASSUME_NONNULL_END
