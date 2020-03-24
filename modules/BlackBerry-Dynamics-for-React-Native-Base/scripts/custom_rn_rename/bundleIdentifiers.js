/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original react-native-rename
 * from https://github.com/junedomingo/react-native-rename/
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundleIdentifiers = bundleIdentifiers;
// nS - No Space
// lC - Lowercase

function bundleIdentifiers(currentAppName, newName, projectName, currentBundleID, newBundleID, newBundlePath) {
  var nS_CurrentAppName = currentAppName.replace(/\s/g, '');
  var listOfRegExpReplacements = [{
    regex: currentBundleID,
    replacement: newBundleID,
    paths: ['android/app/BUCK', 'android/app/build.gradle', 'android/app/src/main/AndroidManifest.xml']
  }, {
    regex: new RegExp('^package[ \t]+' + currentBundleID, 'm'),
    replacement: 'package ' + newBundleID,
    paths: [newBundlePath + '/MainActivity.java', newBundlePath + '/MainApplication.java']
  }];

  if (newName) {
    var nS_NewName = newName.replace(/\s/g, '');
    var newNameRegExpReplacement = {
      // App name (probably) doesn't start with `.`, but the bundle ID will
      // include the `.`. This fixes a possible issue where the bundle ID
      // also contains the app name and prevents it from being inappropriately
      // replaced by an update to the app name with the same bundle ID
      regex: new RegExp('(?!\\.)(.|^)' + nS_CurrentAppName, 'g'),
      replacement: '$1' + nS_NewName,
      paths: [newBundlePath + '/MainActivity.java']
    };
    listOfRegExpReplacements.push(newNameRegExpReplacement);
  }

  return listOfRegExpReplacements;
}
