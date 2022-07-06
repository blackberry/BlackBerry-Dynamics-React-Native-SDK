/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
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

#import "BbdRNApplication.h"
#import <BlackBerryDynamics/GD/GDAppServer.h>
#import <BlackBerryDynamics/GD/GDServiceProvider.h>
#import <BlackBerryDynamics/GD/GDServices.h>
#import <BlackBerryDynamics/GD/GDiOS.h>

static NSString *kAppServerServerKey = @"server";
static NSString *kAppServerPortKey = @"port";
static NSString *kAppServerPriorityKey = @"priority";

@interface AppConfig : NSObject

@property (strong, nonatomic) NSDictionary *appConfig;

+(AppConfig *)sharedInstance;
-(void)setAppConfigFromRuntime;

@end

@implementation AppConfig

+(AppConfig *)sharedInstance
{
    static AppConfig *sharedInstance = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        sharedInstance = [[AppConfig alloc] init];
    });
    return sharedInstance;
}

-(void)setAppConfigFromRuntime
{
    GDiOS *gdRuntime = [GDiOS sharedInstance];
    self.appConfig = [gdRuntime getApplicationConfig];
}

@end

@interface AppPolicy : NSObject

@property (strong, nonatomic) NSDictionary *appPolicy;

+(AppPolicy *)sharedInstance;
-(void)setAppPolicyFromRuntime;

@end

@implementation AppPolicy

+(AppPolicy *)sharedInstance
{
    static AppPolicy *sharedInstance = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        sharedInstance = [[AppPolicy alloc] init];
    });
    return sharedInstance;
}

-(void)setAppPolicyFromRuntime
{
    GDiOS *gdRuntime = [GDiOS sharedInstance];
    //we can set application specific policy by uploading specific xml file on enterprise
    // management console for the application

    // this is application specific policy as NSDictionary that comes from UEM
    self.appPolicy = [gdRuntime getApplicationPolicy];
}

@end

@implementation BbdRNApplication
{
    bool hasListeners;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

- (instancetype)init
{
    if (self = [super init]) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(didRecieveStateChange:)
                                                     name:GDStateChangeNotification
                                                   object:nil];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(didRecieveAppPolicyUpdate:)
                                                     name:GDPolicyUpdateNotification
                                                   object:nil];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(didRecieveRemoteSettingsUpdate:)
                                                     name:GDRemoteSettingsUpdateNotification
                                                   object:nil];
    }
    return self;
}

#pragma mark Emitter
-(NSArray*)supportedEvents
{
    return @[@"onAppPolicyUpdate", @"onAppConfigUpdate", @"onError"];
}

// Will be called when this module's first listener is added.
-(void)startObserving
{
    hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving
{
    hasListeners = NO;
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

-(void)didRecieveAppPolicyUpdate:(NSNotification *)notification
{
    if ([notification.name isEqualToString:GDPolicyUpdateNotification])
    {
        AppPolicy *policyObj = [AppPolicy sharedInstance];
        [policyObj setAppPolicyFromRuntime];

        [self sendEventWithName:@"onAppPolicyUpdate" body:policyObj.appPolicy];
    }
}

-(void)didRecieveRemoteSettingsUpdate:(NSNotification *)notification
{
    if ([notification.name isEqualToString:GDRemoteSettingsUpdateNotification])
    {
        NSError* error = nil;
        NSDictionary* config = [self parseAppConfig:error];

        if(error)
        {
            [self sendEventWithName:@"onError" body:error.description];
        }

        [self sendEventWithName:@"onAppConfigUpdate" body:config];
    }
}

-(void)didRecieveStateChange:(NSNotification *)notification
{
    if ([[notification name] isEqualToString:GDStateChangeNotification])
    {
        NSDictionary *userInfo = [notification userInfo];
        NSString *propertyName = [userInfo objectForKey:GDStateChangeKeyProperty];
        if ([propertyName isEqualToString:GDKeyIsAuthorized])
        {
            [[NSNotificationCenter defaultCenter] postNotificationName:GDPolicyUpdateNotification
                                                                object:self];

            [[NSNotificationCenter defaultCenter] postNotificationName:GDRemoteSettingsUpdateNotification
                                                                object:self];
        }
    }
}

-(NSDictionary*)parseAppConfig:(NSError *)error
{
    /*
     * NOTE: Since the GDAppConfigKeyServers returns a list of GDAppServer objects, this list
     * will be formatted to conform to the following JSON fragment:
     *        [{server:<server-name>, port:<port-number>, priority:<priority-number>}, {...} ]
     */

    AppConfig *appConfig = [AppConfig sharedInstance];
    [appConfig setAppConfigFromRuntime];

    NSMutableDictionary* config = [appConfig.appConfig mutableCopy];

    NSArray *appServers = [config objectForKey:GDAppConfigKeyServers];

    if (appServers && ![appServers isKindOfClass:[NSNull class]] && appServers.count > 0)
    {
        NSArray *appServersToSet = [self getAppServersAsDictionariesArray:appServers];

        [config setObject:appServersToSet forKey:GDAppConfigKeyServers];
    }
    else
    {
        [config setObject:[NSArray array] forKey:GDAppConfigKeyServers];
    }

    NSString *enterpriseIdFeaturesString = [config objectForKey:GDAppConfigKeyEnterpriseIdFeatures];
    NSString *temp = [enterpriseIdFeaturesString substringFromIndex:2];
    temp = [temp substringToIndex:[temp length] - 2];
    temp = [temp stringByReplacingOccurrencesOfString:@"\"" withString:@""];
    NSArray *enterpriseIdFeaturesArr = [temp componentsSeparatedByString:@", "];
    if (enterpriseIdFeaturesArr && enterpriseIdFeaturesArr.count > 0)
    {
        [config setObject:enterpriseIdFeaturesArr forKey:GDAppConfigKeyEnterpriseIdFeatures];
    }
    else
    {
        [config setObject:[NSArray array] forKey:GDAppConfigKeyEnterpriseIdFeatures];
    }

    NSString *extraInfoString = [config objectForKey:GDAppConfigKeyExtraInfo];
    NSData *extraInfoJsonData = [extraInfoString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *extraInfoDict = [NSJSONSerialization JSONObjectWithData:extraInfoJsonData options:0 error:&error];
    if (extraInfoDict)
    {
        [config setObject:extraInfoDict forKey:GDAppConfigKeyExtraInfo];
    }
    else
    {
        [config setObject:[NSDictionary dictionary] forKey:GDAppConfigKeyExtraInfo];
    }

    return config;
}

-(NSArray *)getAppServersAsDictionariesArray:(NSArray *)appServers
{
    NSMutableArray *appServersAsDictionary = [NSMutableArray array];

    for (GDAppServer *appServer in appServers)
    {
        NSMutableDictionary *appServerAsDictionaty = [NSMutableDictionary dictionary];

        [appServerAsDictionaty setValue:appServer.server forKey:kAppServerServerKey];
        [appServerAsDictionaty setValue:appServer.port forKey:kAppServerPortKey];
        [appServerAsDictionaty setValue:appServer.priority forKey:kAppServerPriorityKey];

        [appServersAsDictionary addObject:appServerAsDictionaty];
    }

    return appServersAsDictionary;
}

#pragma mark GetApplicationConfig
RCT_EXPORT_METHOD(getApplicationConfig:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    NSError* error = nil;
    NSDictionary* config = [self parseAppConfig:error];

    if(!error)
    {
        resolve(config);
        return;
    }

    NSString* message = error == nil ? @"ERROR: issue occured with serializing data." : error.debugDescription;
    reject(nil, message, error);
}

#pragma mark GetApplicationPolicy
RCT_EXPORT_METHOD(getApplicationPolicy:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    AppPolicy *policyObj = [AppPolicy sharedInstance];
    [policyObj setAppPolicyFromRuntime];

    resolve(policyObj.appPolicy);
}

@end
