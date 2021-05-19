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

#import "UIApplication+BBDRN.h"

#import "BBDRNLog.h"
#import <BlackBerryDynamics/GD/GDState.h>
#import <BlackBerryDynamics/GD/GDiOS.h>
#import "BBDRNRuntime.h"

#import <objc/runtime.h>

#pragma mark BBDStateChangesHandler

@interface BBDStateChangesHandler : NSObject

@property (nonatomic, strong) UIApplication *application;
@property (nonatomic, strong) id<UIApplicationDelegate> delegate;
@property (nonatomic, strong) NSDictionary *options;

-(instancetype)initWithApplication:(UIApplication *)application andLaunchOptions:(NSDictionary *)options;

@end

@implementation BBDStateChangesHandler

-(instancetype)initWithApplication:(UIApplication *)application andLaunchOptions:(NSDictionary *)options
{
    self = [super init];
    if (self)
    {
        self.application = application;
        self.delegate = application.delegate;
        self.options = options;
    }

    return self;
}

-(void)performStateChangeNotification:(NSNotification *)notification
{
    if ([[notification name] isEqualToString:GDStateChangeNotification])
    {
        NSDictionary *userInfo = [notification userInfo];
        NSString *propertyName = [userInfo objectForKey:GDStateChangeKeyProperty];
        GDState *state = [userInfo objectForKey:GDStateChangeKeyCopy];

        if ([propertyName isEqualToString:GDKeyIsAuthorized])
        {
            [BBDRNLog info:@"receiveStateChangeNotification - isAuthorized: %@", state.isAuthorized ? @"true" : @"false"];
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wundeclared-selector"
            SEL didFinishLaunchingSelector = @selector(bbd_rn_stashApplication:didFinishLaunchingWithOptions:);
#pragma clang diagnostic pop
            if ([self.delegate respondsToSelector:didFinishLaunchingSelector])
            {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                [self.delegate performSelector:didFinishLaunchingSelector
                                    withObject:self.application
                                    withObject:self.options];
#pragma clang diagnostic pop
                [[NSNotificationCenter defaultCenter] removeObserver:self];
                objc_removeAssociatedObjects(self);
            }
        }
        else if ([propertyName isEqualToString:GDKeyReasonNotAuthorized])
        {
            [BBDRNLog info:@"receiveStateChangeNotification - reasonNotAuthorized: %ld", (long) state.reasonNotAuthorized];

        }
        else if ([propertyName isEqualToString:GDKeyUserInterfaceState])
        {
            [BBDRNLog info:@"receiveStateChangeNotification - userInterfaceState: %ld", (long) state.userInterfaceState];

        }
        else if ([propertyName isEqualToString:GDKeyCurrentScreen])
        {
            [BBDRNLog info:@"receiveStateChangeNotification - currentScreen: %ld", (long) state.currentScreen];
        }
    }
}

@end
#pragma mark -

#pragma mark UIApplication+BBDRN
@implementation UIApplication (BBDReactNative)

+(void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [BBDRNRuntime swizzleInstanceMethodForClass:self
                                 withTargetSelector:@selector(setDelegate:)
                             andReplacementSelector:@selector(setDelegateRNReplacement:)
                                   andStashSelector:@selector(setDelegateRNStash:)];
    });
}

-(void)setDelegateRNReplacement:(id<UIApplicationDelegate>)delegate
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{

        Method originMethod = class_getInstanceMethod([delegate class], @selector(application:didFinishLaunchingWithOptions:));
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wundeclared-selector"
        class_addMethod([delegate class],
                        @selector(bbd_rn_application:didFinishLaunchingWithOptions:),
                        (IMP)bbd_applicationDidFinishlaunchingWithOptions, method_getTypeEncoding(originMethod));

        class_addMethod([delegate class],
                        @selector(bbd_rn_stashApplication:didFinishLaunchingWithOptions:),
                        (IMP)bbd_stashApplicationDidFinishlaunchingWithOptions, method_getTypeEncoding(originMethod));

        [BBDRNRuntime swizzleInstanceMethodForClass:[delegate class]
                                 withTargetSelector:@selector(application:didFinishLaunchingWithOptions:)
                             andReplacementSelector:@selector(bbd_rn_application:didFinishLaunchingWithOptions:)
                                   andStashSelector:@selector(bbd_rn_stashApplication:didFinishLaunchingWithOptions:)];
#pragma clang diagnostic pop

    });
    [self setDelegateRNStash:delegate];
}

-(void)setDelegateRNStash:(id<UIApplicationDelegate>)delegate
{
    return;
}

bool bbd_stashApplicationDidFinishlaunchingWithOptions(id self, SEL cmd, UIApplication *application, NSDictionary *options)
{
    return YES;
}

bool bbd_applicationDidFinishlaunchingWithOptions(id self, SEL cmd, UIApplication *application, NSDictionary *options)
{
    BBDStateChangesHandler *notificationHandler = [[BBDStateChangesHandler alloc] initWithApplication:application
                                                                                     andLaunchOptions:options];

    [[NSNotificationCenter defaultCenter] addObserver:notificationHandler
                                             selector:@selector(performStateChangeNotification:)
                                                 name:GDStateChangeNotification
                                               object:nil];
    // keep strong reference on notificationHandler in application object
    objc_setAssociatedObject(application, "_bbd_rn_notification_receiver", notificationHandler, OBJC_ASSOCIATION_RETAIN);

    [[GDiOS sharedInstance] authorize];

    return YES;
}

@end



