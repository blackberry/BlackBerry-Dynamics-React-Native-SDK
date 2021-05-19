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

#import "ReactNativeBbdAppKinetics.h"
#import "React/RCTBridgeModule.h"
#import <React/RCTLog.h>
#import <BlackBerryDynamics/GD/GDFileManager.h>
#import <BlackBerryDynamics/GD/GDiOS.h>
#import <BlackBerryDynamics/GD/GDServices.h>
#import <BlackBerryDynamics/GD/GDServiceProvider.h>

#define kFileTransferServiceName            @"com.good.gdservice.transfer-file"
#define kFileTransferServiceVersion         @"1.0.0.0"
#define kFileTransferMethod                 @"transferFile"
#define kAppKineticsSendingApplicationName  @"applicationName"
#define kAppKineticsServiceNameKey          @"serviceName"
#define kAppKineticsVersionKey              @"version"
#define kAppKineticsMethodKey               @"method"
#define kAppKineticsParametersKey           @"parameters"
#define kAppKineticsAttachmentsKey          @"attachments"
#define kAssetsPath                         @"/data" // path to data folder: <app>/ios/<app_name>/data

// Container object to maintain received information from AppKinetics prior to loading.
@interface AppKineticsContainer : NSObject <GDServiceDelegate, GDServiceClientDelegate>

@property (nonatomic, strong) GDService *gdService;
@property (nonatomic, strong) GDServiceClient *gdServiceClient;

+ (void) initializeSingleton;

@end

@interface  ReactNativeBbdAppKinetics()

@property (nonatomic) NSMutableArray* securedDataDirEntries;
@property (nonatomic) NSMutableArray* copiedInThisCall;

@end

static AppKineticsContainer *s_appKineticsContainer = nil;
static RCTPromiseResolveBlock callAppKineticsServiceResolve = nil;
static RCTPromiseRejectBlock callAppKineticsServiceReject = nil;
static NSMutableArray *initialReceivedFiles = nil;

@implementation ReactNativeBbdAppKinetics
{
    bool hasListeners;
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (void) dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_EXPORT_MODULE();
- (instancetype)init
{
  if (self = [super init]) {
      self.securedDataDirEntries = [[NSMutableArray alloc]init];
      self.copiedInThisCall = [[NSMutableArray alloc]init];

      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(receiveEmitterNotification:)
                                                   name:@"EmitterReceiveFile"
                                                 object:nil];

      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(receiveEmitterNotification:)
                                                   name:@"EmitterReceiveMessage"
                                                 object:nil];

      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(receiveEmitterNotification:)
                                                   name:@"EmitterReceiveError"
                                                 object:nil];

  }
  return self;
}

- (void) receiveEmitterNotification:(NSNotification *) notification
{
    if ([[notification name] isEqualToString:@"EmitterReceiveFile"])
    {
        [self sendEventWithName:@"onReceivedFile" body:notification.object];
    }
    else if ([[notification name] isEqualToString:@"EmitterReceiveMessage"])
    {
       [self sendEventWithName:@"onReceivedMessage" body:notification.object];
    }
    else if ([[notification name] isEqualToString:@"EmitterReceiveError"])
    {
       [self sendEventWithName:@"onError" body:notification.object];
    }
}

#pragma mark Emiter
-(NSArray*)supportedEvents
{
    return @[@"onReceivedFile", @"onReceivedMessage", @"onError"];
}

// Will be called when this module's first listener is added.
-(void)startObserving
{
    hasListeners = YES;

    if (initialReceivedFiles) {
        for (NSString *file in initialReceivedFiles) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"EmitterReceiveFile" object:file];
        }
        initialReceivedFiles = nil;
    }
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving
{
    hasListeners = NO;
}

#pragma mark BringAppToFront
RCT_REMAP_METHOD(bringAppToFront,
                 appServicesBringApp:(NSDictionary*)parameters
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    // bring the application to the front
    if (parameters.count > 0)
    {
        NSString* applicationId = [parameters objectForKey:@"applicationId"];
        NSError *error = nil;
        BOOL methodResult;

        methodResult = [GDServiceClient bringToFront:applicationId completion:^(BOOL commandResult){
              if (commandResult)
              {
                  NSString* resolveString = [NSString stringWithFormat:@"%@ was successfully brought to front", applicationId];
                  resolve(resolveString);
              }
              else
              {
                  NSString* rejectString = [NSString stringWithFormat:@"Requested application not found"];
                  NSString *code = nil;
                  reject(code, rejectString, error);
              }
          }
        error:&error];

        if (!methodResult)
        {
            NSString* message = error == nil ? @"Application has been wiped" : error.debugDescription;
            reject(nil, message, error);
        }
    }
    else
    {
        NSString* errorString = @"Error - no application id provided for bringAppToFront";
        reject(nil, errorString, nil);
    }
}

#pragma mark CallAppkinetiksService
RCT_REMAP_METHOD(callAppKineticsService,
                 appServices:(NSDictionary *)appServices
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try
    {
        // cache resolve and reject
        callAppKineticsServiceResolve = resolve;
        callAppKineticsServiceReject = reject;

        [self callAppKineticsService:appServices];
    } @catch (NSException *exception) {
        reject(nil, exception.reason, nil);
    }
}

-(void)callAppKineticsService:(NSDictionary *)appServices
{
    if (appServices.count <= 0)
    {
        @throw ([NSException exceptionWithName:@"Appservice error" reason:@"No parameters exist" userInfo:nil]);
    }

    NSString *applicationId = [appServices objectForKey:@"applicationId"];
    NSString *serviceId = [appServices objectForKey:@"serviceId"];
    NSString *version = [appServices objectForKey:@"version"];
    NSString *method = [appServices objectForKey:@"method"];
    NSDictionary *parameters = [appServices objectForKey:@"parameters"];
    NSArray *attachments = [appServices objectForKey:@"attachments"];

    // for compatibility with native application
    parameters = (parameters.count > 0) ? parameters : nil;

    // if any file in the attachments does not exist, array will return nil, so error out
    if (attachments.count > 0 && ![self checkAllFileNames:attachments])
    {
        NSException *exception = [NSException exceptionWithName:@"Attachments error"
                                                         reason:[NSString stringWithFormat:@"File does not exist at path \"%@\"",[attachments objectAtIndex:0]]
                                                       userInfo:nil];
        @throw(exception);
    }

    NSArray* result = [self getGDAppDetails:appServices];
    if (result.count == 0) {
        NSException *exception = [NSException exceptionWithName:@"Service error"
                                                         reason:@"Requested application not found"
                                                       userInfo:nil];
        @throw(exception);
    }

    NSError *error = nil;
    NSString *requestID = nil;

    BOOL isRequestAccepted = [GDServiceClient sendTo:applicationId
                                         withService:serviceId
                                         withVersion:version
                                          withMethod:method
                                          withParams:parameters
                                     withAttachments:attachments
                                 bringServiceToFront:GDEPreferPeerInForeground
                                           requestID:&requestID
                                               error:&error];

    // check for error, if no error save callback id
    if (!isRequestAccepted)
    {
        NSException *exception = [NSException exceptionWithName:@"Application error" reason:@"Error - application did not accept" userInfo:nil];
        @throw(exception);
    }
}

- (NSArray<NSString *> *) convertAttachmentsToFullPath:(NSArray<NSString *> *) attachments
{
    NSMutableArray<NSString *>* atts = [NSMutableArray array];

    for (NSString* file in attachments) {
        [atts addObject:[self fullPathWithStoragePath:file]];
    }

    return [atts copy];
}

-(NSArray *)checkAllFileNames:(NSArray *)arrayOfFiles
{
    NSMutableArray *arrayOfFileNamesInDocumentsDir = [NSMutableArray array];

    for (NSString *fileName in arrayOfFiles)
    {
        if ([fileName isEqualToString:@""]) {
            return nil;
        }

        NSString *filePath = [fileName copy];

        BOOL fileExists = NO;
        if (![[GDFileManager defaultManager] fileExistsAtPath:filePath isDirectory:&fileExists])
        {
            filePath = [self fullPathWithStoragePath:filePath];
        }

        // if file still does not exist, then error
        if (![[GDFileManager defaultManager] fileExistsAtPath:filePath isDirectory:&fileExists])
        {
            arrayOfFileNamesInDocumentsDir = nil;
            return nil;
        }
        else
        {
            [arrayOfFileNamesInDocumentsDir addObject:filePath];
        }
    }

    // if no files, return nil
    if (arrayOfFileNamesInDocumentsDir.count > 0)
    {
        return arrayOfFileNamesInDocumentsDir;
    }
    else
    {
        return nil;
    }
}

#pragma mark GetServiceProviders
RCT_REMAP_METHOD(getServiceProvidersFor,
                 serviceID:(NSDictionary *)service
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    NSArray* result = [self getGDAppDetails:service];
    resolve([self processAppDetails:result]);
}

-(NSArray*)getGDAppDetails:(NSDictionary*)props
{
    NSString *serviceId = [props objectForKey:@"serviceId"];
    NSString *version = [props objectForKey:@"version"];

    NSArray<GDServiceProvider *> *serviceProviders = [[GDiOS sharedInstance] getServiceProvidersFor:serviceId
        andVersion:version
    andServiceType:GDServiceTypeApplication];

    return serviceProviders;
}

-(NSMutableArray*)processAppDetails:(NSArray *)serviceProviders
{
    NSMutableArray *arrayOfServiceProviders = [NSMutableArray array];

    for (GDServiceProvider *serviceProvider in serviceProviders)
    {
        NSMutableDictionary *provider = [NSMutableDictionary dictionary];

        [provider setObject:serviceProvider.identifier forKey:@"applicationId"];
        [provider setObject:serviceProvider.name forKey:@"name"];
        [provider setObject:serviceProvider.address forKey:@"address"];
        [provider setObject:serviceProvider.version forKey:@"versionId"];

        [arrayOfServiceProviders addObject:provider];
    }

    return arrayOfServiceProviders;
}

#pragma mark CopyFileToSecureContainer
RCT_REMAP_METHOD(copyFilesToSecureFilesystem,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{

    [self copyAllBundledFilesToSecureStorageRecursive:kAssetsPath];

    NSDictionary* result = @{
        @"copiedInThisCall": self.copiedInThisCall,
        @"securedDataDirEntries": [self getEntriesInSecureStorageForPath:kAssetsPath]
    };

    // reset copiedInThisCall
    self.copiedInThisCall = [NSMutableArray array];

    resolve(result);
}

- (NSString *) bundlePath:(NSString *)path
{
    return [[[NSBundle mainBundle] bundlePath] stringByAppendingPathComponent:path];
}

- (NSString *) storagePath:(NSString *)path
{
    NSString* documents = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    return [documents stringByAppendingPathComponent:path];
}

- (BOOL) createFolderAtPath:(NSString *)path error:(NSError *)error
{
    BOOL isDirectory = NO;
    GDFileManager* fs = [GDFileManager defaultManager];

    if (![fs fileExistsAtPath:path isDirectory:&isDirectory])
    {
        return [fs createDirectoryAtPath:path
             withIntermediateDirectories:YES
                              attributes:nil
                                   error:&error];
    }

    return NO;
}

- (BOOL) copyFileFrom:(NSString *)from to:(NSString *)to
{
    GDFileManager* fs = [GDFileManager defaultManager];
    NSData *fileData = [NSData dataWithContentsOfFile:from];

    return [fs createFileAtPath:to contents:fileData attributes:nil];
}

- (NSArray<NSString *> *) getEntriesInSecureStorageForPath:(NSString *)path
{
    GDFileManager* fs = [GDFileManager defaultManager];
    NSMutableArray* entries = [NSMutableArray array];
    NSString* secureStoragePath = [self storagePath:path];
    NSError* errorFile = nil;
    NSArray* arrayOfFiles = [fs contentsOfDirectoryAtPath:secureStoragePath error:&errorFile];

    for (NSString *filePath in arrayOfFiles)
    {
        @autoreleasepool {
            NSError* dirContentsError;
            NSString* relativePath = [path stringByAppendingPathComponent:filePath];
            NSString* fullPath = [self storagePath:relativePath];

            NSArray* directoryContents = [fs contentsOfDirectoryAtPath:fullPath error:&dirContentsError];

            if(directoryContents)
            {
                [entries addObjectsFromArray:[self getEntriesInSecureStorageForPath:relativePath]];
            }
            else
            {
                [entries addObject:relativePath];
            }
        }
    }

    return entries;
}

-(void) copyAllBundledFilesToSecureStorageRecursive:(NSString *)path
{
    NSError* errorFile = nil;
    NSString* fullBundelPath = [self bundlePath:path];

    NSMutableArray* arrayOfFiles = (NSMutableArray*)[[NSFileManager defaultManager] contentsOfDirectoryAtPath:fullBundelPath error:&errorFile];

    [self createFolderAtPath:[self storagePath:path] error:nil];

    for (NSString *filePath in arrayOfFiles)
    {
        @autoreleasepool {
            NSError* dirContentsError;
            NSString* relativePath = [path stringByAppendingPathComponent:filePath];
            NSString* fullPath = [self bundlePath:relativePath];

            NSArray* directoryContents = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:fullPath
                                                                                    error:&dirContentsError];

            if(directoryContents)
            {
                [self copyAllBundledFilesToSecureStorageRecursive:relativePath];
            }
            else
            {
                if([self copyFileFrom:fullPath to:[self storagePath:relativePath]])
                {
                    [self.copiedInThisCall addObject:relativePath];
                }
            }
        }
    }
}

- (NSString*)secureStoragePath
{
    return [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
}

- (NSString*)fullPathWithStoragePath:(NSString*)path
{
    return [[self secureStoragePath] stringByAppendingPathComponent:path];
}

#pragma mark ReadyToProvideService
RCT_REMAP_METHOD(readyToProvideService,
                 applicationParams:(NSDictionary*)appServices
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *serviceId = [appServices objectForKey:@"serviceId"];
    NSString *version = [appServices objectForKey:@"version"];

    [AppKineticsContainer initializeSingleton];
    resolve([NSString stringWithFormat:@"Providing service \"%@\" with version \"%@\"", serviceId, version]);
}

@end

#pragma mark Implementation AppKineticsContainer
@implementation AppKineticsContainer

+(void)load
{
    if (!initialReceivedFiles)
    {
        initialReceivedFiles = [[NSMutableArray alloc] init];
    }
    if (!s_appKineticsContainer)
    {
        s_appKineticsContainer = [[AppKineticsContainer alloc] init];

        [[NSNotificationCenter defaultCenter] addObserver:s_appKineticsContainer selector:@selector(onLaunch) name:UIApplicationDidFinishLaunchingNotification object:nil];
    }
}

-(void)onLaunch
{
    [AppKineticsContainer initializeSingleton];
}

+(void)initializeSingleton
{
    if (s_appKineticsContainer && !s_appKineticsContainer.gdService)
    {
        // Create GD service
        s_appKineticsContainer.gdService = [[GDService alloc] init];
        s_appKineticsContainer.gdService.delegate = s_appKineticsContainer;

        // Create GD ServiceClient
        s_appKineticsContainer.gdServiceClient = [[GDServiceClient alloc] init];
        s_appKineticsContainer.gdServiceClient.delegate = s_appKineticsContainer;
    }
}


-(void)GDServiceClientDidReceiveFrom:(NSString*)application
                          withParams:(id)params
                     withAttachments:(NSArray*)attachments
            correspondingToRequestID:(NSString*)requestID
{
    if ([params isKindOfClass:[NSError class]]) {
        NSError *error = (NSError *)params;

        if (callAppKineticsServiceReject) {
            callAppKineticsServiceReject([error domain], [error localizedDescription], error);
            return;
        }

        // DEVNOTE: shouldn't call it but for safety
        [[NSNotificationCenter defaultCenter] postNotificationName:@"EmitterReceiveError" object:[error localizedDescription]];
        return;
    }
}

-(void)GDServiceDidReceiveFrom:(NSString*)application
                    forService:(NSString*)service
                   withVersion:(NSString*)version
                     forMethod:(NSString*)method
                    withParams:(id)params
               withAttachments:(NSArray*)attachments
                  forRequestID:(NSString*)requestID
{
    // Test for file transfer - and not having a generic callback for any service
    if ([service isEqualToString:kFileTransferServiceName] &&
        [version isEqualToString:kFileTransferServiceVersion] &&
        [method isEqualToString:kFileTransferMethod])
    {
        if (initialReceivedFiles) {
            // no module's listener yet, so spool this
            [initialReceivedFiles addObject:[attachments objectAtIndex:0]];
        } else {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"EmitterReceiveFile" object:[attachments objectAtIndex:0]];
        }
    }
    else
    {
        NSMutableDictionary *dictionaryOfParms = [NSMutableDictionary dictionary];

        [dictionaryOfParms setObject:application forKey:kAppKineticsSendingApplicationName];
        [dictionaryOfParms setObject:service forKey:kAppKineticsServiceNameKey];
        [dictionaryOfParms setObject:version forKey:kAppKineticsVersionKey];
        [dictionaryOfParms setObject:method forKey:kAppKineticsMethodKey];

        if (attachments)
        {
            [dictionaryOfParms setObject:attachments forKey:kAppKineticsAttachmentsKey];
        }

        if (params)
        {
            [dictionaryOfParms setObject:params forKey:kAppKineticsParametersKey];
        }

        [[NSNotificationCenter defaultCenter] postNotificationName:@"EmitterReceiveMessage" object:dictionaryOfParms];
    }

    // Lastly, we reply to the sender with the replyParams and a nil attachment
    NSError *replyErr = nil;
    NSError *replyParams = nil;
    BOOL reply = [GDService replyTo:application
                         withParams:replyParams
                 bringClientToFront:GDENoForegroundPreference
                    withAttachments:nil
                          requestID:requestID
                              error:&replyErr];

    // If the reply failed, we simply log it
    if (!reply) {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"EmitterReceiveError" object:[replyErr localizedDescription]];
    }

}

-(void)GDServiceClientDidFinishSendingTo:(NSString *)application
                         withAttachments:(NSArray<NSString *> *)attachments
                              withParams:(id)params
                correspondingToRequestID:(NSString *)requestID
{

    if (callAppKineticsServiceResolve) {
        callAppKineticsServiceResolve(@"Send completed");
    }
}

@end
