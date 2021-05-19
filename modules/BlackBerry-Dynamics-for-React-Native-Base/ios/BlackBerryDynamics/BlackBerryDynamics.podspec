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

Pod::Spec.new do |spec|
  spec.name                = "BlackBerryDynamics"
  spec.version             = "1.0.0"
  spec.homepage            = "https://developers.blackberry.com"
  spec.author              = "BlackBerry"
  spec.summary             = "BlackBerry Dynamics secure application container management"
  spec.description         = <<-DESC
                          Framework for building secure enterprise applications managed by BlackBerry Unified Endpoint Management (UEM).
                          DESC
  spec.platform            = :ios, "9.0"
  spec.source              = { :git => "" }
  spec.requires_arc        = true
  spec.swift_version       = "5.0"

  spec.pod_target_xcconfig  = { "EXCLUDED_ARCHS[sdk=iphonesimulator*]" => "arm64" }
  spec.user_target_xcconfig = { "EXCLUDED_ARCHS[sdk=iphonesimulator*]" => "arm64" }

  spec.preserve_paths       = "BlackBerryDynamics/frameworks/.*"
  spec.vendored_frameworks  = "Frameworks/BlackBerryDynamics.xcframework", "Frameworks/BlackBerryCerticom.xcframework", "Frameworks/BlackBerryCerticomSBGSE.xcframework"
end
