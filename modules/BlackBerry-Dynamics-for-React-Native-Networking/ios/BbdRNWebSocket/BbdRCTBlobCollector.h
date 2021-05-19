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

#import <jsi/jsi.h>

using namespace facebook;

@class BbdRCTBlobManager;

namespace facebook {
namespace react {

class JSI_EXPORT BbdRCTBlobCollector : public jsi::HostObject {
 public:
    BbdRCTBlobCollector(BbdRCTBlobManager *blobManager, const std::string &blobId);
  ~BbdRCTBlobCollector();

  static void install(BbdRCTBlobManager *blobManager);

 private:
  const std::string blobId_;
    BbdRCTBlobManager *blobManager_;
};

} // namespace react
} // namespace facebook
