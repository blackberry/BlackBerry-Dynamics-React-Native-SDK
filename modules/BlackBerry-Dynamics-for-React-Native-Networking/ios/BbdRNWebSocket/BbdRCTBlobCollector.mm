/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original WebSocket API of react-native
 * from https://github.com/facebook/react-native/tree/0.61-stable/Libraries/Blob
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "BbdRCTBlobCollector.h"

#import <React/RCTBridge+Private.h>
#import "BbdRCTBlobManager.h"

namespace facebook {
namespace react {

BbdRCTBlobCollector::BbdRCTBlobCollector(BbdRCTBlobManager *blobManager, const std::string &blobId)
: blobId_(blobId), blobManager_(blobManager) {}

BbdRCTBlobCollector::~BbdRCTBlobCollector() {
  BbdRCTBlobManager *blobManager = blobManager_;
  NSString *blobId = [NSString stringWithUTF8String:blobId_.c_str()];
  dispatch_async([blobManager_ methodQueue], ^{
    [blobManager remove:blobId];
  });
}

void BbdRCTBlobCollector::install(BbdRCTBlobManager *blobManager) {
  __weak RCTCxxBridge *cxxBridge = (RCTCxxBridge *)blobManager.bridge;
  [cxxBridge dispatchBlock:^{
    if (!cxxBridge || cxxBridge.runtime == nullptr) {
      return;
    }
    jsi::Runtime &runtime = *(jsi::Runtime *)cxxBridge.runtime;
    runtime.global().setProperty(
      runtime,
      "__blobCollectorProvider",
      jsi::Function::createFromHostFunction(
        runtime,
        jsi::PropNameID::forAscii(runtime, "__blobCollectorProvider"),
        1,
        [blobManager](jsi::Runtime& rt, const jsi::Value& thisVal, const jsi::Value* args, size_t count) {
          auto blobId = args[0].asString(rt).utf8(rt);
          auto blobCollector = std::make_shared<BbdRCTBlobCollector>(blobManager, blobId);
          return jsi::Object::createFromHostObject(rt, blobCollector);
        }
      )
    );
  } queue:RCTJSThread];
}

} // namespace react
} // namespace facebook
