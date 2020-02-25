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

#import "BbdRNBase.h"
#import "BBDRNLog.h"

@implementation BbdRNBase

RCT_EXPORT_MODULE(BbdLog);

RCT_EXPORT_METHOD(info:(NSString *)logStr)
{
    [BBDRNLog info:logStr];
}

RCT_EXPORT_METHOD(debug:(NSString *)logStr)
{
    [BBDRNLog debug:logStr];
}

RCT_EXPORT_METHOD(detail:(NSString *)logStr)
{
    [BBDRNLog detail:logStr];
}

RCT_EXPORT_METHOD(warn:(NSString *)logStr)
{
    [BBDRNLog warn:logStr];
}

RCT_EXPORT_METHOD(error:(NSString *)logStr)
{
    [BBDRNLog error:logStr];
}

@end
