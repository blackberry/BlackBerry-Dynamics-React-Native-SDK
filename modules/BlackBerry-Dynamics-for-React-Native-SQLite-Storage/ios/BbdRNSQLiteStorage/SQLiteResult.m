/*
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original react-native-sqlite-storage module for react-native
 * from https://github.com/andpor/react-native-sqlite-storage/
 *
 * SQLiteResult.m
 *
 * Created by Andrzej Porebski on 10/29/15.
 * Copyright (c) 2015 Andrzej Porebski.
 *
 * This software is largely based on the SQLLite Storage Cordova Plugin created by Chris Brody & Davide Bertola.
 * The implementation was adopted and converted to use React Native bindings.
 *
 * See https://github.com/litehelpers/Cordova-sqlite-storage
 *
 * This library is available under the terms of the MIT License (2008).
 * See http://opensource.org/licenses/alphabetical for full text.
 */

#import <Foundation/Foundation.h>
#import "SQLiteResult.h"

@interface SQLiteResultBbd ()

- (SQLiteResultBbd *)initWithStatus:(SQLiteStatus)statusOrdinal message:(id)theMessage;

@end

@implementation SQLiteResultBbd
@synthesize status, message;

- (SQLiteResultBbd*)init
{
  return [self initWithStatus:SQLiteStatus_NO_RESULT message:nil];
}

- (SQLiteResultBbd*)initWithStatus:(SQLiteStatus)statusOrdinal message:(id)theMessage
{
  self = [super init];
  if (self) {
    status = [NSNumber numberWithInt:statusOrdinal];
    message = theMessage;
  }
  return self;
}

+ (SQLiteResultBbd*)resultWithStatus:(SQLiteStatus)statusOrdinal messageAsString:(NSString*)theMessage
{
  return [[self alloc] initWithStatus:statusOrdinal message:theMessage];
}

+ (SQLiteResultBbd*)resultWithStatus:(SQLiteStatus)statusOrdinal messageAsArray:(NSArray*)theMessage
{
  return [[self alloc] initWithStatus:statusOrdinal message:theMessage];
}

+ (SQLiteResultBbd*)resultWithStatus:(SQLiteStatus)statusOrdinal messageAsDictionary:(NSDictionary*)theMessage
{
  return [[self alloc] initWithStatus:statusOrdinal message:theMessage];
}



@end
