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

(function() {
  var projectRoot = process.env.INIT_CWD,
    packageManager = process.env.npm_execpath.includes('npm-cli.js') ? 'npm' : 'yarn',
    ReactNativeHelper = require('./ReactNativeHelper'),
    reactNativeHelper = new ReactNativeHelper(projectRoot),
    ReactNativeInfo = require('./react_native_info/ReactNativeInfoHelper').ReactNativeInfo,
    reactNativeInfo = new ReactNativeInfo(projectRoot, packageManager);

  var reactNativeInfoJson = reactNativeInfo.getReactNativeInfo();
  reactNativeInfo.storeReactNativeInfoForIOS(reactNativeInfoJson);
  reactNativeInfo.storeReactNativeInfoForAndroid(reactNativeInfoJson);

  // We should run this script only if we install BlackBerry-Dynamics-for-React-Native-Base module.
  // In other circumstances like 'npm i' or 'yarn' or 'npm uninstall' or 'npm i <other_module>' we should exit.
  // This is becasue sometimes other actions trigger running this script and we need to do setup process again.
  checkAndExitOrContinue();

  reactNativeHelper.setBbdConfigurationsForAndroid();
  reactNativeHelper.setBbdConfigurationsForiOS();

  function checkAndExitOrContinue() {
    // example of process.env.npm_config_argv
    // {"remain":["../../modules/BlackBerry-Dynamics-for-React-Native-Base/"],
    // "cooked":["--save","i","../../modules/BlackBerry-Dynamics-for-React-Native-Base/"],
    // "original":["--save","i","../../modules/BlackBerry-Dynamics-for-React-Native-Base/"]}

    var originalNpmConfigArgv = JSON.parse(process.env.npm_config_argv).original,
      filteredOriginal = originalNpmConfigArgv.filter(function(val, i) {
        return !['--save', '--verbose', '--d'].includes(val);
      });

    if (!(filteredOriginal[1] && filteredOriginal[1].indexOf('BlackBerry-Dynamics-for-React-Native-Base') > -1 &&
        (filteredOriginal.includes('i') || filteredOriginal.includes('install') || filteredOriginal.includes('add')))) {
      process.exit(0);
    }
  }

})();
