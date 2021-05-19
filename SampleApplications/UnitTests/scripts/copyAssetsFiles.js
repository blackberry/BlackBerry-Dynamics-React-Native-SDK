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
  var fs = require('fs-extra'),
    path = require('path'),
    shell = require('shelljs'),
    projectRoot = process.env.INIT_CWD,
    isWindows = process.platform === 'win32',
    packageManager = process.env.npm_execpath && process.env.npm_execpath.includes('yarn.js') ? 'yarn' : 'npm',
    // copyAndReplace.js command line tool that is used by react-native-eject
    // @react-native-community/cli – the one used directly by react-native
    projectCliCopyAndReplace = packageManager === 'npm' ?
      path.join(projectRoot, 'node_modules', 'react-native', 'node_modules', '@react-native-community',
        'cli', 'build', 'tools', 'copyAndReplace.js')
      :
      path.join(projectRoot, 'node_modules', '@react-native-community', 'cli', 'build', 'tools', 'copyAndReplace.js');

    if (fs.existsSync(projectCliCopyAndReplace)) {
      // Read react-native cli tool copyAndReplace.js
      var copyAndReplaceContent = fs.readFileSync(projectCliCopyAndReplace, 'utf-8');
      var binaryExtensions = `const binaryExtensions = ['.png', '.jar', '.keystore', '.db', '.sqlite', '.bin'];`;

      if (copyAndReplaceContent.indexOf(binaryExtensions) < 0) {

        // Add binary file types to accept database file in eject command
        copyAndReplaceContent = copyAndReplaceContent.replace(`const binaryExtensions = ['.png', '.jar', '.keystore'];`, binaryExtensions);
        fs.writeFileSync(projectCliCopyAndReplace, copyAndReplaceContent, 'utf-8');

        console.log("success: add binary file types for database in copyAndReplace.js");
      }

      // react-native template folder that is used by react-native-eject
      var projectTemplatePath = path.join(projectRoot, 'node_modules', 'react-native', 'template'),
        projectTemplateAndroidAssetsPath = path.join(projectTemplatePath, 'android', 'app', 'src', 'main', 'assets'),
        projectTemplateIOSAssetsPath = path.join(projectTemplatePath, 'ios', 'HelloWorld'),
        projectAssetsPath = path.join(projectRoot, 'assets');

      // Android: copies assets directory, even if it has subdirectories or files
      fs.copySync(projectAssetsPath, projectTemplateAndroidAssetsPath, {overwrite: true});
      console.log("success: copied assets to Android template");

      if (!isWindows) {
        // iOS: copies assets directory, even if it has subdirectories or files
        fs.copySync(projectAssetsPath, projectTemplateIOSAssetsPath, {overwrite: true});
        console.log("success: copied assets to iOS template");

        console.log('Setting configurations for iOS...');
        shell.exec(path.join('.', 'scripts', 'update_ios_config.rb'));
      }
    }

})();
