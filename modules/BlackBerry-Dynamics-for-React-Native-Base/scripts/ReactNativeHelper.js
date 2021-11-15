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

const shell = require('shelljs'),
  fs = require('fs'),
  path = require('path'),
  isWindows = process.platform === 'win32',
  constants = require('./constants');

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

  addUpdatePodsToPodfile() {
    const rnVersionInt = parseInt(this.packageJson.dependencies['react-native'].split('.')[1], 10);

    if (rnVersionInt < 62) {
      return;
    }

    const podfilePath = path.join(this.projectRoot, 'ios', 'Podfile'),
      postInstall = 'post_install do |installer|';
    let podfileContent = fs.readFileSync(podfilePath, 'utf-8');

    if (!podfileContent.includes(postInstall) || podfileContent.includes(constants.updatePodsCommand)) {
      return;
    }

    const addContentToPodFile = function({afterWhere, content, fileContent}) {
      if (afterWhere === undefined) {
        return content + fileContent;
      }

      const postInstallIndex = fileContent.indexOf(afterWhere) + 1,
        beforePostInstall = fileContent.substring(0, postInstallIndex + afterWhere.length),
        afterPostInstall = fileContent.substring(postInstallIndex + afterWhere.length + 1, fileContent.length);

      return beforePostInstall + content + afterPostInstall;
    };

    podfileContent = podfileContent.replace(constants.podPlatformPatternVersion, constants.podPlatformV13);

    if (!podfileContent.includes(constants.disabledFlipper)) {
      podfileContent = podfileContent.replace(constants.enabledFlipper, constants.disabledFlipper);
    }

    podfileContent = addContentToPodFile({
      afterWhere: postInstall,
      content: constants.updatePodsCommand,
      fileContent: podfileContent
    });

    podfileContent = addContentToPodFile({
      content: constants.bbdPodCommand,
      fileContent: podfileContent
    });

    fs.writeFileSync(podfilePath, podfileContent, 'utf-8');
  }
}

module.exports = ReactNativeHelper;
