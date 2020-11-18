/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
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

var shell = require('shelljs'),
  fs = require('fs'),
  path = require('path'),
  isWindows = process.platform === 'win32';

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
    var cmdiOSCommand = path.join('.', 'scripts', 'bbd_rn_install_ios.rb');

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
    var rnVersionInt = parseInt(this.packageJson.dependencies['react-native'].split('.')[1], 10);

    if (rnVersionInt < 62) {
      return;
    }

    var cmd = '\t\tsystem("node ../node_modules/BlackBerry-Dynamics-for-React-Native-Base/scripts/updatePods.js")\n',
      podfilePath = path.join(this.projectRoot, 'ios', 'Podfile'),
      podfileContent = fs.readFileSync(podfilePath, 'utf-8'),
      postInstall = 'post_install do |installer|';

    if (podfileContent.indexOf(postInstall) < 0 || podfileContent.indexOf(cmd) >= 0) {
      return;
    }

    var postInstallIndex = podfileContent.indexOf(postInstall) + 1,
      beforePostInstall = podfileContent.substring(0, postInstallIndex + postInstall.length),
      afterPostInstall = podfileContent.substring(postInstallIndex + postInstall.length + 1, podfileContent.length),
      newPodfileContent = beforePostInstall + cmd + afterPostInstall;

    fs.writeFileSync(podfilePath, newPodfileContent, 'utf-8');
  }
}

module.exports = ReactNativeHelper;
