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
 
import Clipboard from 'BlackBerry-Dynamics-for-React-Native-Clipboard';

export default function() {
  describe('Clipboard API', function() {

    it('Check Clipboard is available', function() {
      expect(Clipboard).toBeDefined();
    });

    it("Check Clipboard API", function() {
      let isAvailableAllClipboardMethods = true;
      let ClipboardAPI = [];
      const clipboardMethodsMock = [
        'getString',
        'setString'
      ];

      for (key in Clipboard) {
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

    it('Clipboard: set, get empty value', async function() {
      const testString = '';

      await Clipboard.setString(testString);
      const cliboardValue = await Clipboard.getString();

      expect(cliboardValue).toBe(testString);
    });

    it('Clipboard: set, get value', async function() {
      const testString = 'some cliboard value with symbols - !@#$%^&*()_+={}: \t \n "some quoted text"';

      await Clipboard.setString(testString);
      const cliboardValue = await Clipboard.getString();

      expect(cliboardValue).toBe(testString);
    });

  });
}
