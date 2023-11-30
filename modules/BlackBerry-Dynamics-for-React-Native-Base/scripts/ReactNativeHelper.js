/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
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

const shell = require('shelljs'),
  fs = require('fs'),
  path = require('path'),
  isWindows = process.platform === 'win32',
  constants = require('./constants'),
  { pipe, replace, addContentTo } = require('./utils');

const MIN_RN_VERSION_SUPPORTED = 70;
const DIGITAL_RADIX = 10;

class ReactNativeHelper {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.packageJson = require(path.join(this.projectRoot, 'package.json'));
  }

  setBbdConfigurationsForAndroid() {
    console.log('Setting BBD configurations for Android...');
    shell.exec(`node "${path.join('.', 'scripts', 'bbd_rn_install_android.js')}"`);
  }

  setBbdConfigurationsForiOS(bundleId) {
    if (isWindows) { return; }

    console.log('Setting BBD configurations for iOS...');

    let cmdiOSCommand = path.join('.', 'scripts', 'bbd_rn_install_ios.rb');

    if (bundleId) {
      cmdiOSCommand += ` --bundle_id ${bundleId}`;
    }

    shell.exec(cmdiOSCommand);

    // insert node script to update "post_install" hook in Podfile which is executed after 'pod install'
    // to remove duplicating '-l"ssl"' and '-l"crypto"' flags in OTHER_LDFLAGS field in xcconfig files
    // for 'debug' and 'release' schemes
    this.addUpdatePodsToPodfile();
  }

  getRnVersion() {
    return parseInt(this.packageJson.dependencies['react-native'].split('.')[1], DIGITAL_RADIX);
  }

  addUpdatePodsToPodfile() {
    if (this.getRnVersion() < MIN_RN_VERSION_SUPPORTED) {
      return;
    }

    const podfilePath = path.join(this.projectRoot, 'ios', 'Podfile');
    const podfileContent = fs.readFileSync(podfilePath, 'utf-8');

    const isBaseAdded = 
      !podfileContent.includes(constants.postInstall) ||
      podfileContent.includes(constants.updatePodsCommand);

    if (isBaseAdded) {
      return;
    }

    const newPodFileContent = pipe(
      replace(constants.podPlatformPatternVersion, constants.podPlatformVersion),
      replace(
        constants.podPlatformPatternVersionSupported,
        constants.podPlatformVersion
      ),
      replace(constants.enabledFlipper, constants.disabledFlipper),
      replace(constants.enabledFlipperNewSyntax, constants.disabledFlipperNewSyntax),
      replace(constants.enabledFlipperNewSyntaxRn71x, constants.disabledFlipperNewSyntaxRn71x),
      addContentTo({
        afterWhere: constants.postInstall,
        content: constants.updatePodsCommand,
      }),
      addContentTo({
        content: constants.bbdPodCommand,
      })
    )(podfileContent);

    fs.writeFileSync(podfilePath, newPodFileContent, 'utf-8');
  }
}

module.exports = ReactNativeHelper;
