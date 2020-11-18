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
 * 
 * @flow strict-local
 */

'use strict';

import { NativeModules, Platform } from 'react-native';

const { ReactNativeBbdAppKinetics } = NativeModules;

class AppKinetics {
  // Service "Transfer File"
  FILE_TRANSFER_SERVICE_ID = 'com.good.gdservice.transfer-file';
  FILE_TRANSFER_SERVICE_VERSION = '1.0.0.0';
  FILE_TRANSFER_SERVICE_METHOD = 'transferFile';
  // Service "Send Email"
  SEND_EMAIL_SERVICE_ID = 'com.good.gfeservice.send-email';
  SEND_EMAIL_SERVICE_VERSION = '1.0.0.0';
  SEND_EMAIL_SERVICE_METHOD = 'sendEmail';

  copyFilesToSecureStorage(): Promise<{
    copiedInThisCall: Array<string>,
    securedDataDirEntries: Array<string>
  }> {
    return ReactNativeBbdAppKinetics.copyFilesToSecureFilesystem();
  }

  bringAppToFront(applicationId: string): Promise<string> {
    if (applicationId == null) {
      throw new Error('Required parameters are missing!');
    }

    return ReactNativeBbdAppKinetics.bringAppToFront({applicationId});
  }

  getServiceProvidersFor(serviceId: string, version: string): Promise<Array<{
    address: string,
    applicationId: string,
    name: string,
    version: string
  }>> {
    if (serviceId == null || version == null) {
      throw new Error('Required parameters are missing!');
    }

    return ReactNativeBbdAppKinetics.getServiceProvidersFor({ serviceId, version });
  }

  callAppKineticsService(
    applicationId: string,
    serviceId: string,
    version: string,
    method: string,
    parameters?: {},
    attachments?: Array<string>
  ): Promise<string> {
    if (applicationId == null || serviceId == null || version == null || method == null) {
      throw new Error('Required parameters are missing!');
    }

    const params = {
      applicationId: applicationId,
      serviceId,
      version,
      method,
      parameters: parameters || {},
      attachments: attachments || []
    };

    return ReactNativeBbdAppKinetics.callAppKineticsService(params);
  }

  readyToProvideService(serviceId: string, version: string): Promise<string> {
    if (serviceId == null || version == null) {
      throw new Error('Required parameters are missing!');
    }

    return ReactNativeBbdAppKinetics.readyToProvideService({ serviceId, version });
  }

  sendFileToApp(applicationId: string, filePath: string): Promise<string> {
    if (applicationId == null || filePath == null) {
      throw new Error('Required parameters are missing!');
    }

    const params = {
      applicationId,
      serviceId: this.FILE_TRANSFER_SERVICE_ID,
      version: this.FILE_TRANSFER_SERVICE_VERSION,
      method: this.FILE_TRANSFER_SERVICE_METHOD,
      parameters: {},
      attachments: [filePath]
    };

    return ReactNativeBbdAppKinetics.callAppKineticsService(params);
  }

  sendEmailViaBBWork(
    toRecipients?: Array<string>,
    ccRecipients?: Array<string>,
    bccRecipients?: Array<string>,
    subject?: string,
    body?: string,
    attachments?: Array<string>
  ): Promise<string> {

    const params = {
      applicationId: Platform.OS === 'ios' ? 'com.good.gcs.g3' : 'com.good.gcs',
      serviceId: this.SEND_EMAIL_SERVICE_ID,
      version: this.SEND_EMAIL_SERVICE_VERSION,
      method: this.SEND_EMAIL_SERVICE_METHOD,
      parameters: {
        to: toRecipients || [],
        cc: ccRecipients || [],
        bcc: bccRecipients || [],
        subject: subject || '',
        body: body || ''
      },
      attachments: attachments || []
    };

    return ReactNativeBbdAppKinetics.callAppKineticsService(params);
  }

}

export default new AppKinetics();
