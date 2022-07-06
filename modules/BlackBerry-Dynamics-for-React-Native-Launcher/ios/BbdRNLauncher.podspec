#
# Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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
  s.name            = "BbdRNLauncher"
  s.version         = "1.0.0"
  s.homepage        = "https://developers.blackberry.com/"
  s.summary         = "BlackBerry Dynamics Launcher integration"
  s.license         = { :type => "Apache License, Version 2.0" }
  s.author          = {
    "Volodymyr Taliar" => "vtaliar@blackberry.com",
    "Bohdan Pidluzhnyy" => "bpidluzhnyy@blackberry.com"
  }
  s.platform        = :ios, "9.0"
  s.source          = {
    :git => "https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK.git",
    :tag => "#{s.version}"
  }
  s.source_files    = "BbdRNLauncher/**/*.{h,m}"
  s.preserve_paths  = "**/*.js"
  s.requires_arc    = true
  s.pod_target_xcconfig  = { "EXCLUDED_ARCHS[sdk=iphonesimulator*]" => "arm64" }
  s.user_target_xcconfig = { "EXCLUDED_ARCHS[sdk=iphonesimulator*]" => "arm64" }
  s.dependency "React"
end
