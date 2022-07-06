/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import { screens } from './src/context/ScreenContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ApplicationProvider } from './src/context/ApplicationContext';
import { ScreenContext } from './src/context/context';

const App = () => {
  const [_screen, setScreen] = useState([screens.main]);

  const screen = {
    push: (scr) => setScreen([..._screen, scr]),
    pop: () => {
      const scrs = [..._screen];
      scrs.pop();
      setScreen([...scrs]);
    }
  }

  return (
    <ApplicationProvider>
      <ScreenContext.Provider value={{setScreen, screen}}>
        <NotificationProvider>
          {_screen[_screen.length - 1]}
        </NotificationProvider>
      </ScreenContext.Provider>
    </ApplicationProvider>
  );
};

export default App;
