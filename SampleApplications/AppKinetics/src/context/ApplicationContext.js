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

import React from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { ShowContentScreen } from '../screens/ShowContentScreen';
import {
  faCheckCircle,
  faExclamationCircle,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { ToastMessage } from '../components/ToastMessage';
import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';
import { SAVE_FILE_SERVICE, TRANSFER_FILE_SERVICE } from '../static';

import { ApplicationContext } from './context';

const eventEmitter = new NativeEventEmitter(
  NativeModules.ReactNativeBbdAppKinetics,
);

class ApplicationProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: null,
      screen: [this.props.initScreen],
    };

    this.screen = {
      push: (scr) => {
        if (typeof scr === 'string') {
          this.setState({
            screen: [...this.state.screen, this.props.screens[scr]],
          });
          return;
        }
        this.setState({screen: [...this.state.screen, scr]});
      },
      pop: () => {
        const scrs = [...this.state.screen];
        scrs.pop();
        this.setState({screen: [...scrs]});
      },
    };

    this.notification = {
      emmit: (type, message) => {
        const toast = {
          icon: faComment,
          color: '#ccc',
          message,
          onDismiss: () => this.setState({notification: null}),
        };

        switch (type) {
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

        this.setState({notification: <ToastMessage {...toast} />});
      },
    };

    this.receiveFileSubscription = eventEmitter.addListener(
      'onReceivedFile',
      this.onReceivedFileEventHandler,
    );
    this.receiveMessageSubscription = eventEmitter.addListener(
      'onReceivedMessage',
      this.onReceivedMessageEventHandler,
    );
    this.receiveErrorSubscription = eventEmitter.addListener(
      'onError',
      this.onReceivedErrorEventHandler,
    );
  }

  async componentDidMount() {
    try {
      const result = await BbdAppKinetics.copyFilesToSecureStorage();
      console.log('Copy files to secure storage result: ', JSON.stringify(result));
      await BbdAppKinetics.readyToProvideService(
        TRANSFER_FILE_SERVICE.ID,
        TRANSFER_FILE_SERVICE.VERSION,
      );
    } catch (error) {
      this.notification.emmit('alert', error.message);
    }
  }

  componentWillUnmount() {
    this.receiveFileSubscription.remove();
    this.receiveMessageSubscription.remove();
    this.receiveErrorSubscription.remove();
  }

  onReceivedFileEventHandler = async (path) => {
    try {
      const onlyTXTFormatRegExp = /(.)\.txt/;
      const screenProps = {
        name: path.split('/').pop(),
        title: `File ${path.split('/').pop()} is received`,
        content: 'Content of the file is not supported',
        textAlign: 'center',
      };

      if (onlyTXTFormatRegExp.test(screenProps.name)) {
        screenProps.content = await FS.readFile(path);
        screenProps.textAlign = 'left';
      }

      await this.moveReceivedFileToDocuments(path);

      this.screen.push(<ShowContentScreen {...screenProps} />);
    } catch (error) {
      this.notification.emmit('alert', error.message);
    }
  };

  onReceivedMessageEventHandler = async (message) => {
    const {method, attachments, serviceName} = message;
    if (
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

        if (onlyTXTFormatRegExp.test(screenProps.name)) {
          screenProps.content = await FS.readFile(path);
          screenProps.textAlign = 'left';
        }

        await this.moveReceivedFileToDocuments(path);

        this.screen.push(<ShowContentScreen {...screenProps} />);
      } catch (error) {
        this.notification.emmit('alert', error.message);
      }
    }
  };

  onReceivedErrorEventHandler = (message) => {
    this.notification.emmit('alert', message);
  };

  async moveReceivedFileToDocuments(path) {
    try {
      const name = path.split('/').pop();
      const destinationPath = `${FS.DocumentDirectoryPath}/${name}`;

      if (await FS.exists(destinationPath)) {
        await FS.unlink(destinationPath);
      }

      await FS.moveFile(path, destinationPath);
    } catch (error) {
      this.notification.emmit('alert', error.message);
    }
  }

  render() {
    return (
      <ApplicationContext.Provider
        value={{
          notification: this.notification,
          screen: this.screen,
        }}>
        {this.state.screen[this.state.screen.length - 1]}
        {this.state.notification}
      </ApplicationContext.Provider>
    );
  }
}

export { ApplicationProvider };
