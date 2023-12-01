#
# Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

Pod::Spec.new do |spec|
  folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

  spec.name          = "BbdRNWebView"
  spec.version       = "1.0.0"
  spec.summary       = "BlackBerry Dynamics WebView UI component for React Native for iOS"
  spec.license       = { :type => "Apache License, Version 2.0" }
  spec.homepage      = "https://developers.blackberry.com/"
  spec.authors       = {
    "Volodymyr Taliar" => "vtaliar@blackberry.com"
  }
  spec.source        = {
    :git => "https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK.git",
    :tag => "#{spec.version}"
  }
  spec.source_files  = "ios/BbdRNWebView/*.{h,m,mm}"
  spec.platform      = :ios, "9.0"
  spec.dependency  "React"
  spec.dependency "BlackBerryDynamics"

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    spec.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    spec.pod_target_xcconfig    = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }

    spec.dependency "React-RCTFabric"
    spec.dependency "React-Codegen"
    spec.dependency "RCT-Folly"
    spec.dependency "RCTRequired"
    spec.dependency "RCTTypeSafety"
    spec.dependency "ReactCommon/turbomodule/core"
  end

end
