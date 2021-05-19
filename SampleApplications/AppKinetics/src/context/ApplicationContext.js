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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { ShowContentScreen } from '../screens/ShowContentScreen';
import { faCheckCircle, faExclamationCircle, faComment } from '@fortawesome/free-solid-svg-icons'
import { ToastMessage } from '../components/ToastMessage';
import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';
import { SAVE_FILE_SERVICE, TRANSFER_FILE_SERVICE } from '../static';

const eventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeBbdAppKinetics
);

let receiveFileSubscription;
let receiveMessageSubscription;
let receiveErrorSubscription;

export const ApplicationContext = createContext();

export const useNavigation = () => {
  const { screen } = useContext(ApplicationContext);
  return screen;
}

export const useNotification = () => {
  const { notification } = useContext(ApplicationContext);
  return notification;
}

export const ApplicationProvider = ({ screens, initScreen }) => {
  const [_screen, setScreen] = useState([initScreen]);
  const [_notification, setNotification] = useState(null);

  useEffect(() => {
    BbdAppKinetics
      .copyFilesToSecureStorage()
      .catch(error => notification.emmit('alert', `copyFilesToSecureStorage error result: ${error.message}`));

    BbdAppKinetics
      .readyToProvideService(TRANSFER_FILE_SERVICE.ID, TRANSFER_FILE_SERVICE.VERSION)
      .catch(error => notification.emmit('alert', `readyToProvideService error result: ${error.message}`));

    // add subscriptions for AppKinetics
    receiveFileSubscription = eventEmitter.addListener(
      'onReceivedFile',
      onReceivedFileEventHandler
    );
    receiveMessageSubscription = eventEmitter.addListener(
      'onReceivedMessage',
      onReceivedMessageEventHandler
    );
    receiveErrorSubscription = eventEmitter.addListener(
      'onError',
      onReceivedErrorEventHandler
    );

    return () => {
      receiveFileSubscription.remove();
      receiveMessageSubscription.remove();
      receiveErrorSubscription.remove();
    };
  }, []);

  const onReceivedFileEventHandler = async (path) => {
    try {
      const onlyTXTFormatRegExp = /(.)\.txt/;
      const screenProps = {
        name: path.split('/').pop(),
        title: `File ${path.split('/').pop()} is received`,
        content: 'Content of the file is not supported',
        textAlign: 'center',
      };

      if(onlyTXTFormatRegExp.test(screenProps.name)) {
        screenProps.content = await FS.readFile(path);
        screenProps.textAlign = 'left';
      }

      await moveReceivedFileToDocuments(path);

      screen.push(<ShowContentScreen {...screenProps} />);
    } catch (error) {
      notification.emmit('alert', error.message);
    }
  };

  const onReceivedMessageEventHandler = async (message) => {
    const { method, attachments, serviceName } = message;
    if(
      serviceName === SAVE_FILE_SERVICE.ID &&
      method === SAVE_FILE_SERVICE.METHOD
    ) {
      try {
        const path = attachments[0];
        const onlyTXTFormatRegExp = /(.)\.txt/;
        const screenProps = {
          name: path.split('/').pop(),
          title: `File ${path.split('/').pop()} is received`,
          content: 'Content of the file is not supported',
          textAlign: 'center',
        };

        if(onlyTXTFormatRegExp.test(screenProps.name)) {
          screenProps.content = await FS.readFile(path);
          screenProps.textAlign = 'left';
        }

        await moveReceivedFileToDocuments(path);

        screen.push(<ShowContentScreen {...screenProps} />);
      } catch (error) {
        notification.emmit('alert', error.message);
      }
    }
  };

  const onReceivedErrorEventHandler = (message) => {
    notification.emmit('alert', message);
  };

  const moveReceivedFileToDocuments = async (path) => {
    try {
      const name = path.split('/').pop();
      const destinationPath = `${FS.DocumentDirectoryPath}/${name}`;

      if(await FS.exists(destinationPath)) {
        await FS.unlink(destinationPath);
      }

      await FS.moveFile(path, destinationPath);
    } catch (error) {
      notification.emmit('alert', error.message);
    }
  };

  const screen = {
    push: (scr) => {
      if(typeof scr === 'string') {
        setScreen([..._screen, screens[scr]]);
        return;
      }
      setScreen([..._screen, scr]);
    },
    pop: () => {
      const scrs = [..._screen];
      scrs.pop();
      setScreen([...scrs]);
    }
  };

  const notification = {
    emmit: (type, message) => {
      const toast = {
        icon: faComment,
        color: '#ccc',
        message,
        onDismiss: () => setNotification(null)
      };

      switch(type) {
        case 'alert':
          toast.icon = faExclamationCircle;
          toast.color = 'red';
          break;
        case 'success':
          toast.icon = faCheckCircle;
          toast.color = 'green';
          break;
        default:
          break;
      }

      setNotification(<ToastMessage {...toast} />);
    }
  };

  return (
    <ApplicationContext.Provider value={{
      notification, screen
    }}>
      {_screen[_screen.length - 1]}
      {_notification}
    </ApplicationContext.Provider>
  );
}
