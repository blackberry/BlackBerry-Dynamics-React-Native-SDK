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
    projectRoot = process.env.INIT_CWD,
    isWindows = process.platform === 'win32',
    scriptPath = path.join(
      projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base',
      'scripts', 'react_native_info', 'update_development_info.js'
    ),
    constants = require('./constants');

  try {
    execSync(`node "${scriptPath}"`);
  } catch (e) {
    // BlackBerry-Dynamics-for-React-Native-Base is not yet installed.
    // We shouldn't do any actions here.
  }

  addRNCClipboardToPodfile();

  function checkAndExitOrContinue() {
    var originalNpmConfigArgv = JSON.parse(process.env.npm_config_argv).original,
      filteredOriginal = originalNpmConfigArgv.filter(function(val, i) {
        return !['--save', '--verbose', '--d'].includes(val);
      });

    if (!(filteredOriginal[1] && filteredOriginal[1].indexOf('BlackBerry-Dynamics-for-React-Native-Clipboard') > -1 &&
      (filteredOriginal.includes('i') || filteredOriginal.includes('install') || filteredOriginal.includes('add')))) {
      process.exit(0);
    }
  }

  function addRNCClipboardToPodfile() {
    if (isWindows) { return; }

    if (fs.existsSync(path.join(projectRoot, 'ios'))) {
      const podStr = constants.linkRNCClipboardPodCommand,
        podfilePath = path.join(projectRoot, 'ios', 'Podfile');

      let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
      if (!podfileContent.includes(podStr)) {
        podfileContent = podStr + podfileContent;
        fs.writeFileSync(podfilePath, podfileContent, 'utf-8');
      }
    }
  }

})();
