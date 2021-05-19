/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

#import "BbdRNLauncher.h"

@implementation BbdRNLauncher

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()
- (instancetype)init
{
    UIViewController *viewController = [UIApplication sharedApplication].delegate.window.rootViewController;

    GTLauncherViewController *launchPadVC = [[GTLauncherViewController alloc] initWithBaseViewController:viewController];

    id<UIApplicationDelegate> applicationDelegate = [UIApplication sharedApplication].delegate;

    [applicationDelegate.window setRootViewController:launchPadVC];

    [launchPadVC setDelegate:self];

    [launchPadVC startServicesWithOptions:GTLInternalGDAuthTokenAndPushConnectionManagement];

    return self;
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

-(GTLauncherViewController *)getLauncherViewController
{
    id<UIApplicationDelegate> applicationDelegate = [UIApplication sharedApplication].delegate;

    return (GTLauncherViewController *)[applicationDelegate.window rootViewController];
}

#pragma mark show
RCT_EXPORT_METHOD(show:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        [[self getLauncherViewController] setLauncherButtonHidden:NO];
        resolve(nil);
    } @catch (NSException *exception) {
        reject(nil, exception.reason, nil);
    }
}

#pragma mark hide
RCT_EXPORT_METHOD(hide:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        [[self getLauncherViewController] setLauncherButtonHidden:YES];
        resolve(nil);
    } @catch (NSException *exception) {
        reject(nil, exception.reason, nil);
    }
}

@end
