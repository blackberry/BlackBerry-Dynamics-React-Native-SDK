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

import AppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';

import { NativeModules, Platform } from 'react-native';

const { ReactNativeBbdAppKinetics } = NativeModules;

export default function() {
  describe('AppKinetics API', function() {
    let isBBWorkInstalled;

    // DEVNOTE: we need to check if BBWork is installed to be able to run dependent sendEmailViaBBWork cases
    beforeAll(async function() {
      try {
        const bbWorkApplicationId = 'com.good.gcs';
        const sendMailServiceProviders = await AppKinetics.getServiceProvidersFor('com.good.gfeservice.send-email', '1.0.0.0');

        isBBWorkInstalled = sendMailServiceProviders.filter(serviceProvider => 
          serviceProvider.applicationId === bbWorkApplicationId ||
          serviceProvider.address === bbWorkApplicationId
        ).length > 0;

        if (isBBWorkInstalled) {
          console.warn(`Note: AppKinetics API: some sendEmailViaBBWork test cases were disabled!
BBWork should be uninstalled to make them enabled.`);
        }
      } catch (error) {
        console.log('Error in checking whether BBWork is installed: ', error);
      }
    });

    it('Check AppKinetics is available', function() {
      expect(AppKinetics).toBeDefined();
    });

    it('Check AppKinetics API is available', function() {
      let isAvailableAllAppKineticsMethods = true;
      const appKineticsMethodsMock = [
        'copyFilesToSecureStorage',
        'getServiceProvidersFor',
        'callAppKineticsService',
        'readyToProvideService',
        'sendFileToApp',
        'sendEmailViaBBWork',
        'bringAppToFront'
      ];

      const AppKineticsMethods = Object.getOwnPropertyNames(AppKinetics.constructor.prototype)
        .filter(key => key !== 'constructor');

      for (let i = 0; i < appKineticsMethodsMock.length; i++) {
        if (!AppKineticsMethods.includes(appKineticsMethodsMock[i])) {
          isAvailableAllAppKineticsMethods = false;
          break;
        }
      }

      expect(isAvailableAllAppKineticsMethods).toBe(true);
      expect(AppKineticsMethods.length).toBe(appKineticsMethodsMock.length);
    });

    it('AppKinetics: copyFilesToSecureStorage', async function() {
      const exceptedResultObjectKeys = ['copiedInThisCall', 'securedDataDirEntries'];
      const result = await AppKinetics.copyFilesToSecureStorage();

      expect(result).toBeDefined();
      expect(result.copiedInThisCall).toBeDefined();
      expect(Array.isArray(result.copiedInThisCall)).toBe(true);
      expect(result.securedDataDirEntries).toBeDefined();
      expect(Array.isArray(result.securedDataDirEntries)).toBe(true);
      expect(exceptedResultObjectKeys.length).toBe(Object.getOwnPropertyNames(result).length);
    });

    it('AppKinetics: bringAppToFront - not available applicationId', async function() {
      const applicationId = 'com.not.existing.test.app';
      
      try {
        const result = await AppKinetics.bringAppToFront(applicationId);
        expect('bringAppToFront should fail with not existing app').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Requested application not found');
      }
    });

    it('AppKinetics: bringAppToFront - empty applicationId', async function() {
      const applicationId = '';
      
      try {
        const result = await AppKinetics.bringAppToFront(applicationId);
        expect('bringAppToFront should fail with not existing app').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Requested application not found');
      }
    });

    it('AppKinetics: bringAppToFront - required paramether applicationId = undefined', async function() {
      try {
        const result = await AppKinetics.bringAppToFront();
        expect('bringAppToFront should fail without required paramethers').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    it('AppKinetics: getServiceProvidersFor - not available service', async function() {
      const result = await AppKinetics.getServiceProvidersFor('com.good.gd', '1.0.0.0');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // DEVNOTE: no sense to check Array items, as we don't know what apps are installed when tests are running
    });

    it('AppKinetics: getServiceProvidersFor - empty parameters', async function() {
      const result = await AppKinetics.getServiceProvidersFor('', '');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('AppKinetics: getServiceProvidersFor - required paramether serviceId = null', async function() {
      try {
        const result = await AppKinetics.getServiceProvidersFor(null, '1.0.0.0');
        expect('getServiceProvidersFor should fail without required paramethers').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    it('AppKinetics: getServiceProvidersFor - required paramether version = undefined', async function() {
      try {
        const result = await AppKinetics.getServiceProvidersFor('com.good.gd');
        expect('getServiceProvidersFor should fail without required paramethers').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    it('AppKinetics: callAppKineticsService - not available applicationId, not existing file', async function() {
      const applicationId = 'com.not.existing.test.app';
      const serviceId = 'com.good.gdservice.transfer-file';
      const serviceVersion = '2.0.0.0';
      const serviceMethod = 'transferFile';
      const parameters = {};
      const attachments = ['/data/not_existing.txt'];

      try {
        const result = await AppKinetics.callAppKineticsService(
          applicationId,
          serviceId,
          serviceVersion,
          serviceMethod,
          parameters,
          attachments
        );

        expect('callAppKineticsService should fail with following parameters').toBe(true);
      } catch (error) {
        expect(error.message).toBe(`File does not exist at path "${attachments[0]}"`);
      }
    });

    it('AppKinetics: callAppKineticsService - all parameters, attachments with empty string', async function() {
      const applicationId = 'com.not.existing.test.app';
      const serviceId = 'com.good.gdservice.transfer-file';
      const serviceVersion = '1.0.0.0';
      const serviceMethod = 'transferFile';
      const parameters = { 'param1': 'value1' };
      const attachments = [''];

      try {
        const result = await AppKinetics.callAppKineticsService(
          applicationId,
          serviceId,
          serviceVersion,
          serviceMethod,
          parameters,
          attachments
        );

        expect('callAppKineticsService should fail with following parameters').toBe(true);
      } catch (error) {
        expect(error.message).toBe(`File does not exist at path "${attachments[0]}"`);
      }
    });

    it('AppKinetics: callAppKineticsService - required parameters', async function() {
      const applicationId = 'com.not.existing.test.app';
      const serviceId = 'good.service';
      const serviceVersion = '1.0.0.0';
      const serviceMethod = 'someMethod';

      try {
        const result = await AppKinetics.callAppKineticsService(
          applicationId,
          serviceId,
          serviceVersion,
          serviceMethod
        );
        expect('callAppKineticsService should fail with following parameters').toBe(true);

      } catch (error) {
        expect(error.message).toBe('Requested application not found');
      }
    });

    it('AppKinetics: callAppKineticsService - required paramether applicationId = null', async function() {
      const applicationId = null;
      const serviceId = 'com.good.gdservice.transfer-file';
      const serviceVersion = '2.0.0.0';
      const serviceMethod = 'transferFile';

      try {
        const result = await AppKinetics.callAppKineticsService(
          applicationId,
          serviceId,
          serviceVersion,
          serviceMethod
        );

        expect('callAppKineticsService should fail without required parameter').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    it('AppKinetics: callAppKineticsService - required paramether serviceMethod = undefined', async function() {
      const applicationId = 'com.not.existing.test.app';
      const serviceId = 'com.good.gdservice.transfer-file';
      const serviceVersion = '2.0.0.0';

      try {
        const result = await AppKinetics.callAppKineticsService(
          applicationId,
          serviceId,
          serviceVersion
        );

        expect('callAppKineticsService should fail without required parameter').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    it('AppKinetics: sendFileToApp - not available applicationId, not existing file', async function() {
      const applicationId = 'com.not.existing.test.app';
      const filePath = '/data/not_existing.txt';

      try {
        const result = await AppKinetics.sendFileToApp(applicationId, filePath);
        expect('sendFileToApp with not existing file should fail').toBe(true);
      } catch (error) {
        expect(error.message).toBe(`File does not exist at path "${filePath}"`);
      }
    });

    it('AppKinetics: sendFileToApp - required paramether applicationId = null', async function() {
      const applicationId = null;
      const filePath = '/data/not_existing.txt';

      try {
        const result = await AppKinetics.sendFileToApp(applicationId, filePath);
        expect('sendFileToApp with not existing file should fail').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    it('AppKinetics: sendFileToApp - required paramether filePath = undefined', async function() {
      const applicationId = 'com.not.existing.test.app';

      try {
        const result = await AppKinetics.sendFileToApp(applicationId);
        expect('sendFileToApp should fail without required parameter').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    it('AppKinetics: sendEmailViaBBWork - all parameters, not existing file', async function() {
      const toRecipients = ['to1@good.com'];
      const ccRecipients = ['cc1@good.com', 'cc2@good.com'];
      const bccRecipients = ['bcc1@good.com'];
      const subject = 'Test sendEmailViaBBWork';
      const body = 'Some test text!';
      const attachments = ['/path/to/attachment.txt'];

      try {
        const result = await AppKinetics.sendEmailViaBBWork(
          toRecipients,
          ccRecipients,
          bccRecipients,
          subject,
          body,
          attachments
        );

        expect('sendEmailViaBBWork with following parameters should fail').toBe(true);
      } catch (error) {
        expect(error.message).toBe(`File does not exist at path "${attachments[0]}"`);
      }
    });

    it('AppKinetics: sendEmailViaBBWork - one parameter', async function() {
      if (isBBWorkInstalled) return;

      const toRecipients = ['to1@good.com'];
      try {
        const result = await AppKinetics.sendEmailViaBBWork(toRecipients);
        expect('sendEmailViaBBWork with following parameters should fail').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Requested application not found');
      }
    });

    it('AppKinetics: sendEmailViaBBWork - no parameters', async function() {
      if (isBBWorkInstalled) return;

      try {
        const result = await AppKinetics.sendEmailViaBBWork();
        expect('sendEmailViaBBWork with following parameters should fail').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Requested application not found');
      }
    });

    it('AppKinetics: sendEmailViaBBWork - different parameters: with use "null", "undefined", empty values', async function() {
      if (isBBWorkInstalled) return;

      const toRecipients = ['to1@good.com'];
      const ccRecipients = null;
      const bccRecipients = [];
      const subject = 'Test sendEmailViaBBWork';
      const body = 'Some test text!';

      try {
        const result = await AppKinetics.sendEmailViaBBWork(
          toRecipients,
          ccRecipients,
          bccRecipients,
          subject,
          body
        );

        expect('sendEmailViaBBWork with following parameters should fail').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Requested application not found');
      }
    });

    it('AppKinetics: readyToProvideService - valid parameters', async function() {
      const serviceId = 'com.good.service';
      const serviceVersion = '1.0.0.0';
      const expectedResultMessage = `Providing service "${serviceId}" with version "${serviceVersion}"`

      const result = await AppKinetics.readyToProvideService(serviceId, serviceVersion);
      expect(result).toBe(expectedResultMessage);
    });

    it('AppKinetics: readyToProvideService - empty parameters', async function() {
      const serviceId = '';
      const serviceVersion = '';
      const expectedResultMessage = `Providing service "${serviceId}" with version "${serviceVersion}"`

      const result = await AppKinetics.readyToProvideService(serviceId, serviceVersion);
      expect(result).toBe(expectedResultMessage);
    });

    it('AppKinetics: readyToProvideService - required paramether serviceId = null', async function() {
      const serviceId = null;
      const serviceVersion = '1.0.0.0';

      try {
        const result = await AppKinetics.readyToProvideService(serviceId, serviceVersion);
        expect('readyToProvideService should fail without required parameter').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    it('AppKinetics: readyToProvideService - required paramether serviceVersion = undefined', async function() {
      const serviceId = 'com.good.service';

      try {
        const result = await AppKinetics.readyToProvideService(serviceId);
        expect('readyToProvideService should fail without required parameter').toBe(true);
      } catch (error) {
        expect(error.message).toBe('Required parameters are missing!');
      }
    });

    describe('AppKinetics: check native methods arguments', function() {
      it('AppKinetics: copyFilesToSecureStorage', async function() {
        spyOn(ReactNativeBbdAppKinetics, 'copyFilesToSecureFilesystem');
        const result = await AppKinetics.copyFilesToSecureStorage();

        expect(ReactNativeBbdAppKinetics.copyFilesToSecureFilesystem).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.copyFilesToSecureFilesystem).toHaveBeenCalledWith();
      });

      it('AppKinetics: bringAppToFront', async function() {
        const applicationId = 'com.not.existing.test.app';

        spyOn(ReactNativeBbdAppKinetics, 'bringAppToFront');
        const result = await AppKinetics.bringAppToFront(applicationId);

        expect(ReactNativeBbdAppKinetics.bringAppToFront).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.bringAppToFront).toHaveBeenCalledWith({ applicationId });
      });

      it('AppKinetics: getServiceProvidersFor', async function() {
        const serviceId = 'com.good.gdservice';
        const serviceVersion = '1.0.0.0';
        const expectedNativeMethodArgs = { serviceId, version: serviceVersion };

        spyOn(ReactNativeBbdAppKinetics, 'getServiceProvidersFor');
        const result = await AppKinetics.getServiceProvidersFor(serviceId, serviceVersion);

        expect(ReactNativeBbdAppKinetics.getServiceProvidersFor).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.getServiceProvidersFor).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: callAppKineticsService - all parameters', async function() {
        const applicationId = 'com.not.existing.test.app';
        const serviceId = 'com.good.gdservice.transfer-file';
        const serviceVersion = '2.0.0.0';
        const serviceMethod = 'transferFile';
        const parameters = { 'param1': 'value1' };
        const attachments = ['/data/not_existing.txt'];

        spyOn(ReactNativeBbdAppKinetics, 'callAppKineticsService');
        const result = await AppKinetics.callAppKineticsService(
          applicationId,
          serviceId,
          serviceVersion,
          serviceMethod,
          parameters,
          attachments
        );

        const expectedNativeMethodArgs = {
          applicationId,
          serviceId,
          version: serviceVersion,
          method: serviceMethod,
          parameters,
          attachments
        };

        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: callAppKineticsService - required parameters', async function() {
        const applicationId = 'com.not.existing.test.app';
        const serviceId = 'com.good.gdservice.transfer-file';
        const serviceVersion = '2.0.0.0';
        const serviceMethod = 'transferFile';

        spyOn(ReactNativeBbdAppKinetics, 'callAppKineticsService');
        const result = await AppKinetics.callAppKineticsService(
          applicationId,
          serviceId,
          serviceVersion,
          serviceMethod
        );

        const expectedNativeMethodArgs = {
          applicationId,
          serviceId,
          version: serviceVersion,
          method: serviceMethod,
          parameters: {},
          attachments: []
        };

        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: callAppKineticsService - all parameters: "parameters": undefined, "attachments": null', async function() {
        const applicationId = 'com.not.existing.test.app';
        const serviceId = 'com.good.gdservice.transfer-file';
        const serviceVersion = '2.0.0.0';
        const serviceMethod = 'transferFile';
        const parameters = undefined
        const attachments = null;
        const expectedNativeMethodArgs = {
          applicationId,
          serviceId,
          version: serviceVersion,
          method: serviceMethod,
          parameters: {},
          attachments: []
        };

        spyOn(ReactNativeBbdAppKinetics, 'callAppKineticsService');
        const result = await AppKinetics.callAppKineticsService(
          applicationId,
          serviceId,
          serviceVersion,
          serviceMethod,
          parameters,
          attachments
        );

        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: sendFileToApp - all parameters', async function() {
        const applicationId = 'com.not.existing.test.app';
        const filePath = '/data/not_existing_file.txt';

        spyOn(ReactNativeBbdAppKinetics, 'callAppKineticsService');
        const result = await AppKinetics.sendFileToApp(applicationId, filePath);

        const expectedNativeMethodArgs = {
          applicationId,
          serviceId: 'com.good.gdservice.transfer-file',
          version: '1.0.0.0',
          method: 'transferFile',
          parameters: {},
          attachments: [filePath]
        };

        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: sendEmailViaBBWork - all parameters', async function() {
        if (isBBWorkInstalled) return;

        const toRecipients = ['to1@good.com'];
        const ccRecipients = ['cc1@good.com', 'cc2@good.com'];
        const bccRecipients = [''];
        const subject = 'Test sendEmailViaBBWork';
        const body = 'Some test text!';
        const attachments = ['/path/to/attachment.txt'];

        spyOn(ReactNativeBbdAppKinetics, 'callAppKineticsService');
        const result = await AppKinetics.sendEmailViaBBWork(
          toRecipients,
          ccRecipients,
          bccRecipients,
          subject,
          body,
          attachments
        );

        const expectedNativeMethodArgs = {
          applicationId: Platform.OS === 'ios' ? 'com.good.gcs.g3' : 'com.good.gcs',
          serviceId: 'com.good.gfeservice.send-email',
          version: '1.0.0.0',
          method: 'sendEmail',
          parameters: {
            to: toRecipients,
            cc: ccRecipients,
            bcc: bccRecipients,
            subject,
            body
          },
          attachments: attachments
        };

        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: sendEmailViaBBWork - one parameter', async function() {
        if (isBBWorkInstalled) return;

        const toRecipients = ['to1@good.com'];

        spyOn(ReactNativeBbdAppKinetics, 'callAppKineticsService');
        const result = await AppKinetics.sendEmailViaBBWork(toRecipients);

        const expectedNativeMethodArgs = {
          applicationId: Platform.OS === 'ios' ? 'com.good.gcs.g3' : 'com.good.gcs',
          serviceId: 'com.good.gfeservice.send-email',
          version: '1.0.0.0',
          method: 'sendEmail',
          parameters: {
            to: toRecipients,
            cc: [],
            bcc: [],
            subject: '',
            body: ''
          },
          attachments: []
        };

        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: sendEmailViaBBWork - different parameters: with use "null", "undefined", empty values', async function() {
        if (isBBWorkInstalled) return;

        const toRecipients = ['to1@good.com'];
        const ccRecipients = [];
        const bccRecipients = null;
        const subject = undefined;
        const body = 'Some test text!';

        spyOn(ReactNativeBbdAppKinetics, 'callAppKineticsService');
        const result = await AppKinetics.sendEmailViaBBWork(
          toRecipients,
          ccRecipients,
          bccRecipients,
          subject,
          body
        );

        const expectedNativeMethodArgs = {
          applicationId: Platform.OS === 'ios' ? 'com.good.gcs.g3' : 'com.good.gcs',
          serviceId: 'com.good.gfeservice.send-email',
          version: '1.0.0.0',
          method: 'sendEmail',
          parameters: {
            to: toRecipients,
            cc: ccRecipients,
            bcc: [],
            subject: '',
            body
          },
          attachments: []
        };

        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: sendEmailViaBBWork - no parameters', async function() {
        if (isBBWorkInstalled) return;

        spyOn(ReactNativeBbdAppKinetics, 'callAppKineticsService');
        const result = await AppKinetics.sendEmailViaBBWork();

        const expectedNativeMethodArgs = {
          applicationId: Platform.OS === 'ios' ? 'com.good.gcs.g3' : 'com.good.gcs',
          serviceId: 'com.good.gfeservice.send-email',
          version: '1.0.0.0',
          method: 'sendEmail',
          parameters: {
            to: [],
            cc: [],
            bcc: [],
            subject: '',
            body: ''
          },
          attachments: []
        };

        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.callAppKineticsService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

      it('AppKinetics: readyToProvideService', async function() {
        const serviceId = 'com.good.gdservice.transfer-file';
        const serviceVersion = '1.0.0.0';
        const expectedNativeMethodArgs = { serviceId, version: serviceVersion };

        spyOn(ReactNativeBbdAppKinetics, 'readyToProvideService');
        const result = await AppKinetics.readyToProvideService(serviceId, serviceVersion);

        expect(ReactNativeBbdAppKinetics.readyToProvideService).toHaveBeenCalledTimes(1);
        expect(ReactNativeBbdAppKinetics.readyToProvideService).toHaveBeenCalledWith(expectedNativeMethodArgs);
      });

    });

    // DEVNOTE: to run this section, create 'testFile.txt' inside 'android/app/src/main/assets/data' directory for Android
    // describe('AppKinetics: check with existing file', function() {
    //   it('AppKinetics: callAppKineticsService - existing file', async function() {
    //     const applicationId = 'com.not.existing.test.app';
    //     const serviceId = 'com.good.gdservice';
    //     const serviceVersion = '2.0.0.0';
    //     const serviceMethod = 'testMethod';
    //     const parameters = {};
    //     const attachments = ['/data/testFile.txt'];

    //     try {
    //       const result = await AppKinetics.callAppKineticsService(
    //         applicationId,
    //         serviceId,
    //         serviceVersion,
    //         serviceMethod,
    //         parameters,
    //         attachments
    //       );

    //       expect('callAppKineticsService should fail with following parameters').toBe(true);
    //     } catch (error) {
    //       expect(error.message).toBe('Requested application not found');
    //     }
    //   });

    //   it('AppKinetics: callAppKineticsService - multiple files: one not existing file', async function() {
    //     const applicationId = 'com.not.existing.test.app';
    //     const serviceId = 'com.good.gdservice';
    //     const serviceVersion = '2.0.0.0';
    //     const serviceMethod = 'testMethod';
    //     const parameters = {};
    //     const attachments = ['/data/not_existing.txt', '/data/testFile.txt'];

    //     try {
    //       const result = await AppKinetics.callAppKineticsService(
    //         applicationId,
    //         serviceId,
    //         serviceVersion,
    //         serviceMethod,
    //         parameters,
    //         attachments
    //       );

    //       expect('callAppKineticsService should fail with following parameters').toBe(true);
    //     } catch (error) {
    //       expect(error.message).toBe(`File does not exist at path "${attachments[0]}"`);
    //     }
    //   });

    //   it('AppKinetics: sendFileToApp - not available applicationId, existing file', async function() {
    //     const applicationId = 'com.not.existing.test.app';
    //     const filePath = '/data/testFile.txt';

    //     try {
    //       const result = await AppKinetics.sendFileToApp(applicationId, filePath);
    //       expect('sendFileToApp to not available applicationId should fail').toBe(true);
    //     } catch (error) {
    //       expect(error.message).toBe('Requested application not found');
    //     }
    //   });

    //   it('AppKinetics: sendFileToApp - empty applicationId, existing file', async function() {
    //     const applicationId = '';
    //     const filePath = '/data/testFile.txt';

    //     try {
    //       const result = await AppKinetics.sendFileToApp(applicationId, filePath);
    //       expect('sendFileToApp with not existing applicationId should fail').toBe(true);
    //     } catch (error) {
    //       expect(error.message).toBe('Requested application not found');
    //     }
    //   });

    //   it('AppKinetics: sendEmailViaBBWork - all parameters, existing file', async function() {
    //     if (isBBWorkInstalled) return;

    //     const toRecipients = ['to1@good.com'];
    //     const ccRecipients = ['cc1@good.com', 'cc2@good.com'];
    //     const bccRecipients = [];
    //     const subject = 'Test sendEmailViaBBWork';
    //     const body = 'Some test text!';
    //     const attachments = ['/data/testFile.txt'];

    //     try {
    //       const result = await AppKinetics.sendEmailViaBBWork(
    //         toRecipients,
    //         ccRecipients,
    //         bccRecipients,
    //         subject,
    //         body,
    //         attachments
    //       );

    //       expect(result).toBe('');
    //     } catch (error) {
    //       expect(error.message).toBe('Requested application not found');
    //     }
    //   });

    // });

  });
}
