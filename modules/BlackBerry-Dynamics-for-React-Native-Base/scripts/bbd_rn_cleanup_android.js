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
  var fs = require('fs'),
    path = require('path'),
    projectRoot = process.env.INIT_CWD,
    androidProjectRoot = path.join(projectRoot, 'android');

  if (fs.existsSync(androidProjectRoot)) {
    // Cleanup root build.gradle
    var projectBuildGradle = path.join(androidProjectRoot, 'build.gradle'),
      projectBuildGradleOriginal = path.join(projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base', 'android', 'build.gradle.original');
    if (fs.existsSync(projectBuildGradleOriginal)) {
      // Recover to original top-level build.gradle
      var projectBuildGradleContent = fs.readFileSync(projectBuildGradleOriginal, 'utf-8');
      fs.writeFileSync(projectBuildGradle, projectBuildGradleContent, 'utf-8');
    }

    // Cleanup app/build.gradle
    var projectAppBuildGradle = path.join(androidProjectRoot, 'app', 'build.gradle'),
      projectAppBuildGradleContent = fs.readFileSync(projectAppBuildGradle, 'utf-8'),
      bbdDependenciesString = `apply from: "$rootDir/../node_modules/BlackBerry-Dynamics-for-React-Native-Base/android/gd.gradle"
    implementation fileTree`;

    projectAppBuildGradleContent = projectAppBuildGradleContent.replace(bbdDependenciesString, 'implementation fileTree');
    fs.writeFileSync(projectAppBuildGradle, projectAppBuildGradleContent, 'utf-8');

    // Read project name and project package name
    var projectAndroidMainPath = path.join(androidProjectRoot, 'app', 'src', 'main'),
      projectAndroidManifestPath = path.join(projectAndroidMainPath, 'AndroidManifest.xml'),
      projectPackageName = getPackageNameFromAndroidManifest(projectAndroidManifestPath);

    // Cleanup MainActivity and MainApplication
    var projectMainClassesPath = path.join(projectAndroidMainPath, 'java', ...projectPackageName.split('.')),
      projectMainActivityPath = path.join(projectMainClassesPath, 'MainActivity.java'),
      projectMainApplicationPath = path.join(projectMainClassesPath, 'MainApplication.java'),
      projectMainActivityContent = fs.readFileSync(projectMainActivityPath, 'utf-8'),
      projectMainApplicationContent = fs.readFileSync(projectMainApplicationPath, 'utf-8');

    var bbdLifeCycleCall = '\n\t\tBBDLifeCycle.getInstance().initialize(this);\n',
      bbdLifeCycleImport = '\nimport com.blackberry.bbd.reactnative.core.BBDLifeCycle;\n',
      bbdReactActivityImport = '\nimport com.blackberry.bbd.reactnative.core.BBDReactActivity;\n';

    fs.writeFileSync(
      projectMainActivityPath,
      removeImportLineInJavaFile(bbdReactActivityImport,
        updateExtendsClassInMainActivity(projectMainActivityContent)
      )
    );
    fs.writeFileSync(
      projectMainApplicationPath,
      removeImportLineInJavaFile(bbdLifeCycleImport,
        updateOnCreateInMainApplication(projectMainApplicationContent)
      )
    );

    // Remove settings
    var settingsJsonPath = path.join(projectAndroidMainPath, 'assets', 'settings.json'),
      dynamicsSettingsJsonPath = path.join(projectAndroidMainPath, 'assets', 'com.blackberry.dynamics.settings.json');

    if (fs.existsSync(settingsJsonPath)) {
      fs.unlinkSync(settingsJsonPath);
    }

    if (fs.existsSync(dynamicsSettingsJsonPath)) {
      fs.unlinkSync(dynamicsSettingsJsonPath);
    }

    // Remove development-tools-info.json
    var androidReactNativeInfoJsonPath = path.join(
      projectAndroidMainPath, 'assets', 'development-tools-info.json'
    );

    if (fs.existsSync(androidReactNativeInfoJsonPath)) {
      fs.unlinkSync(androidReactNativeInfoJsonPath);
    }

    // Remove keyword 'final' from ReactNativeFlipper.java local class variables
    var androidSrcDebugPath = path.join(androidProjectRoot, 'app', 'src', 'debug', 'java'),
      rnFlipperFileName = 'ReactNativeFlipper.java',
      finder = require('findit')(androidSrcDebugPath);

    finder.on('file', function(filePath) {
      if (filePath.includes(rnFlipperFileName)) {
        removeFinalFromRnFlipperClass(filePath);
      }
    });

    function updateExtendsClassInMainActivity(fileContent) {
      return fileContent.replace('extends BBDReactActivity', 'extends ReactActivity');
    }

    function updateOnCreateInMainApplication(fileContent) {
        return fileContent.replace(bbdLifeCycleCall, '');
    }

    function removeImportLineInJavaFile(importLine, fileContent) {
      return fileContent.replace(importLine, '');
    }

    function removeFinalFromRnFlipperClass(rnFlipperFilePath) {
      var rnFlipperFileContent = fs.readFileSync(rnFlipperFilePath, 'utf-8'),
        toRemoveFinalKeywordList = [
        'ReactInstanceManager reactInstanceManager',
        'NetworkFlipperPlugin networkFlipperPlugin'
      ];

      toRemoveFinalKeywordList.forEach(function(entry) {
        var entryWithFinalKeyword = 'final ' + entry;

        if (rnFlipperFileContent.includes(entryWithFinalKeyword)) {
          rnFlipperFileContent = rnFlipperFileContent.replace(entryWithFinalKeyword, entry);
        };
      });

      fs.writeFileSync(rnFlipperFilePath, rnFlipperFileContent, 'utf-8');
    }

    function getPackageNameFromAndroidManifest(pathToAndroidManifest) {
      var androidManifestContent = fs.readFileSync(pathToAndroidManifest, 'utf-8'),
        startIndexOfPackageString = androidManifestContent.indexOf(
          '"', androidManifestContent.indexOf('package=')
        ) + 1,
        endIndexOfPackageString = androidManifestContent.indexOf('"', startIndexOfPackageString);

      return androidManifestContent.substring(startIndexOfPackageString, endIndexOfPackageString);
    }

  } else {
    throw 'Error, there is no android directory in project!'
  }

})();
