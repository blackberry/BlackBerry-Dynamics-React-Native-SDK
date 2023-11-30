/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original WebSocket API of react-native
 * from https://github.com/facebook/react-native/tree/0.70-stable/Libraries/Blob
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import "BbdRCTFileReaderModule.h"

#import <FBReactNativeSpec/FBReactNativeSpec.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>

#import "BbdRCTBlobManager.h"

#import "BbdRCTBlobPlugins.h"

@interface BbdRCTFileReaderModule() <NativeFileReaderModuleSpec>
@end

@implementation BbdRCTFileReaderModule

RCT_EXPORT_MODULE(RNReactNativeBbdFileReader)

@synthesize moduleRegistry = _moduleRegistry;

RCT_EXPORT_METHOD(readAsText:(NSDictionary<NSString *, id> *)blob
                  encoding:(NSString *)encoding
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  BbdRCTBlobManager *blobManager = [_moduleRegistry moduleForName:"RNReactNativeBbdBlob"];
  dispatch_async(blobManager.methodQueue, ^{
  NSData *data = [blobManager resolve:blob];

  if (data == nil) {
    reject(RCTErrorUnspecified,
           [NSString stringWithFormat:@"Unable to resolve data for blob: %@", [RCTConvert NSString:blob[@"blobId"]]], nil);
  } else {
    NSStringEncoding stringEncoding;

    if (encoding == nil) {
      stringEncoding = NSUTF8StringEncoding;
    } else {
      stringEncoding = CFStringConvertEncodingToNSStringEncoding(CFStringConvertIANACharSetNameToEncoding((CFStringRef) encoding));
    }

    NSString *text = [[NSString alloc] initWithData:data encoding:stringEncoding];

    resolve(text);
  }
  });
}

RCT_EXPORT_METHOD(readAsDataURL:(NSDictionary<NSString *, id> *)blob
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  BbdRCTBlobManager *blobManager = [_moduleRegistry moduleForName:"RNReactNativeBbdBlob"];
  dispatch_async(blobManager.methodQueue, ^{
  NSData *data = [blobManager resolve:blob];

  if (data == nil) {
    reject(RCTErrorUnspecified,
           [NSString stringWithFormat:@"Unable to resolve data for blob: %@", [RCTConvert NSString:blob[@"blobId"]]], nil);
  } else {
    NSString *type = [RCTConvert NSString:blob[@"type"]];
    NSString *text = [NSString stringWithFormat:@"data:%@;base64,%@",
                      type != nil && [type length] > 0 ? type : @"application/octet-stream",
                      [data base64EncodedStringWithOptions:0]];

    resolve(text);
  }
  });
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeFileReaderModuleSpecJSI>(params);
}

@end

Class BbdRCTFileReaderModuleCls(void)
{
  return BbdRCTFileReaderModule.class;
}
