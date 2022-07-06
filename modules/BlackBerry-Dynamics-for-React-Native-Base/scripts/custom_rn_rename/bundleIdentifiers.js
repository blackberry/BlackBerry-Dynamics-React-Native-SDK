/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original react-native-rename
 * from https://github.com/junedomingo/react-native-rename/
 */

'use strict';

var path = require('path');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundleIdentifiers = bundleIdentifiers;
// nS - No Space
// lC - Lowercase

function bundleIdentifiers(currentAppName, newName, projectName, currentBundleID, newBundleID, newBundlePath) {
  var nS_CurrentAppName = currentAppName.replace(/\s/g, '');
  var newArchitecturePath = path.join(newBundlePath, 'newarchitecture');
  var listOfRegExpReplacements = [{
    regex: new RegExp(currentBundleID, 'g'),
    replacement: newBundleID,
    paths: [
      path.join('android', 'app', 'BUCK'),
      path.join('android', 'app', 'build.gradle'),
      path.join('android', 'app', 'src', 'main', 'AndroidManifest.xml'),
      path.join(newBundlePath, 'MainApplication.java')
    ]
  }, {
    regex: new RegExp('^(package|import)[ \t]+' + currentBundleID, 'gm'),
    replacement: '$1 ' + newBundleID,
    paths: [
      path.join(newBundlePath, 'MainActivity.java'),
      path.join(newArchitecturePath, 'MainApplicationReactNativeHost.java'),
      path.join(newArchitecturePath, 'components', 'MainComponentsRegistry.java'),
      path.join(newArchitecturePath, 'modules', 'MainApplicationTurboModuleManagerDelegate.java')
    ]
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
      paths: [path.join(newBundlePath, 'MainActivity.java')]
    };
    listOfRegExpReplacements.push(newNameRegExpReplacement);
  }

  return listOfRegExpReplacements;
}
