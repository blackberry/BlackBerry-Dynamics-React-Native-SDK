#
# Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

Pod::Spec.new do |spec|
  spec.name                = 'BlackBerryDynamics'
  spec.version             = '1.0.0'
  spec.homepage            = 'https://developers.blackberry.com'
  spec.license             = { :type => 'Commercial', :file => 'license.txt' }
  spec.author              = 'BlackBerry'
  spec.summary             = 'BlackBerry Dynamics secure application container management'
  spec.description         = <<-DESC
                          Framework for building secure enterprise applications managed by BlackBerry Unified Endpoint Management (UEM).
                          DESC
  spec.platform            = :ios, '13.0'
  spec.source              = { :git => "", :tag => "#{spec.version}" }
  spec.requires_arc        = true
  spec.swift_version       = '5.0'

  spec.subspec 'BlackBerryDynamics' do |core|
    core.preserve_paths      = 'Frameworks/BlackBerryDynamics.xcframework', 'Frameworks/BlackBerryCerticom.xcframework', 'Frameworks/BlackBerryCerticomSBGSE.xcframework', 'license.txt'
    core.vendored_frameworks = 'Frameworks/BlackBerryDynamics.xcframework', 'Frameworks/BlackBerryCerticom.xcframework', 'Frameworks/BlackBerryCerticomSBGSE.xcframework'
  end
end
