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
  const fs = require('fs'),
    path = require('path'),
    projectRoot = process.env.INIT_CWD,
    androidProjectRoot = path.join(projectRoot, 'android'),
    ReactNativeHelper = require('./ReactNativeHelper'),
    reactNativeHelper = new ReactNativeHelper(projectRoot),
    rnVersion = reactNativeHelper.getRnVersion();

  const { pipe, curry } = require('./utils');

  const {
    bbdLifeCycleImport,
    bbdReactActivityDelegateImport,
    bbdReactActivityImport
  } = require('./constants');

  const {
    getProjectPackageName,
    removeBbdDependencies,
    removeImportLineInJavaFile,
    restoreReactActivityUsage,
    restoreReactActivityDelegateUsage,
    restoreExtendsClassInMainActivity,
    restoreOnCreateInMainApplication,
    restoreReactActivityDelegateCodeForRnHigherThan70,
    unCommentFlipperForRn70x,
    unCommentFlipperForRn71xPlus,
    updateFinalFromRnFlipperClass,
    flipperUpdater
  } = require('./functions/android');

  if (fs.existsSync(androidProjectRoot)) {
    // Cleanup root build.gradle
    const projectBuildGradle = path.join(androidProjectRoot, 'build.gradle'),
      projectBuildGradleOriginal = path.join(projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base', 'android', 'build.gradle.original');
    if (fs.existsSync(projectBuildGradleOriginal)) {
      // Recover to original top-level build.gradle
      const projectBuildGradleContent = fs.readFileSync(projectBuildGradleOriginal, 'utf-8');
      fs.writeFileSync(projectBuildGradle, projectBuildGradleContent, 'utf-8');
    }

    // Cleanup app/build.gradle
    const projectAppBuildGradle = path.join(androidProjectRoot, 'app', 'build.gradle'),
      projectAppBuildGradleContent = fs.readFileSync(projectAppBuildGradle, 'utf-8');

    fs.writeFileSync(
      projectAppBuildGradle,
      removeBbdDependencies(projectAppBuildGradleContent),
      'utf-8'
    );

    // Read project name and project package name
    const projectAndroidMainPath = path.join(androidProjectRoot, 'app', 'src', 'main'),
      projectPackageName = getProjectPackageName(androidProjectRoot);

    // Cleanup MainActivity and MainApplication
    const projectMainClassesPath = path.join(projectAndroidMainPath, 'java', ...projectPackageName.split('.')),
      projectMainActivityPath = path.join(projectMainClassesPath, 'MainActivity.java'),
      projectMainApplicationPath = path.join(projectMainClassesPath, 'MainApplication.java'),
      projectMainActivityContent = fs.readFileSync(projectMainActivityPath, 'utf-8'),
      projectMainApplicationContent = fs.readFileSync(projectMainApplicationPath, 'utf-8');

    fs.writeFileSync(
      projectMainActivityPath,
      pipe(
        curry(restoreReactActivityDelegateCodeForRnHigherThan70, rnVersion),
        curry(removeImportLineInJavaFile, bbdReactActivityDelegateImport),
        curry(removeImportLineInJavaFile, bbdReactActivityImport),
        restoreExtendsClassInMainActivity,
        restoreReactActivityUsage,
        restoreReactActivityDelegateUsage,
      )(projectMainActivityContent)
    );

    fs.writeFileSync(
      projectMainApplicationPath,
      pipe(
        curry(removeImportLineInJavaFile, bbdLifeCycleImport),
        restoreOnCreateInMainApplication,
        unCommentFlipperForRn70x,
        unCommentFlipperForRn71xPlus
      )(projectMainApplicationContent)
    );

    // Remove settings
    const settingsJsonPath = path.join(projectAndroidMainPath, 'assets', 'settings.json'),
      dynamicsSettingsJsonPath = path.join(projectAndroidMainPath, 'assets', 'com.blackberry.dynamics.settings.json');

    if (fs.existsSync(settingsJsonPath)) {
      fs.unlinkSync(settingsJsonPath);
    }

    if (fs.existsSync(dynamicsSettingsJsonPath)) {
      fs.unlinkSync(dynamicsSettingsJsonPath);
    }

    // Remove development-tools-info.json
    const androidReactNativeInfoJsonPath = path.join(
      projectAndroidMainPath, 'assets', 'development-tools-info.json'
    );

    if (fs.existsSync(androidReactNativeInfoJsonPath)) {
      fs.unlinkSync(androidReactNativeInfoJsonPath);
    }

    // Remove keyword 'final' from ReactNativeFlipper.java local class variables
    updateFinalFromRnFlipperClass(
      path.join(androidProjectRoot, 'app', 'src', 'debug', 'java'),
      flipperUpdater.remove
    );

  } else {
    throw 'Error, there is no android directory in project!'
  }

})();
