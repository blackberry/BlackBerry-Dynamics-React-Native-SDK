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

#import "BBDRNRuntime.h"
#import <objc/runtime.h>

@implementation BBDRNRuntime

+(void)swizzleInstanceMethodForClass:(Class)originalClass // original
                 andReplacementClass:(Class)replacementClass // new
                  withTargetSelector:(SEL)originalSelector // original
              andReplacementSelector:(SEL)replacementSelector // new
                    andStashSelector:(SEL)stashSelector // store the original so we can access it
{
    Method originalMethod = class_getInstanceMethod(originalClass, originalSelector); // original
    Method replacementMethod = class_getInstanceMethod(replacementClass, replacementSelector); // new

    method_exchangeImplementations(originalMethod, replacementMethod);

    if (stashSelector) {
        Method stashMethod = class_getInstanceMethod(replacementClass, stashSelector);

        // Here we operate on the 'replacementMethod' as that is now the 'original' (due to the
        // method swap we did above).
        method_exchangeImplementations(replacementMethod, stashMethod);
    }
}

+(void)swizzleInstanceMethodForClass:(Class)classObj
                  withTargetSelector:(SEL)originalSelector
              andReplacementSelector:(SEL)replacementSelector
                    andStashSelector:(SEL)stashSelector
{
    [self swizzleInstanceMethodForClass:classObj
                    andReplacementClass:classObj
                     withTargetSelector:originalSelector
                 andReplacementSelector:replacementSelector
                       andStashSelector:stashSelector];
}

@end
