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

  const shell = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    projectRoot = process.env.INIT_CWD,
    androidProjectRoot = path.join(projectRoot, 'android'),
    iosProjectRoot = path.join(projectRoot, 'ios'),
    isWindows = process.platform === 'win32';

  if (fs.existsSync(androidProjectRoot)) {
    // Cleanup root build.gradle
    const projectBuildGradlePath = path.join(androidProjectRoot, 'app', 'build.gradle'),
      gradleLauncherString = `apply from: "$rootDir/../node_modules/BlackBerry-Dynamics-for-React-Native-Launcher/android/launcher.gradle"
    implementation fileTree`;

    let projectBuildGradleContent = fs.readFileSync(projectBuildGradlePath, 'utf-8');
    projectBuildGradleContent = projectBuildGradleContent.replace(gradleLauncherString, 'implementation fileTree');
    fs.writeFileSync(projectBuildGradlePath, projectBuildGradleContent, 'utf-8');

    // Remove launcherlib.aar from "project_root/android/app/libs"
    const projectLauncherLibPath = path.join(androidProjectRoot, 'app', 'libs', 'launcherlib.aar');
    if (fs.existsSync(projectLauncherLibPath)) {
      fs.unlinkSync(projectLauncherLibPath);
    }
  }

  if (fs.existsSync(iosProjectRoot)) {
   if (isWindows) { return; }

   try {
      const uninstallScript = path.join(
         projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Launcher',
         'scripts', 'ios', 'rmLauncherFramework.rb'
       );
      shell.exec(`ruby "${uninstallScript}"`);
   } catch (error) {
     console.log(error);
   }
  }

  function checkAndExitOrContinue() {
    // example of process.env.npm_config_argv
    // {"remain":["../../modules/BlackBerry-Dynamics-for-React-Native-Launcher/"],
    // "cooked":["--save","i","../../modules/BlackBerry-Dynamics-for-React-Native-Launcher/"],
    // "original":["--save","i","../../modules/BlackBerry-Dynamics-for-React-Native-Launcher/"]}

    const originalNpmConfigArgv = JSON.parse(process.env.npm_config_argv).original,
      filteredOriginal = originalNpmConfigArgv.filter(function(val, i) {
        return !['--save', '--verbose', '--d'].includes(val);
      });

    if (!(filteredOriginal[1] && filteredOriginal[1].indexOf('BlackBerry-Dynamics-for-React-Native-Launcher') > -1 &&
      (filteredOriginal.includes('uninstall') || filteredOriginal.includes('remove')))) {
      process.exit(0);
    }
  }

})();
