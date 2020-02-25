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

#import "BBDRNLog.h"
#include "GDCLog.h"

@implementation BBDRNLog

+ (void)debug:(NSString *)format, ...
{
    va_list args;
    va_start(args, format);
    NSString *formatedMessage = [[NSString alloc] initWithFormat:format arguments:args];
    va_end(args);

    GDCLog(GDC_LOG_INFO, "%s\n", [formatedMessage cStringUsingEncoding:NSUTF8StringEncoding]);
}

/**< The log message is only logged when detailed logging is enabled from Good Control.
 */
+ (void)detail:(NSString *)format, ...
{
    va_list args;
    va_start(args, format);
    NSString *formatedMessage = [[NSString alloc] initWithFormat:format arguments:args];
    va_end(args);

    GDCLog(GDC_LOG_INFO, "%s\n", [formatedMessage cStringUsingEncoding:NSUTF8StringEncoding]);
}

+ (void)info:(NSString *)format, ...
{
    va_list args;
    va_start(args, format);
    NSString *formatedMessage = [[NSString alloc] initWithFormat:format arguments:args];
    va_end(args);

    GDCLog(GDC_LOG_INFO, "%s\n", [formatedMessage cStringUsingEncoding:NSUTF8StringEncoding]);
}

+ (void)warn:(NSString *)format, ...
{

    va_list args;
    va_start(args, format);
    NSString *formatedMessage = [[NSString alloc] initWithFormat:format arguments:args];
    va_end(args);

    GDCLog(GDC_LOG_WARNING, "%s\n", [formatedMessage cStringUsingEncoding:NSUTF8StringEncoding]);
}

+ (void)error:(NSString *)format, ...
{

    va_list args;
    va_start(args, format);
    NSString *formatedMessage = [[NSString alloc] initWithFormat:format arguments:args];
    va_end(args);

    GDCLog(GDC_LOG_ERROR, "%s\n", [formatedMessage cStringUsingEncoding:NSUTF8StringEncoding]);
}

@end
