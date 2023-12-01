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
  var fs = require('fs'),
    path = require('path'),
    projectRoot = process.env.INIT_CWD;

    // Read react-native template AndroidManifest.xml
    var projectTemplatePath = path.join(projectRoot, 'node_modules', 'react-native', 'template'),
      projectTemplateAndroidMainPath = path.join(projectTemplatePath, 'android', 'app', 'src', 'main'),
      projectTemplateAndroidManifest = path.join(projectTemplateAndroidMainPath, 'AndroidManifest.xml');

    if (fs.existsSync(projectTemplateAndroidManifest)) {
      // Read react-native template AndroidManifest.xml
      var androidManifestContent = fs.readFileSync(projectTemplateAndroidManifest, 'utf-8');
      if (androidManifestContent.indexOf('android.permission.READ_EXTERNAL_STORAGE') < 0) {

        var permissionStrings = `<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name=`;

        // Add "android.permission.READ_EXTERNAL_STORAGE"
        androidManifestContent = androidManifestContent.replace('<uses-permission android:name=', permissionStrings);
        fs.writeFileSync(projectTemplateAndroidManifest, androidManifestContent, 'utf-8');
      }
    }

})();
