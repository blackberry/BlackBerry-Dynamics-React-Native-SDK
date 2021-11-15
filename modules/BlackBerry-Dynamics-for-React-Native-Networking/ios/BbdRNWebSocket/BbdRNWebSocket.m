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

#import "BbdRNWebSocket.h"

#import <objc/runtime.h>

#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

NSString *const WebSocketOpen = @"bbdWebsocketOpen";
NSString *const WebSocketMessage = @"bbdWebsocketMessage";
NSString *const WebSocketClosed = @"bbdWebsocketClosed";
NSString *const WebSocketFailed = @"bbdWebsocketFailed";

@implementation BbdRNWebSocketModule
{
    NSMutableDictionary<NSNumber *, JFRWebSocket *> *_sockets;
    NSMutableDictionary<NSNumber *, id<BbdRNWebSocketContentHandler>> *_contentHandlers;
}

RCT_EXPORT_MODULE(BbdRNWebSocketModule)

// Used by BbdRCTBlobManager
@synthesize methodQueue = _methodQueue;

- (NSArray *)supportedEvents
{
  return @[WebSocketMessage,
           WebSocketOpen,
           WebSocketFailed,
           WebSocketClosed];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(connect:(NSURL *)URL protocols:(NSArray *)protocols options:(NSDictionary *)options socketID:(nonnull NSNumber *)socketID)
{
    self.socket = [[JFRWebSocket alloc] initWithURL:[NSURL URLWithString:URL.absoluteString] protocols:protocols];
    self.socket.socketID = socketID;
    self.socket.delegate = self;
    [self.socket connect];

    if (!_sockets) {
      _sockets = [NSMutableDictionary new];
    }
    _sockets[socketID] = self.socket;
}

RCT_EXPORT_METHOD(send:(NSString *)message forSocketID:(nonnull NSNumber *)socketID)
{
    JFRWebSocket* currentWebSocket = _sockets[socketID];
    [self.socket writeString:message gdSocketID:currentWebSocket.gdSocket];
}

RCT_EXPORT_METHOD(sendBinary:(NSString *)base64String forSocketID:(nonnull NSNumber *)socketID)
{
  [self sendData:[[NSData alloc] initWithBase64EncodedString:base64String options:0] forSocketID:socketID];
}

- (void)sendData:(NSData *)data forSocketID:(NSNumber *)socketID
{
    JFRWebSocket* currentWebSocket = _sockets[socketID];
    [self.socket writeData:data gdSocketID:currentWebSocket.gdSocket];
}

RCT_EXPORT_METHOD(ping:(nonnull NSNumber *)socketID)
{
    JFRWebSocket* currentWebSocket = _sockets[socketID];
    NSData *data = [[NSData alloc] init];
    [self.socket writePing:data gdSocketID:currentWebSocket.gdSocket];
}

RCT_EXPORT_METHOD(close:(NSInteger)code reason:(NSString *)reason socketID:(nonnull NSNumber *)socketID)
{
    [_sockets removeObjectForKey:socketID];
    JFRWebSocket* currentWebSocket = _sockets[socketID];
    [self.socket disconnect:currentWebSocket.gdSocket];
}

- (void)setContentHandler:(id<BbdRNWebSocketContentHandler>)handler forSocketID:(NSString *)socketID
{
  if (!_contentHandlers) {
    _contentHandlers = [NSMutableDictionary new];
  }
  _contentHandlers[socketID] = handler;
}

#pragma mark: WebSocket Delegate methods.

-(void)websocketDidConnect:(JFRWebSocket*)socket {
    NSLog(@"websocket is connected");
      [self sendEventWithName:WebSocketOpen body:@{
        @"id": socket.socketID,
        @"protocol": @""
      }];
}

-(void)websocketDidDisconnect:(JFRWebSocket*)socket error:(NSError*)error {
    NSLog(@"websocket is disconnected: %@", [error localizedDescription]);
    NSNumber *socketID = [socket socketID];
    _contentHandlers[socketID] = nil;
    _sockets[socketID] = nil;
    [self sendEventWithName:WebSocketClosed body:@{
        @"code": @(1000),
        @"reason": @"Socket was disconnected",
        @"clean": @"",
        @"id": socketID
    }];
}

-(void)websocket:(JFRWebSocket*)socket didReceiveError:(NSError*)error {
    NSLog(@"websocket error: %@", [error localizedDescription]);
    NSNumber *socketID = [socket socketID];

    [self sendEventWithName:WebSocketFailed body:@{
        @"message": [error localizedDescription],
        @"id": socketID
    }];
}

-(void)websocket:(JFRWebSocket*)socket didReceiveMessage:(NSString*)string {
    [self sendEventWithName:WebSocketMessage body:@{
        @"data": string,
        @"type": @"text",
        @"id": socket.socketID
    }];
}

-(void)websocket:(JFRWebSocket*)socket didReceiveData:(NSData*)data {
    NSString *type;
    id message;

    NSNumber *socketID = socket.socketID;
    id contentHandler = _contentHandlers[socketID];
    if (contentHandler) {
        message = [contentHandler processWebsocketMessage:data forSocketID:socketID withType:&type];
    } else {
        message = [data base64EncodedStringWithOptions:0];
        type = @"binary";
    }

    [self sendEventWithName:WebSocketMessage body:@{
        @"data": message,
        @"type": type,
        @"id": socket.socketID
    }];
}

@end

@implementation RCTBridge (BbdRNWebSocketModule)

- (BbdRNWebSocketModule *)bbdWebSocketModule
{
  return [self moduleForClass:[BbdRNWebSocketModule class]];
}

@end
