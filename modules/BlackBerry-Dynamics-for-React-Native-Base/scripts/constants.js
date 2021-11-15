/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

const updatePodsCommand = '\t\tsystem("node ../node_modules/BlackBerry-Dynamics-for-React-Native-Base' +
  '/scripts/updatePods.js")\n';

const podPlatformPatternVersion = /platform :ios, '([0-9\.]+)'/;
const podPlatformV13 = 'platform :ios, \'13.0\'';

const bbdPodCommand = 'pod \'BlackBerryDynamics\', ' +
  ':podspec => \'https://software.download.blackberry.com/repository/framework/dynamics/ios/BlackBerryDynamics.podspec\'\n';

const enabledFlipper = '  use_flipper!()';

const disabledFlipper = '  #\n' +
  '  # Flipper cannot be used together with BlackBerry Dynamics SDK for React Native on iOS\n' +
  '  # in debug configuration as it disables some BlackBerry Dynamics functionality\n' +
  '  # related to secure networking.\n' +
  '  # use_flipper!()';

module.exports = {
  updatePodsCommand,
  bbdPodCommand,
  podPlatformPatternVersion,
  podPlatformV13,
  enabledFlipper,
  disabledFlipper
};
