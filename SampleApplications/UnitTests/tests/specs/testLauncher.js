/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

import Launcher from 'BlackBerry-Dynamics-for-React-Native-Launcher';

export default function() {
  describe('Launcher API', function() {

    it('Check Launcher is available', function() {
      expect(Launcher).toBeDefined();
    });

    it("Check Launcher API", function() {
      let isAvailableAllLauncherMethods = true;
      const launcherMethodsMock = [
        'show',
        'hide'
      ];

      const LauncherAPI = Object.getOwnPropertyNames(Launcher.constructor.prototype)
        .filter(key => key !== 'constructor');


      for (let i = 0; i < launcherMethodsMock.length; i++) {
        if (!LauncherAPI.includes(launcherMethodsMock[i])) {
          isAvailableAllLauncherMethods = false;
          break;
        }
      }

      expect(isAvailableAllLauncherMethods).toBe(true);
    });

    it('Launcher: hide - check warnings / errors', async function() {
      spyOn(console, 'warn');
      spyOn(console, 'error');

      await Launcher.hide();

      expect(console.warn).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('Launcher: hide - check return value', async function() {
      const result = await Launcher.hide();

      expect(result == null).toBe(true);
    });

    it('Launcher: show - check warnings / errors', async function() {
      spyOn(console, 'warn');
      spyOn(console, 'error');

      await Launcher.show();

      expect(console.warn).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('Launcher: show - check return value', async function() {
      const result = await Launcher.show();

      expect(result == null).toBe(true);
    });

  });
}
