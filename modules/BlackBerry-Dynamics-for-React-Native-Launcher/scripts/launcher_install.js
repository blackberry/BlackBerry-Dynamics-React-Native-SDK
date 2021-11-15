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
    execSync = require('child_process').execSync,
    path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    projectRoot = process.env.INIT_CWD,
    androidProjectRoot = path.join(projectRoot, 'android'),
    iosProjectRoot = path.join(projectRoot, 'ios'),
    launcherModulePath = process.cwd(),
    isWindows = process.platform === 'win32',
    scriptPath = path.join(
      projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base',
      'scripts', 'react_native_info', 'update_development_info.js'
    ),
    addLauncherScriptPath = path.join(
      projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Launcher',
      'scripts', 'ios', 'addLauncherFramework.rb'
    );

  try {
    execSync(`node "${scriptPath}"`);
  } catch (e) {
    // BlackBerry-Dynamics-for-React-Native-Base is not yet installed.
    // We shouldn't do any actions here.
  }

  if (fs.existsSync(androidProjectRoot)) {
    // Update project root build.gradle
    const projectBuildGradlePath = path.join(androidProjectRoot, 'app', 'build.gradle'),
      gradleLauncherString = `apply from: "$rootDir/../node_modules/BlackBerry-Dynamics-for-React-Native-Launcher/android/launcher.gradle"
    implementation fileTree`;

    let projectBuildGradleContent = fs.readFileSync(projectBuildGradlePath, 'utf-8');
    if (projectBuildGradleContent.indexOf(gradleLauncherString) < 0) {
      projectBuildGradleContent = projectBuildGradleContent.replace('implementation fileTree', gradleLauncherString);

      fs.writeFileSync(projectBuildGradlePath, projectBuildGradleContent, 'utf-8');
    }

    // Copy launcherlib.aar from BlackBerry-Dynamics-for-React-Native-Launcher to "project_root/android/app/libs"
    try {
      fse.copySync(
        path.join(launcherModulePath, 'android', 'libs', 'launcherlib.aar'),
        path.join(androidProjectRoot, 'app', 'libs', 'launcherlib.aar')
      );
    } catch (error) {
      throw error.message + '\n\nError, please refer to preconditions ' +
        'in BlackBerry-Dynamics-for-React-Native-Launcher/README.md to correctly setup Launcher module dependencies.\n';
    }
  } else {
    throw 'Error, there is no android directory in project!';
  }

  if (fs.existsSync(iosProjectRoot)) {
    if (isWindows) { return; }

    const launcherFrameworksDir = path.join(launcherModulePath, 'ios', 'frameworks');
    const launcherXCFrameworkPath = path.join(launcherFrameworksDir, 'BlackBerryLauncher.xcframework');

    if (!fs.existsSync(launcherXCFrameworkPath)) {
      throw 'BlackBerryLauncher.xcframework not found in ' +
        launcherFrameworksDir +
        '\n\nError, please refer to preconditions ' +
        'in BlackBerry-Dynamics-for-React-Native-Launcher/README.md ' +
        'to correctly setup Launcher module dependencies.\n';
    }

    try {
      if( !shell.exec(`ruby "${addLauncherScriptPath}"`).code !== 0 ) {
        throw new Error('\nERROR: addLauncherFramework exited with error!');
      }
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
      (filteredOriginal.includes('i') || filteredOriginal.includes('install') || filteredOriginal.includes('add')))) {
      process.exit(0);
    }
  }

})();
