/*
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original react-native-sqlite-storage module for react-native
 * from https://github.com/andpor/react-native-sqlite-storage/
 *
 * SQLiteResult.h
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

typedef enum {
  SQLiteStatus_NO_RESULT = 0,
  SQLiteStatus_OK,
  SQLiteStatus_ERROR
} SQLiteStatus;


@interface SQLiteResultBbd : NSObject {}

@property (nonatomic, strong, readonly) NSNumber* status;
@property (nonatomic, strong, readonly) id message;

+ (SQLiteResultBbd*)resultWithStatus:(SQLiteStatus)statusOrdinal messageAsString:(NSString*)theMessage;
+ (SQLiteResultBbd*)resultWithStatus:(SQLiteStatus)statusOrdinal messageAsArray:(NSArray*)theMessage;
+ (SQLiteResultBbd*)resultWithStatus:(SQLiteStatus)statusOrdinal messageAsDictionary:(NSDictionary*)theMessage;

@end
