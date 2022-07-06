/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
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
    fse = require('fs-extra'),
    projectRoot = process.env.PROJECT_ROOT || process.env.INIT_CWD,
    androidProjectRoot = path.join(projectRoot, 'android'),
    bbdBasePath = process.cwd(),
    constants = require('./constants');

  if (fs.existsSync(androidProjectRoot)) {
    // Update root build.gradle
    var projectBuildGradle = path.join(androidProjectRoot, 'build.gradle'),
      projectBuildGradleContent = fs.readFileSync(projectBuildGradle, 'utf-8'),
      bbdMavenString = `maven {
          apply from: "$rootDir/../node_modules/BlackBerry-Dynamics-for-React-Native-Base/android/helper.gradle"
          url getBbdMavenLocation
      }
      `;

    // store original top-level build.gradle to recover to original if remove base plugin
    var projectBuildGradleOriginal = path.join(projectRoot, 'node_modules', 'BlackBerry-Dynamics-for-React-Native-Base', 'android', 'build.gradle.original');
    if (!fs.existsSync(projectBuildGradleOriginal)) {
      fs.writeFileSync(projectBuildGradleOriginal, projectBuildGradleContent, 'utf-8');
    }

    if (projectBuildGradleContent.indexOf(bbdMavenString) < 0) {
      projectBuildGradleContent = projectBuildGradleContent
        // For RN versions < 0.67
        .replace('mavenLocal()', bbdMavenString + 'mavenLocal()')
        // For RN versions 0.67.x
        .replace('mavenCentral {', bbdMavenString + 'mavenCentral {')
        .replace(/com.android.tools.build:gradle:[0-9].[0-9].[0-9]/g, 'com.android.tools.build:gradle:4.2.2');
      fs.writeFileSync(projectBuildGradle, projectBuildGradleContent, 'utf-8');
    }

    // Update app/build.gradle
    var projectAppBuildGradle = path.join(androidProjectRoot, 'app', 'build.gradle'),
      projectAppBuildGradleContent = fs.readFileSync(projectAppBuildGradle, 'utf-8'),
      bbdDependenciesString = `apply from: "$rootDir/../node_modules/BlackBerry-Dynamics-for-React-Native-Base/android/gd.gradle"
    implementation fileTree`;

    if (projectAppBuildGradleContent.indexOf(bbdDependenciesString) < 0) {
      projectAppBuildGradleContent = projectAppBuildGradleContent.replace(
        'implementation fileTree', bbdDependenciesString
      );

      fs.writeFileSync(projectAppBuildGradle, projectAppBuildGradleContent, 'utf-8');
    }

    // Read project name and project package name
    var bbdBaseAndroidMainPath = path.join(bbdBasePath, 'android', 'src', 'main'),
      projectAndroidMainPath = path.join(androidProjectRoot, 'app', 'src', 'main'),
      projectAndroidManifestPath = path.join(projectAndroidMainPath, 'AndroidManifest.xml'),
      projectPackageName = getPackageNameFromAndroidManifest(projectAndroidManifestPath),
      resStringsXmlPath = path.join(projectAndroidMainPath, 'res', 'values', 'strings.xml');

    // Update MainActivity and MainApplication, "newarchitecture" classes
    var projectMainClassesPath = path.join(projectAndroidMainPath, 'java', ...projectPackageName.split('.')),
      projectMainActivityPath = path.join(projectMainClassesPath, 'MainActivity.java'),
      projectMainApplicationPath = path.join(projectMainClassesPath, 'MainApplication.java');

    var bbdLifeCycleCall = '\n\t\tBBDLifeCycle.getInstance().initialize(this);\n',
      bbdLifeCycleImport = '\nimport com.blackberry.bbd.reactnative.core.BBDLifeCycle;\n',
      bbdReactActivityDelegateImport = '\nimport com.blackberry.bbd.reactnative.core.BBDReactActivityDelegate;\n',
      bbdReactActivityImport = '\nimport com.blackberry.bbd.reactnative.core.BBDReactActivity;\n';

    var projectMainActivityContent = fs.readFileSync(projectMainActivityPath, 'utf-8'),
      projectMainApplicationContent = fs.readFileSync(projectMainApplicationPath, 'utf-8');

    fs.writeFileSync(
      projectMainActivityPath,
      addImportLineInJavaFile(bbdReactActivityDelegateImport,
        addImportLineInJavaFile(bbdReactActivityImport,
          updateReactActivityUsage(
            updateReactActivityDelegateUsage(
              updateExtendsClassInMainActivity(
                updatePackageNameInJavaFile(projectMainActivityContent, projectPackageName)
              )
            )
          )
        )
      )
    );
    fs.writeFileSync(
      projectMainApplicationPath,
      addImportLineInJavaFile(bbdLifeCycleImport,
        updateOnCreateInMainApplication(
          updatePackageNameInJavaFile(projectMainApplicationContent, projectPackageName)
        )
      )
    );

    // Copy JSON's with settings with updated package name
    var bbdBaseSettingsJsonPath = path.join(bbdBaseAndroidMainPath, 'assets', 'settings.json'),
      projectSettingsJsonPath = path.join(projectAndroidMainPath, 'assets', 'settings.json'),
      settingsJsonObj = JSON.parse(fs.readFileSync(bbdBaseSettingsJsonPath, 'utf-8'));

    settingsJsonObj.GDApplicationID = projectPackageName;

    fse.outputFileSync(projectSettingsJsonPath, JSON.stringify(settingsJsonObj, null, 4), 'utf-8');
    fs.copyFileSync(
      path.join(bbdBaseAndroidMainPath, 'assets', 'com.blackberry.dynamics.settings.json'),
      path.join(projectAndroidMainPath, 'assets', 'com.blackberry.dynamics.settings.json')
    );

    // Add keyword 'final' to inner class variables in ReactNativeFlipper.java
    var androidSrcDebugPath = path.join(androidProjectRoot, 'app', 'src', 'debug', 'java'),
      rnFlipperFileName = 'ReactNativeFlipper.java',
      // Set up the file finder
      finder = require('findit')(androidSrcDebugPath);

    finder.on('file', function(filePath) {
      if (filePath.includes(rnFlipperFileName)) {
        updateRnFlipperClass(filePath);
      }
    });

    function updateExtendsClassInMainActivity(fileContent) {
      return fileContent.replace(/extends ReactActivity/gi, 'extends BBDReactActivity');
    }

    function updateReactActivityDelegateUsage(fileContent) {
      return fileContent.replace(/ ReactActivityDelegate/gi, ' BBDReactActivityDelegate');
    }

    function updateReactActivityUsage(fileContent) {
      var str = 'BBDReactActivity activity';
      if (fileContent && fileContent.indexOf(str) < 0) {
        return fileContent.replace('ReactActivity activity', str);
      }
      return fileContent;
    }

    function updateOnCreateInMainApplication(fileContent) {
      var indexOfOnCreate = fileContent.indexOf('public void onCreate() {'),
        indexOfSuperOnCreateCall = fileContent.indexOf('super.onCreate();', indexOfOnCreate),
        indexOfAfterSuperOnCreateCall = fileContent.indexOf('\n', indexOfSuperOnCreateCall),
        beforeSuperOnCreateCall = fileContent.substr(0, indexOfAfterSuperOnCreateCall + 1),
        afterSuperOnCreateCall = fileContent.substr(indexOfAfterSuperOnCreateCall, fileContent.length);

      if (fileContent.indexOf(bbdLifeCycleCall) >= 0) {
        return fileContent;
      }
      return beforeSuperOnCreateCall + bbdLifeCycleCall + afterSuperOnCreateCall;
    }

    function updatePackageNameInJavaFile(fileContent, updatedPackageName) {
      var startIndexOfPackageName = fileContent.indexOf(' ', fileContent.indexOf('package ')) + 1,
        endIndexOfPackageName = fileContent.indexOf(';', startIndexOfPackageName),
        packageName = fileContent.substring(startIndexOfPackageName, endIndexOfPackageName);

      return fileContent.replace(packageName, updatedPackageName);
    }

    function addImportLineInJavaFile(importLine, fileContent) {
      var indexOfFirstImport = fileContent.indexOf('\nimport '),
        beforeFirstImportPart = fileContent.substr(0, indexOfFirstImport),
        firstImportPartAndRest = fileContent.substr(beforeFirstImportPart.length, fileContent.length);

      if (fileContent.indexOf(importLine) >= 0) {
        return fileContent;
      }
      return beforeFirstImportPart + importLine + firstImportPartAndRest;
    }

    function getPackageNameFromAndroidManifest(pathToAndroidManifest) {
      var androidManifestContent = fs.readFileSync(pathToAndroidManifest, 'utf-8'),
        startIndexOfPackageString = androidManifestContent.indexOf(
          '"', androidManifestContent.indexOf('package=')
        ) + 1,
        endIndexOfPackageString = androidManifestContent.indexOf('"', startIndexOfPackageString);

      return androidManifestContent.substring(startIndexOfPackageString, endIndexOfPackageString);
    }

    function updateRnFlipperClass(rnFlipperFilePath) {
      var rnFlipperFileContent = fs.readFileSync(rnFlipperFilePath, 'utf-8'),
        toAddFinalKeywordList = [
          'ReactInstanceManager reactInstanceManager',
          'NetworkFlipperPlugin networkFlipperPlugin'
        ];

      toAddFinalKeywordList.forEach(function(entry) {
        var entryWithFinalKeyword = 'final ' + entry;

        if (rnFlipperFileContent.includes(entryWithFinalKeyword)) {
          return;
        };

        rnFlipperFileContent = rnFlipperFileContent.replace(entry, entryWithFinalKeyword);
      });

      fs.writeFileSync(rnFlipperFilePath, rnFlipperFileContent, 'utf-8');
    }

  } else {
    throw 'Error, there is no android directory in project!'
  }

})();
