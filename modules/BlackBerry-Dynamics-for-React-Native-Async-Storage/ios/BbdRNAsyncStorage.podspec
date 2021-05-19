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
  s.name         = "BbdRNAsyncStorage"
  s.version      = "1.0.0"
  s.summary      = "BbdRNAsyncStorage"
  s.homepage     = "https://developers.blackberry.com/"
  s.license      = { :type => "Apache License, Version 2.0" }
  s.authors      = {
    "Volodymyr Taliar" => "vtaliar@blackberry.com",
    "Taras Omelchuk" => "tomelchuk@blackberry.com",
    "Nobu Ishikawa" => "nishikawa@blackberry.com"
  }
  s.platform     = :ios, "9.0"
  s.source       = {
    :git => "https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK.git",
    :tag => "#{s.version}"
  }
  s.source_files = "BbdRNAsyncStorage/**/*.{h,m}"
  s.dependency "React"
  s.dependency "BlackBerryDynamics"
end
