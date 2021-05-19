/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

import React, { createContext, useState } from 'react';
import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';

export const ApplicationContext = createContext();

export const ApplicationProvider = ({children}) => {
  const [root, setRoot] = useState(FS.DocumentDirectoryPath);
  const [currentPath, setCurrentPath] = useState(root);
  const [modal, setModal] = useState(null);
  const [entries, setEntries] = useState([]);

  const storage = {
    get currentPath() {
      return currentPath;
    },
    set currentPath(path) {
      setCurrentPath(path);
    },
    get rootPath() {
      return root;
    },
    get entries() {
      return entries;
    },
    set entries(entries) {
      setEntries(entries)
    },
    reload() {},
  };

  const bottomSheet = {
    show(modal) {
      setModal(modal);
    },
    hide() {
      setModal(null);
    }
  };

  return (
    <ApplicationContext.Provider value={{
      storage, bottomSheet
    }}>
      {children}
      {modal}
    </ApplicationContext.Provider>
  );
}
