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

import BbdApplication from 'BlackBerry-Dynamics-for-React-Native-Application';

import { NativeEventEmitter, NativeModules } from 'react-native';

const { BbdRNApplication } = NativeModules;
const eventEmitter = new NativeEventEmitter(BbdRNApplication);

export default function() {
  describe('BbdApplication API', function() {

    it('Check BbdApplication is available', function() {
      expect(BbdApplication).toBeDefined();
    });

    describe('BbdApplication basic functionality', function() {
      let onAppConfigUpdateListener;
      let onAppPolicyUpdateListener;
      let onPolicyErrorListener;

      beforeAll(function() {
        onAppConfigUpdateListener = eventEmitter.addListener('onAppConfigUpdate', applicationConfig => { });
        onAppPolicyUpdateListener = eventEmitter.addListener('onAppPolicyUpdate', applicationConfig => { });
        onPolicyErrorListener = eventEmitter.addListener('onError', onError => { });
      });

      afterAll(function() {
        onAppConfigUpdateListener.remove();
        onAppPolicyUpdateListener.remove();
        onPolicyErrorListener.remove();
      });

      it("Check BbdApplication API", function() {
        let isAvailableAllApplicationMethods = true;
        const applicationMethodsMock = [
          'getApplicationConfig',
          'getApplicationPolicy'
        ];

        const ApplicationAPI = Object.getOwnPropertyNames(BbdApplication.constructor.prototype)
          .filter(key => key !== 'constructor');

        for (let i = 0; i < applicationMethodsMock.length; i++) {
          if (!ApplicationAPI.includes(applicationMethodsMock[i])) {
            isAvailableAllApplicationMethods = false;
            break;
          }
        }

        expect(isAvailableAllApplicationMethods).toBe(true);
      });

      it('BbdApplication: getApplicationConfig - check reponse JSON is not empty', async function() {
        const applicationConfig = await BbdApplication.getApplicationConfig();

        expect(applicationConfig).toBeDefined();
        expect(typeof applicationConfig).toBe('object');
        expect(Object.keys(applicationConfig).length).toBeGreaterThan(0);
      });

      it('BbdApplication: getApplicationConfig - check reponse JSON structure', async function() {
        const expectedResponseObjTypes = {
          appHost: 'string',
          appPort: 'number',
          appServers: 'array',
          communicationProtocols: 'object',
          containerId: 'string',
          copyPasteOn: 'boolean',
          detailedLogsOn: 'boolean',
          enterpriseId: 'string',
          enterpriseIdActivated: 'boolean',
          enterpriseIdFeatures: 'array',
          extraInfo: 'object',
          keyboardRestrictedMode: 'boolean',
          preventAndroidDictation: 'boolean',
          preventDictation: 'boolean',
          preventKeyboardExtensions: 'boolean',
          preventPasteFromNonGDApps: 'boolean',
          preventCustomKeyboards: 'boolean',
          preventScreenCapture: 'boolean',
          preventScreenRecording: 'boolean',
          preventUserDetailedLogs: 'boolean',
          protectedByPassword: 'boolean',
          upn: 'string',
          userId: 'string'
        };
        let isExpectedValueTypes = true;

        const applicationConfig = await BbdApplication.getApplicationConfig();

        expect(applicationConfig).toBeDefined();
        expect(typeof applicationConfig).toBe('object');

        const responseKeys = Object.keys(applicationConfig);

        for (const key of responseKeys) {
          const currentItemType = expectedResponseObjTypes[key];
          if (currentItemType && (typeof applicationConfig[key] !== currentItemType)) {
            if (!(currentItemType === 'array' && Array.isArray(applicationConfig[key]))) {
              isExpectedValueTypes = false;
              break;
            }
          }
        }

        expect(isExpectedValueTypes).toBe(true);
      });

      it('BbdApplication: getApplicationPolicy - check reponse is not empty', async function() {
        const applicationPolicy = await BbdApplication.getApplicationPolicy();

        expect(applicationPolicy).toBeDefined();
        expect(typeof applicationPolicy).toBe('object');
      });

    });

  });
}
