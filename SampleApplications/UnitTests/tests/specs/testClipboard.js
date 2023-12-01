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

import Clipboard from 'BlackBerry-Dynamics-for-React-Native-Clipboard';
import {Platform} from 'react-native';

export default function () {
  describe('Clipboard API', () => {
    it('Check Clipboard is available', () => {
      expect(Clipboard).toBeDefined();
    });

    it('Check Clipboard API', () => {
      let isAvailableAllClipboardMethods = true;
      let ClipboardAPI = [];
      const clipboardMethodsMock = [
        'getString',
        'setString',
        'hasString',
        'addListener',
        'removeAllListeners',
        'getStrings', // iOS only
        'setStrings', // iOS only
        'setImage', // iOS only
        'hasImage', // iOS only
        'hasURL', // iOS only
        'hasNumber', // iOS only
        'hasWebURL', // iOS only
        'getImagePNG', // iOS only
        'getImageJPG', // iOS only
        'getImage', // Android only
      ];

      for (const key in Clipboard) {
        ClipboardAPI.push(key);
      }

      for (let i = 0; i < clipboardMethodsMock.length; i++) {
        if (!ClipboardAPI.includes(clipboardMethodsMock[i])) {
          isAvailableAllClipboardMethods = false;
          break;
        }
      }

      expect(isAvailableAllClipboardMethods).toBe(true);
    });

    it('Clipboard: set, get empty value', async () => {
      const testString = '';

      await Clipboard.setString(testString);
      const cliboardValue = await Clipboard.getString();

      expect(cliboardValue).toBe(testString);
    });

    it('Clipboard: set, get value', async () => {
      const testString =
        'some cliboard value with symbols - !@#$%^&*()_+={}: \t \n "some quoted text"';

      await Clipboard.setString(testString);
      const cliboardValue = await Clipboard.getString();

      expect(cliboardValue).toBe(testString);
    });

    it('Clipboard: setString, hasString', async () => {
      const testString = 'some cliboard value';
      await Clipboard.setString(testString);

      let isString = await Clipboard.hasString();
      expect(isString).toBe(true);

      const testNumber = '10';
      await Clipboard.setString(testNumber);

      isString = await Clipboard.hasString();
      expect(isString).toBe(true);

      const testWebUrl = 'http://some.url';
      await Clipboard.setString(testWebUrl);

      isString = await Clipboard.hasString();
      expect(isString).toBe(true);

      const testUrl = 'custom://some.url';
      await Clipboard.setString(testUrl);

      isString = await Clipboard.hasString();
      expect(isString).toBe(true);
    });

    it('Clipboard: addListener, setString, check notification, removeAllListeners', async done => {
      const changeListener = () => {
        Clipboard.removeAllListeners();
        expect(true).toBe(true);
        done();
      };
      Clipboard.addListener(changeListener);

      const testString = 'some cliboard value';
      await Clipboard.setString(testString);
    });

    it('Clipboard: addListener, setString, check notification, listener.remove', async done => {
      let listener;

      const changeListener = () => {
        listener.remove();
        expect(true).toBe(true);
        done();
      };
      listener = Clipboard.addListener(changeListener);

      const testString = 'some cliboard value';
      await Clipboard.setString(testString);
    });

    it('[iOS] Clipboard: setString, getStrings', async () => {
      if (Platform.OS === 'ios') {
        const testString = 'some cliboard value with symbols';

        await Clipboard.setString(testString);
        const cliboardValue = await Clipboard.getStrings();

        expect(cliboardValue.length).toBe(1);
        expect(cliboardValue.includes(testString)).toBe(true);
        expect(cliboardValue[0]).toBe(testString);
      }
    });

    // Issue GD-63333. Disabling TC till same is addressed
    xit('[iOS] Clipboard: setStrings, getString', async () => {
      if (Platform.OS === 'ios') {
        const testString = 'some cliboard value with symbols';
        const testArr = testString.split(' ');

        await Clipboard.setStrings(testArr);
        const cliboardValue = await Clipboard.getString();

        expect(cliboardValue).toEqual(testArr[0]);
      }
    });

    it('[iOS] Clipboard: setStrings, getStrings', async () => {
      if (Platform.OS === 'ios') {
        const testString = 'some cliboard value with symbols';
        const testArr = testString.split(' ');

        await Clipboard.setStrings(testArr);
        const cliboardValue = await Clipboard.getStrings();

        expect(cliboardValue).toEqual(testArr);
      }
    });

    it('[iOS] Clipboard: setImage, hasImage, getImagePNG', async () => {
      if (Platform.OS === 'ios') {
        const base64PlusIcon =
          'iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
        await Clipboard.setImage(base64PlusIcon);

        const isImage = await Clipboard.hasImage();
        expect(isImage).toBe(true);

        const cliboardValue = await Clipboard.getImagePNG();
        expect(cliboardValue.includes('data:image/png;base64,')).toBe(true);
      }
    });

    it('[iOS] Clipboard: setImage, hasImage, getImageJPG', async () => {
      if (Platform.OS === 'ios') {
        const base64PlusIcon =
          'iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
        await Clipboard.setImage(base64PlusIcon);

        const isImage = await Clipboard.hasImage();
        expect(isImage).toBe(true);

        const cliboardValue = await Clipboard.getImageJPG();
        expect(cliboardValue.includes('data:image/jpeg;base64,')).toBe(true);
      }
    });

    it('[iOS] Clipboard: setString, hasURL', async () => {
      if (Platform.OS === 'ios') {
        const testUrlCustom = 'custom://some.url';
        await Clipboard.setString(testUrlCustom);
        let isUrl = await Clipboard.hasURL();
        expect(isUrl).toBe(true);

        const testUrlWs = 'ws://some.url';
        await Clipboard.setString(testUrlWs);
        isUrl = await Clipboard.hasURL();
        expect(isUrl).toBe(true);

        const testUrlWss = 'wss://some.url';
        await Clipboard.setString(testUrlWss);
        isUrl = await Clipboard.hasURL();
        expect(isUrl).toBe(true);
      }
    });
    
    //  Issue GD-63333. Disabling TC till same is addressed
    xit('[iOS] Clipboard: setString, hasNumber', async () => {
      if (Platform.OS === 'ios') {
        const testNumberInt = '10';
        await Clipboard.setString(testNumberInt);
        let isNumber = await Clipboard.hasNumber();
        expect(isNumber).toBe(true);

        const testNumberFloat = '10.0';
        await Clipboard.setString(testNumberFloat);
        isNumber = await Clipboard.hasNumber();
        expect(isNumber).toBe(true);
      }
    });
    
    //  SDK issue GD-63333. Disabling TC till same is addressed
    xit('[iOS] Clipboard: setString, hasWebURL', async () => {
      if (Platform.OS === 'ios') {
        const testWebUrlHttp = 'http://some.url';
        await Clipboard.setString(testWebUrlHttp);
        let isWebUrl = await Clipboard.hasWebURL();
        expect(isWebUrl).toBe(true);

        const testWebUrlHttps = 'https://some.url';
        await Clipboard.setString(testWebUrlHttps);

        isWebUrl = await Clipboard.hasWebURL();
        expect(isWebUrl).toBe(true);
      }
    });

    it('[Android] Clipboard: setString, getImage', async () => {
      if (Platform.OS === 'android') {
        const base64PlusIcon =
          'iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
        await Clipboard.setString(base64PlusIcon);

        const cliboardValue = await Clipboard.getImage();
        expect(cliboardValue).toBe('');
      }
    });
  });
}
