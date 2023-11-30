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

Pod::Spec.new do |s|
  s.name         = "BbdRNWebSocket"
  s.version      = "1.0.0"
  s.summary      = "BlackBerry Dynamics WebSocket implementation for React Native for iOS"
  s.homepage     = "https://developers.blackberry.com"
  s.license      = "MIT"
  s.authors      = {
    "Volodymyr Taliar" => "vtaliar@blackberry.com"
  }
  s.platform     = :ios, "12.4"
  s.source       = {
    :git => "https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK.git",
    :tag => "#{s.version}" }
  s.source_files = "ios/BbdRNWebSocket/**/*.{h,m,mm,swift}"
  s.pod_target_xcconfig    = {
                               "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
                             }
  s.dependency "React"
  s.dependency "BlackBerryDynamics"
  s.swift_version = '5.0'
end
