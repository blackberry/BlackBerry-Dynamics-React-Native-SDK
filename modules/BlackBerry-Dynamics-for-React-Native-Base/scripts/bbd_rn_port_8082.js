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

{
    const fs = require('fs'),
        path = require('path'),
        projectRoot = process.env.PWD || process.env.INIT_CWD,
        appName = require(path.join(projectRoot, 'app.json')).name,
        appDelegateM = path.join(projectRoot, 'ios', appName, 'AppDelegate.m');

    const filesWith8082port = [
        path.join(projectRoot, 'node_modules', 'react-native', 'React', 'Base', 'RCTDefines.h'),
        path.join(projectRoot, 'node_modules', 'react-native', 'React', 'DevSupport', 'RCTInspectorDevServerHelper.mm'),
        path.join(projectRoot, 'node_modules', 'react-native', 'React', 'CoreModules', 'RCTDevMenu.mm'),
        path.join(projectRoot, 'ios', appName + '.xcodeproj', 'project.pbxproj')
    ];

    filesWith8082port.forEach((file, index) => {
        let fileContent = fs.readFileSync(file, 'utf-8');

        fs.writeFileSync(file, fileContent.replace(/8081/g, '8082'), 'utf-8');
    });

    let appDelegateContent = fs.readFileSync(appDelegateM, 'utf-8');
    fs.writeFileSync(appDelegateM, appDelegateContent.replace('InitializeFlipper(application);', '//InitializeFlipper(application);'), 'utf-8');
}
