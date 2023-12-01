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
    fse = require('fs-extra'),
    projectRoot = process.env.PROJECT_ROOT || process.env.INIT_CWD,
    androidProjectRoot = path.join(projectRoot, 'android'),
    bbdBasePath = process.cwd(),
    { pipe, curry, replace } = require('./utils');

  const {
    mavenLocal,
    mavenCentral,
    androidBuildToolsGradleTemplate,
    bbdMavenString,
    bbdLifeCycleImport,
    bbdReactActivityDelegateImport,
    bbdReactActivityImport,
    reactViewImport,
  } = require('./constants');

  const {
    getProjectPackageName,
    addBbdDependencies,
    addImportLineInJavaFile,
    updateExtendsClassInMainActivity,
    updateReactActivityDelegateUsage,
    updateReactActivityUsage,
    commentFlipperForRn70x,
    commentFlipperForRn71xPlus,
    updateOnCreateInMainApplication,
    updatePackageNameInJavaFile,
    renameReactActivityDelegate,
    addMavenStringForRnHigherThan71,
    updateFinalFromRnFlipperClass,
    flipperUpdater
  } = require('./functions/android');

  if (fs.existsSync(androidProjectRoot)) {
    // Update root build.gradle
    const projectBuildGradle = path.join(androidProjectRoot, 'build.gradle'),
      projectBuildGradleContent = fs.readFileSync(projectBuildGradle, 'utf-8');

    // store original top-level build.gradle to recover to original if remove base plugin
    const projectBuildGradleOriginal = path.join(projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base', 'android', 'build.gradle.original');
    if (!fs.existsSync(projectBuildGradleOriginal)) {
      fs.writeFileSync(projectBuildGradleOriginal, projectBuildGradleContent, 'utf-8');
    }

    if (projectBuildGradleContent.indexOf(bbdMavenString) < 0) {
      const newProjectBuildGradleContent = pipe(
        // For RN versions < 0.67
        replace(mavenLocal, bbdMavenString + mavenLocal),
        // For RN versions 0.67.x
        replace(mavenCentral, bbdMavenString + mavenCentral),
        replace(androidBuildToolsGradleTemplate, 'com.android.tools.build:gradle:4.2.2'),
        // For RN versions >= 0.71.x
        addMavenStringForRnHigherThan71
      )(projectBuildGradleContent);

      fs.writeFileSync(projectBuildGradle, newProjectBuildGradleContent, 'utf-8');
    }

    // Update app/build.gradle
    const projectAppBuildGradle = path.join(androidProjectRoot, 'app', 'build.gradle'),
      projectAppBuildGradleContent = fs.readFileSync(projectAppBuildGradle, 'utf-8');

    fs.writeFileSync(
      projectAppBuildGradle,
      addBbdDependencies(projectAppBuildGradleContent),
      'utf-8'
    );

    // Read project name and project package name
    const bbdBaseAndroidMainPath = path.join(bbdBasePath, 'android', 'src', 'main'),
      projectAndroidMainPath = path.join(androidProjectRoot, 'app', 'src', 'main'),
      projectPackageName = getProjectPackageName(androidProjectRoot);

    // Update MainActivity and MainApplication, "newarchitecture" classes
    const projectMainClassesPath = path.join(projectAndroidMainPath, 'java', ...projectPackageName.split('.')),
      projectMainActivityPath = path.join(projectMainClassesPath, 'MainActivity.java'),
      projectMainApplicationPath = path.join(projectMainClassesPath, 'MainApplication.java');

    const projectMainActivityContent = fs.readFileSync(projectMainActivityPath, 'utf-8'),
      projectMainApplicationContent = fs.readFileSync(projectMainApplicationPath, 'utf-8');

    fs.writeFileSync(
      projectMainActivityPath,
      pipe(
        curry(addImportLineInJavaFile, bbdReactActivityDelegateImport),
        curry(addImportLineInJavaFile, reactViewImport),
        curry(addImportLineInJavaFile, bbdReactActivityImport),
        updateReactActivityUsage,
        updateReactActivityDelegateUsage,
        updateExtendsClassInMainActivity,
        curry(updatePackageNameInJavaFile, projectPackageName),
        renameReactActivityDelegate
      )(projectMainActivityContent)
    );

    fs.writeFileSync(
      projectMainApplicationPath,
      pipe(
        curry(addImportLineInJavaFile, bbdLifeCycleImport),
        updateOnCreateInMainApplication,
        curry(updatePackageNameInJavaFile, projectPackageName),
        commentFlipperForRn70x,
        commentFlipperForRn71xPlus
      )(projectMainApplicationContent)
    );

    // Copy JSON's with settings with updated package name
    const bbdBaseSettingsJsonPath = path.join(bbdBaseAndroidMainPath, 'assets', 'settings.json'),
      projectSettingsJsonPath = path.join(projectAndroidMainPath, 'assets', 'settings.json');

    let settingsJsonObj = JSON.parse(fs.readFileSync(bbdBaseSettingsJsonPath, 'utf-8'));

    settingsJsonObj.GDApplicationID = projectPackageName;

    fse.outputFileSync(projectSettingsJsonPath, JSON.stringify(settingsJsonObj, null, 4), 'utf-8');
    fs.copyFileSync(
      path.join(bbdBaseAndroidMainPath, 'assets', 'com.blackberry.dynamics.settings.json'),
      path.join(projectAndroidMainPath, 'assets', 'com.blackberry.dynamics.settings.json')
    );

    // Add keyword 'final' to inner class variables in ReactNativeFlipper.java
    updateFinalFromRnFlipperClass(
      path.join(androidProjectRoot, 'app', 'src', 'debug', 'java'),
      flipperUpdater.add
    );

  } else {
    throw 'Error, there is no android directory in project!'
  }

})();
