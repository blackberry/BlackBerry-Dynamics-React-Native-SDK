/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import <Foundation/Foundation.h>

@interface BBDRNLog : NSObject

/**
 * Logs a message with the GDC_LOG_DETAIL log level only available
 * when enabled via setting in Debug Menu
 */
+(void)debug:(NSString * )format, ...;

/**
 * Logs a message with GDC_LOG_DETAIL log level
 */
+(void)detail:(NSString * )format, ...;

/**
 * Logs a message with the GDC_LOG_INFO log level
 */
+(void)info:(NSString * )format, ...;

/**
 * Logs a message with the GDC_LOG_WARNING log level
 */
+(void)warn:(NSString * )format, ...;

/**
 * Logs a message with the GDC_LOG_ERROR log level
 */
+(void)error:(NSString * )format, ...;

@end


