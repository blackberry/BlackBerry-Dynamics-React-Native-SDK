#!/usr/bin/env node

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
  var readline = require('readline'),
    shell = require('shelljs'),
    fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    isWindows = process.platform === 'win32',
    projectRoot = process.env.PWD || process.env.INIT_CWD || process.cwd(),
    packageManager = process.env.npm_execpath && process.env.npm_execpath.includes('yarn.js') ? 'yarn' : 'npm',
    bbdBasePath = path.join(projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base'),
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    }),
    ReactNativeHelper = require('./ReactNativeHelper'),
    reactNativeHelper = new ReactNativeHelper(projectRoot);

  process.env.PROJECT_ROOT = projectRoot;

  readBundleIdCli();

  var projectAndroidMainPath = path.join(projectRoot, 'android', 'app', 'src', 'main'),
    projectAndroidManifestPath = path.join(projectAndroidMainPath, 'AndroidManifest.xml'),
    projectPackageName = getPackageNameFromAndroidManifest(projectAndroidManifestPath);

  // On Windows there is an issue with react-native-rename module.
  // It does not move MainActivity and MainApplication classes to new package.
  // Both classes get removed completely
  // We need to backup in Base module
  if (isWindows) {
    var oldProjectMainClassesPath = path.join(projectAndroidMainPath, 'java',
        ...projectPackageName.split('.')),
      oldProjectMainActivityPath = path.join(oldProjectMainClassesPath, 'MainActivity.java'),
      oldProjectMainApplicationPath = path.join(oldProjectMainClassesPath, 'MainApplication.java'),
      bbdBaseJavaCorePath = path.join(bbdBasePath, 'android', 'src', 'main', 'java',
        'com', 'blackberry', 'bbd', 'reactnative', 'core'),
      resStringsXmlPath = path.join(projectAndroidMainPath, 'res', 'values', 'strings.xml');

    // Backuping application name before remaning
    process.env.oldApplicationName = getApplicationName(resStringsXmlPath);

    fse.moveSync(oldProjectMainActivityPath,
      path.join(bbdBaseJavaCorePath, 'MainActivity.java'), { overwrite: true });
    fse.moveSync(oldProjectMainApplicationPath,
      path.join(bbdBaseJavaCorePath, 'MainApplication.java'), { overwrite: true });
  }

  function readBundleIdCli() {
    rl.question('[REQUIRED] Enter iOS Bundle Identifier / Android Package Name (e.g. "com.company.myapp"):\n', function(input) {
      var bundleId = input.trim(),
        bundleIdRegexp = /^([a-zA-Z0-9]+\.)+([a-zA-Z0-9])+$/,
        isValidBundleId = bundleIdRegexp.test(bundleId);

      if (isValidBundleId) {
        readNameCli(bundleId);
      } else {
        handleNotValidData();
      }
    });
  }

  function readNameCli(bundleId, question = '[OPTIONAL] Do you want to set new application name (y/n) ? \n') {
    rl.question(question, function(input) {
      switch (input.trim()) {
        case 'y':
          rl.question('Enter application name (e.g. "AwesomeProject", "Awesome Project" or "Awesome Project 2"):\n', function(input) {
            var appName = input.trim(),
              nameRegexp = /^[a-zA-Z0-9\s]+$/,
              isValidName = nameRegexp.test(appName);

            if (isValidName && handleAppNameAndBundleId(bundleId, appName)) {
              setBbdConfigurations(bundleId);
              rl.close();
            } else {
              handleNotValidData();
            }
          });
          break;
        case 'n':
          if (handleAppNameAndBundleId(bundleId)) {
            setBbdConfigurations(bundleId);
            rl.close();
          } else {
            handleNotValidData();
          }
          rl.close();
          break;
        default:
          readNameCli(bundleId, 'Please, enter (y/n) to continue...\n');
          break;
      }
    });
  }

  function handleNotValidData() {
    console.log('Error, not valid data!');
    readBundleIdCli();
  }

  function handleAppNameAndBundleId(bundleId, appName) {
    var nodeModulePath = packageManager === 'npm' ?
        path.join(bbdBasePath, 'node_modules') : path.join(projectRoot, 'node_modules'),
      rnRenameModulePath = path.join(nodeModulePath, 'react-native-rename');

    updateRnRename(rnRenameModulePath);

    var cmdInfoMessage = 'Setting bundle-id...';
    var nameCliParam = '';

    if (appName !== undefined) {
      nameCliParam = ` -n "${appName}"`;
      cmdInfoMessage = cmdInfoMessage.replace('...', ' and new application name...');
    }
    console.log(cmdInfoMessage);

    var renameCommandResult = shell.exec(
      `node "${path.join(rnRenameModulePath, 'lib', 'index.js')}" ${bundleId}${nameCliParam}`
    ).stdout;
    process.chdir(bbdBasePath);

    if (renameCommandResult.includes('APP SUCCESSFULLY RENAMED')) {
      return true;
    }

    return false;
  }

  function updateRnRename(pathToRNRenameModuleRoot) {
    // Add custom functionality to handle application bundle-id and name in react-native-rename module
    var rnRenameUpdatedScriptsPath = path.join(bbdBasePath, 'scripts', 'custom_rn_rename');

    fs.copyFileSync(
      path.join(rnRenameUpdatedScriptsPath, 'index.js'),
      path.join(pathToRNRenameModuleRoot, 'lib', 'index.js')
    );
    fs.copyFileSync(
      path.join(rnRenameUpdatedScriptsPath, 'bundleIdentifiers.js'),
      path.join(pathToRNRenameModuleRoot, 'lib', 'config', 'bundleIdentifiers.js')
    );
  }

  function setBbdConfigurations(bundleId) {
    reactNativeHelper.setBbdConfigurationsForAndroid();
    reactNativeHelper.setBbdConfigurationsForiOS(bundleId);
    console.log('Your BlackBerry Dynamics Entitlement ID or GDApplicationID has been set to ' + bundleId);
    console.log('Your BlackBerry Dynamics Entitlement Version or GDApplicationVersion has been set to 1.0.0.0\n');
  }

  function getPackageNameFromAndroidManifest(pathToAndroidManifest) {
    var androidManifestContent = fs.readFileSync(pathToAndroidManifest, 'utf-8'),
      startIndexOfPackageString = androidManifestContent.indexOf(
        '"', androidManifestContent.indexOf('package=')
      ) + 1,
      endIndexOfPackageString = androidManifestContent.indexOf('"', startIndexOfPackageString);

    return androidManifestContent.substring(startIndexOfPackageString, endIndexOfPackageString);
  }

  function getApplicationName(pathToResStringsXml) {
    var resStringsXmlContent = fs.readFileSync(pathToResStringsXml, 'utf-8'),
      beforeAppName = resStringsXmlContent.indexOf('>', resStringsXmlContent.indexOf('<string name="app_name">')) + 1,
      afterAppName = resStringsXmlContent.indexOf('</string>', beforeAppName);

    return resStringsXmlContent.substring(beforeAppName, afterAppName);
  }

})();
