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

const execSync = require('child_process').execSync,
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  reactNativeInfoJson = require('./development-tools-info.json');

const RN_INFO_KEYS = {
  os: 'OS:',
  node: 'Node:',
  yarn: 'Yarn:',
  npm: 'npm:',
  watchman: 'Watchman:',
  androidStudio: 'Android Studio:',
  xcode: 'Xcode:',
  iosSdk: {
    platforms: 'Platforms:'
  },
  androidSdk: {
    apiLevels: 'API Levels:',
    buildTools: 'Build Tools:',
    systemImages: 'System Images:'
  }
};

class ReactNativeInfoHelper {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.packageJson = require(path.join(this.projectRoot, 'package.json'));
    this.androidReactNativeInfoJsonPath = path.join(
      this.projectRoot, 'android', 'app', 'src', 'main', 'assets', 'development-tools-info.json'
    );
    this.iosReactNativeInfoJsonPath = path.join(
      this.projectRoot, 'ios', this.packageJson.name, 'Resources', 'development-tools-info.json'
    );
  }

  readPackageJsonDependencies() {
    const dependencies = this.packageJson.dependencies,
      devDependencies = this.packageJson.devDependencies,
      packageJsonDependencies = [
        ...Object.keys(dependencies).map(name => {
          return {
            name,
            version: this.handleModuleVersion(name, dependencies[name]),
            type: 'dependency'
          }
        }),
        ...Object.keys(devDependencies).map(name => {
          return {
            name,
            version: this.handleModuleVersion(name, devDependencies[name]),
            type: 'devDependency'
          }
        })
      ],
      currentModule = this.getBbdModuleFromInstallCmdCommand();

    // Add module to dependencies list, if it's not present at package.json
    if (currentModule && !packageJsonDependencies.find(dependency => dependency.name === currentModule.name)) {
      return [...packageJsonDependencies, currentModule];
    }

    return packageJsonDependencies;
  }

  getBbdModuleFromInstallCmdCommand(packageJsonDependencies) {
    // Add as dependency module from outgoing 'npm i/install' / 'yarn add' command for local bbd-modules
    const originalNpmConfigArgv = JSON.parse(process.env.npm_config_argv).original,
      moduleIndex = originalNpmConfigArgv.findIndex(arg => arg.includes('BlackBerry-Dynamics-for-React-Native-'));

    if (moduleIndex > -1 && (
        originalNpmConfigArgv[0] === 'i' ||
        originalNpmConfigArgv[0] === 'install' ||
        originalNpmConfigArgv[0] === 'add'
      )) {
      const modulePath = originalNpmConfigArgv[moduleIndex],
        moduleName = modulePath.split(path.sep)
          .filter(item => item.includes('BlackBerry-Dynamics-for-React-Native-'))[0];

      if (moduleName) {
        return {
          name: moduleName,
          version: this.handleModuleVersion(moduleName, modulePath),
          type: 'dependency'
        };
      }
    }
  }

  handleModuleVersion(name, version) {
    return this.isBbdModule(name) ? this.getModuleVersionByName(name) : version;
  }

  isBbdModule(moduleName) {
    return moduleName.includes('BlackBerry-Dynamics-for-React-Native-');
  }

  getModuleVersionByName(name) {
    const modulePackageJson = path.join(this.projectRoot, 'node_modules', name, 'package.json');

    if (fs.existsSync(modulePackageJson)) {
      const modulePackageJsonObj = JSON.parse(fs.readFileSync(modulePackageJson, 'utf-8'));

      return modulePackageJsonObj['version'];
    }

    return '';
  }

  storeReactNativeInfoForAndroid(reactNativeInfoObj) {
    fse.outputJsonSync(this.androidReactNativeInfoJsonPath, reactNativeInfoObj, 'utf-8');
  }

  storeReactNativeInfoForIOS(reactNativeInfoObj) {
    fse.outputJsonSync(this.iosReactNativeInfoJsonPath, reactNativeInfoObj, 'utf-8');
  }

  updateReactNativeInfoDependencies() {
    if (fs.existsSync(this.androidReactNativeInfoJsonPath)) {
      const reactNativeInfoObj = JSON.parse(fs.readFileSync(this.androidReactNativeInfoJsonPath, 'utf-8')),
        reactNativeModules = reactNativeInfoObj.framework.modules,
        currentModule = this.getBbdModuleFromInstallCmdCommand();

      if (currentModule && !reactNativeModules.find(module => module.name === currentModule.name)) {
        reactNativeModules.push(currentModule);

        fse.outputJsonSync(this.androidReactNativeInfoJsonPath, reactNativeInfoObj, 'utf-8');
        fse.outputJsonSync(this.iosReactNativeInfoJsonPath, reactNativeInfoObj, 'utf-8');
      }
    }
  }
}

class ReactNativeInfo extends ReactNativeInfoHelper {
  constructor(projectRoot, packageManager) {
    super(projectRoot);
    this.rnInfoCmd = packageManager === 'npm' ?
      `npx "${path.join(
        projectRoot, 'node_modules', 'react-native', 'node_modules', '@react-native-community', 'cli', 'build', 'bin.js'
      )}" info`
      :
      `npx "${path.join(
        projectRoot, 'node_modules', '@react-native-community', 'cli', 'build', 'bin.js'
      )}" info`;
    this.reactNativeInfoCmdResult = execSync(this.rnInfoCmd).toString();
    this.versionRegExp = /\d+(\.\d+){0,5}/;
  }

  getSystemInfo() {
    return {
      os: this.getValueByKeyFromCmdResult(RN_INFO_KEYS.os),
      node: process.versions.node,
      npm: this.getVersionByKeyFromCmdResult(RN_INFO_KEYS.npm),
      yarn: this.getVersionByKeyFromCmdResult(RN_INFO_KEYS.yarn),
      watchman: this.getVersionByKeyFromCmdResult(RN_INFO_KEYS.watchman),
      androidStudio: this.getVersionByKeyFromCmdResult(RN_INFO_KEYS.androidStudio),
      xcode: this.getVersionByKeyFromCmdResult(RN_INFO_KEYS.xcode)
    };
  }

  getIOSSDKInfo() {
    return {
      platforms: this.getValueByKeyFromCmdResult(RN_INFO_KEYS.iosSdk.platforms).split(', ')
    };
  }

  getAndroidSDKInfo() {
    return {
      apiLevels: this.getValueByKeyFromCmdResult(RN_INFO_KEYS.androidSdk.apiLevels).split(', '),
      buildTools: this.getValueByKeyFromCmdResult(RN_INFO_KEYS.androidSdk.buildTools).split(', '),
      systemImages: this.getValueByKeyFromCmdResult(RN_INFO_KEYS.androidSdk.systemImages).split(', ')
    };
  }

  getRowByKeyFromCmdResult(key) {
    const startRowIndex = this.reactNativeInfoCmdResult.indexOf(key);
    if (startRowIndex === -1) {
      return '';
    }
    const endRowIndex = this.reactNativeInfoCmdResult.indexOf('\n', startRowIndex);

    return this.reactNativeInfoCmdResult.substring(startRowIndex, endRowIndex);
  }

  getValueByKeyFromCmdResult(key) {
    const startRowIndex = this.reactNativeInfoCmdResult.indexOf(key);
    if (startRowIndex === -1) {
      return '';
    }
    const endRowIndex = this.reactNativeInfoCmdResult.indexOf('\n', startRowIndex);

    return this.reactNativeInfoCmdResult.substring(startRowIndex + key.length, endRowIndex).trim();;
  }

  getVersionByKeyFromCmdResult(key) {
    const regExpResult = this.versionRegExp.exec(this.getRowByKeyFromCmdResult(key));

    return regExpResult ? regExpResult[0] : 'Not Available';
  }

  getReactNativeInfo() {
    return {
      framework: {
        name: 'ReactNative',
        bbdSdkForReactNativeVersion: reactNativeInfoJson.framework['bbdSdkForReactNativeVersion'] || 'Not Available',
        'react-native': this.packageJson.dependencies['react-native'] || 'Not Available',
        react: this.packageJson.dependencies['react'] || 'Not Available',
        system: this.getSystemInfo(),
        iosSdk: this.getIOSSDKInfo(),
        androidSdk: this.getAndroidSDKInfo(),
        modules: this.readPackageJsonDependencies()
      }
    };
  }

}

module.exports = {
  ReactNativeInfoHelper,
  ReactNativeInfo
};
