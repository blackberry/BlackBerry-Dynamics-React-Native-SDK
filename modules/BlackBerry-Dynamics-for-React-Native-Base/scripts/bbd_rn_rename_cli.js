#!/usr/bin/env node

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

(function() {
  const readline = require('readline'),
    shell = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    projectRoot = process.env.PWD || process.env.INIT_CWD || process.cwd(),
    projectName = require(path.join(projectRoot, 'app.json')).name,
    packageManager = process.env.npm_execpath && process.env.npm_execpath.includes('yarn.js') ? 'yarn' : 'npm',
    bbdBasePath = path.join(projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base'),
    { getProjectPackageName } = require(path.join(bbdBasePath, 'scripts', 'functions', 'android.js')),
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    }),
    ReactNativeHelper = require('./ReactNativeHelper'),
    reactNativeHelper = new ReactNativeHelper(projectRoot);

  process.env.PROJECT_ROOT = projectRoot;

  const oldAppName = getAppPackageName();

  readBundleIdCli();

  function readBundleIdCli() {
    rl.question('[REQUIRED] Enter iOS Bundle Identifier / Android Package Name (e.g. "com.company.myapp"):\n', function(input) {
      const bundleId = input.trim(),
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
            const appName = input.trim(),
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
          if (handleAppNameAndBundleId(bundleId, projectName)) {
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
    const nodeModulePath = packageManager === 'npm' ?
        path.join(bbdBasePath, 'node_modules') : path.join(projectRoot, 'node_modules'),
      rnRenameModulePath = path.join(nodeModulePath, 'react-native-rename');

    let cmdInfoMessage = 'Setting bundle-id...';
    let nameCliParam = '';

    if (appName !== undefined) {
      nameCliParam = `"${appName}"`;
      cmdInfoMessage = cmdInfoMessage.replace('...', ' and new application name...');
    }
    console.log(cmdInfoMessage);

    const renameCommandResult = shell.exec(
      `node "${path.join(rnRenameModulePath, 'lib', 'index.js')}" ${nameCliParam} -b ${bundleId} --skipGitStatusCheck`
    ).stdout;
    process.chdir(bbdBasePath);

    if (renameCommandResult.includes('Your app has been renamed')) {
      return true;
    }

    if (renameCommandResult.includes('This is not a git repository')) {
      throw "Error, failed to set bundle-id! Please, initialize a new repository by running 'git init' command and try again";
    }

    return false;
  }

  function setBbdConfigurations(bundleId) {
    reactNativeHelper.setBbdConfigurationsForAndroid();
    reactNativeHelper.setBbdConfigurationsForiOS(bundleId);
    removeEmptyFoldersForAndroidAfterRename();
    console.log('Your BlackBerry Dynamics Entitlement ID or GDApplicationID has been set to ' + bundleId);
    console.log('Your BlackBerry Dynamics Entitlement Version or GDApplicationVersion has been set to 1.0.0.0\n');
  }

  function removeEmptyFoldersForAndroidAfterRename() {
    const remove = function(dir) {
      if (!fs.existsSync(dir)) {
        return;
      }

      const files = fs.readdirSync(dir);

      if (files && files.length) {
        return;
      }

      fs.rmdirSync(dir);
    };

    const androidRoot = path.join(projectRoot, 'android', 'app', 'src');

    const foldersToRemove = [
      path.join(androidRoot, 'debug', 'java', 'com', oldAppName),
      path.join(androidRoot, 'main', 'java', 'com', oldAppName),
      path.join(androidRoot, 'release', 'java', 'com', oldAppName),
    ];

    foldersToRemove.forEach(remove);
  }

  function getAppPackageName() {
    const name = getProjectPackageName(
      path.join(projectRoot, 'android')
    ).split('.');
    return name[name.length -1];
  }

})();
