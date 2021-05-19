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
#import <MobileCoreServices/MobileCoreServices.h>

typedef void (^UploadCompleteCallback)(NSString*, NSURLResponse *);
typedef void (^UploadErrorCallback)(NSError*);
typedef void (^UploadBeginCallback)(void);
typedef void (^UploadProgressCallback)(NSNumber*, NSNumber*);

@interface RNFSUploadParams : NSObject

@property (copy) NSString* toUrl;
@property (copy) NSArray* files;
@property (copy) NSDictionary* headers;
@property (copy) NSDictionary* fields;
@property (copy) NSString* method;
@property (assign) BOOL binaryStreamOnly;
@property (copy) UploadCompleteCallback completeCallback;    // Upload has finished (data written)
@property (copy) UploadErrorCallback errorCallback;         // Something gone wrong
@property (copy) UploadBeginCallback beginCallback;         // Upload has started
@property (copy) UploadProgressCallback progressCallback;   // Upload is progressing

@end

@interface RNFSUploader : NSObject <NSURLConnectionDelegate>

- (void)uploadFiles:(RNFSUploadParams*)params;
- (void)stopUpload;

@end
