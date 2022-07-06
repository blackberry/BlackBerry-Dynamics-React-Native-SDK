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
 * 
 * @flow strict-local
 */

'use strict';

import { NativeModules } from 'react-native';

const { BbdRNApplication } = NativeModules;

type ApplicationConfig = {
  appHost?: ?string,
  appPort?: ?number,
  appServers?: ?Array<{
    port: ?number,
    priority: ?number,
    server: ?string
  }>,
  communicationProtocols?: ?{[key: string]: boolean},
  containerId?: ?string,
  copyPasteOn?: ?boolean,
  detailedLogsOn?: ?boolean,
  enterpriseId?: ?string,
  enterpriseIdActivated?: ?boolean,
  enterpriseIdFeatures?: ?Array<string>,
  extraInfo?: ?{[key: string]: string},
  keyboardRestrictedMode?: ?boolean,
  preventAndroidDictation?: ?boolean,
  preventDictation?: ?boolean,
  preventKeyboardExtensions?: ?boolean,
  preventPasteFromNonGDApps?: ?boolean,
  preventScreenCapture?: ?boolean,
  preventUserDetailedLogs?: ?boolean,
  preventCustomKeyboards?: ?boolean,
  preventScreenRecording?: ?boolean,
  protectedByPassword?: ?boolean,
  upn?: ?string,
  userId?: ?string
};

class Application {
  constructor() { }

  getApplicationConfig(): Promise<ApplicationConfig> {
    return BbdRNApplication.getApplicationConfig();
  }

  getApplicationPolicy(): Promise<{[key: string]: any}> {
    return BbdRNApplication.getApplicationPolicy();
  }

}

export default new Application();
