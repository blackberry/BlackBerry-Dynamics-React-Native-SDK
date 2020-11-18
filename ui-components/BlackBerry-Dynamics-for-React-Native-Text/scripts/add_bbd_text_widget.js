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

(function() {
  var fs = require('fs'),
    path = require('path'),
    projectRoot = process.env.INIT_CWD,
    bbdTextWidgetName = 'AndroidTextBbd',
    bbdVirtualTextWidgetName = 'AndroidVirtualTextBbd',
    rn61RendererImplementationsPath = path.join(projectRoot, 'node_modules', 'react-native', 'Libraries', 'Renderer', 'implementations'),
    rn61RendererDevArr = [
      path.join(rn61RendererImplementationsPath, 'ReactFabric-dev.fb.js'),
      path.join(rn61RendererImplementationsPath, 'ReactFabric-dev.js'),
      path.join(rn61RendererImplementationsPath, 'ReactNativeRenderer-dev.fb.js'),
      path.join(rn61RendererImplementationsPath, 'ReactNativeRenderer-dev.js')
    ],
    rn61RendererOtherArr = [
      path.join(rn61RendererImplementationsPath, 'ReactFabric-prod.fb.js'),
      path.join(rn61RendererImplementationsPath, 'ReactFabric-prod.js'),
      path.join(rn61RendererImplementationsPath, 'ReactFabric-profiling.fb.js'),
      path.join(rn61RendererImplementationsPath, 'ReactFabric-profiling.js'),
      path.join(rn61RendererImplementationsPath, 'ReactNativeRenderer-prod.fb.js'),
      path.join(rn61RendererImplementationsPath, 'ReactNativeRenderer-prod.js'),
      path.join(rn61RendererImplementationsPath, 'ReactNativeRenderer-profiling.fb.js'),
      path.join(rn61RendererImplementationsPath, 'ReactNativeRenderer-profiling.js')
    ];


  // To enable DLP within <Text \> UI component we need to extend default list of native views
  // with following views: AndroidTextBbd, AndroidVirtualTextBbd.
  // node_modules/react-native/Libraries/Renderer/implementations/* manages default native views for RN 0.61.x and higher

  if (fs.existsSync(rn61RendererImplementationsPath)) {
    rn61RendererDevArr.forEach(function(filePath) {
      var bbdTextWidgetCode = 'type === "' + bbdTextWidgetName + '" || // Android\n\t\t',
        bbdVirtualTextWidgetCode = 'type === "' + bbdVirtualTextWidgetName + '" || // Android\n\t\t';

      addBbdTextWidget(
        filePath,
        bbdTextWidgetCode + bbdVirtualTextWidgetCode,
        'type === "AndroidTextInput" || // Android'
      );
    });

    rn61RendererOtherArr.forEach(function(filePath) {
      var bbdTextWidgetCode = '"' + bbdTextWidgetName + '" === nextContext ||\n\t\t',
        bbdVirtualTextWidgetCode = '"' + bbdVirtualTextWidgetName + '" === nextContext ||\n\t\t';

      addBbdTextWidget(
        filePath,
        bbdTextWidgetCode + bbdVirtualTextWidgetCode,
        '"AndroidTextInput" === nextContext ||'
      );
    });
  }

  function addBbdTextWidget (filePath, widget, insertBefore) {
    var fileContent = fs.readFileSync(filePath, 'utf-8');

    if (fileContent.indexOf(bbdTextWidgetName) >= 0) {return;}

    fileContent = fileContent.replace(insertBefore, widget + insertBefore);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
  }

})();
