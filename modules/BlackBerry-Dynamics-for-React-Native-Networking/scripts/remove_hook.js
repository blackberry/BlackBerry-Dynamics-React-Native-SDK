#!/usr/bin/env node

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

(function() {
  checkAndExitOrContinue();

  const execSync = require('child_process').execSync,
    path = require('path'),
    fs = require('fs'),
    isWindows = process.platform === 'win32',
    projectRoot = process.env.INIT_CWD,
    constants = require('./constants');

  removeBbdJetfireLibFromPodfile();

  function checkAndExitOrContinue() {
    // example of process.env.npm_config_argv
    // {"remain":["../../modules/BlackBerry-Dynamics-for-React-Native-Networking/"],
    // "cooked":["--save","i","../../modules/BlackBerry-Dynamics-for-React-Native-Networking/"],
    // "original":["--save","i","../../modules/BlackBerry-Dynamics-for-React-Native-Networking/"]}
    let originalNpmConfigArgv = JSON.parse(process.env.npm_config_argv).original,
      filteredOriginal = originalNpmConfigArgv.filter(function(val, i) {
        return !['--save', '--verbose', '--d'].includes(val);
      });
    if (!(filteredOriginal[1] && filteredOriginal[1].indexOf('BlackBerry-Dynamics-for-React-Native-Networking') > -1 &&
      (filteredOriginal.includes('uninstall') || filteredOriginal.includes('remove')))) {
      process.exit(0);
    }
  }

  function removeBbdJetfireLibFromPodfile() {
    if (isWindows) { return; }

    if (fs.existsSync(path.join(projectRoot, 'ios'))) {
      const podStr = constants.bbdJetfirePodCommand,
        podfilePath = path.join(projectRoot, 'ios', 'Podfile');

      let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
      if (podfileContent.includes(podStr)) {
        podfileContent = podfileContent.replace(podStr, '');
        fs.writeFileSync(podfilePath, podfileContent, 'utf-8');
      }
    }
  }

})();
