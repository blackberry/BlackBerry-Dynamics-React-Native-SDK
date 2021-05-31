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

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {
  BottomArea,
  BottomTabBar,
  FullWidthButton,
  Header,
  ListItem,
  NamedArea,
  Selector,
  TabButton,
  AngleRightButton,
} from '../components';
import {faFolder, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {useNavigation, useNotification} from '../context/ApplicationContext';
import {ShowContentScreen} from './ShowContentScreen';
import {theme} from '../static';

import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';
import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';
import {TRANSFER_FILE_SERVICE} from '../static';

export const HomeScreen = () => {
  const nav = useNavigation();
  const notification = useNotification();
  const [files, setFiles] = useState([]);
  const [providers, setProviders] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [method, setMethod] = useState('sendFileToApp');
  const [sendMethods, setSetMethods] = useState([
    {
      name: 'callAppKineticsService',
      active: false,
    },
    {
      name: 'sendFileToApp',
      active: false,
    },
  ]);

  useEffect(() => {
    const getProviders = async () => {
      try {
        const result = await BbdAppKinetics.getServiceProvidersFor(
          TRANSFER_FILE_SERVICE.ID,
          TRANSFER_FILE_SERVICE.VERSION,
        );
        setProviders(result);
      } catch (error) {
        notification.emmit('alert', error.message);
      }
    };

    const getFiles = async () => {
      try {
        const root = FS.DocumentDirectoryPath;
        const dataFolder = `${root}/data`;
        const files = [
          ...(await FS.readDir(dataFolder)),
          ...(await FS.readDir(root)),
        ]
          .filter((item) => item.isFile())
          .map(({name, path}) => ({
            relativePath: path.replace(root, ''),
            path,
            name,
            checked: false,
          }));

        setFiles(files);
      } catch (error) {
        notification.emmit('alert', error.message);
      }
    };

    getProviders();
    setTimeout(getFiles, 100);
  }, []);

  const sendFileToApp = async () => {
    try {
      if (!receiver) {
        throw new Error('Please select receiver.');
      }
      const result = await BbdAppKinetics.sendFileToApp(
        receiver.address,
        getSelectedFilePath(),
      );
      notification.emmit('success', result);
    } catch (error) {
      notification.emmit('alert', error.message);
    }
  };

  const callAppKineticsService = async () => {
    try {
      if (!receiver) {
        throw new Error('Please select receiver.');
      }
      const result = await BbdAppKinetics.callAppKineticsService(
        receiver.address,
        TRANSFER_FILE_SERVICE.ID,
        TRANSFER_FILE_SERVICE.VERSION,
        TRANSFER_FILE_SERVICE.METHOD,
        {},
        [getSelectedFilePath()],
      );
      notification.emmit('success', result);
    } catch (error) {
      notification.emmit('alert', error.message);
    }
  };

  const getSelectedFilePath = () => {
    try {
      const {path} = files.filter((file) => file.checked === true)[0];
      return path;
    } catch (error) {
      throw new Error('Please choose file.');
    }
  };

  const sendFileAction = async () => {
    switch (method) {
      case 'sendFileToApp':
        sendFileToApp();
        break;
      case 'callAppKineticsService':
        callAppKineticsService();
        break;
      default:
        break;
    }
  };

  const selectMethod = (methodName) => {
    const changeItems = ({name}) => ({
      name,
      active: methodName === name,
    });

    setMethod(methodName);
    setSetMethods(sendMethods.map(changeItems));
  };

  const attachments = files.map((file, idx) => (
    <ListItem
      key={idx}
      title={file.relativePath}
      trailing={
        <AngleRightButton
          onPress={async () => {
            try {
              const fileContent = await FS.readFile(file.path);
              nav.push(
                <ShowContentScreen title={file.name} content={fileContent} />,
              );
            } catch (error) {
              nav.push(
                <ShowContentScreen
                  title={file.name}
                  content="Content of the file is not supported"
                  textAlign="center"
                />,
              );
            }
          }}
        />
      }
      active={file.checked}
      onPress={() => {
        const newFiles = [...files].map((file) => {
          file.checked = false;
          return file;
        });
        newFiles[idx].checked = true;
        setFiles(newFiles);
      }}
    />
  ));

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView style={styles.scrollableArea}>
        <Header title="Send File" />
        <NamedArea name="Select receiver">
          {providers.length > 0 ? (
            <Selector
              items={providers}
              onSelect={(service) => setReceiver(service)}
            />
          ) : (
            <Text>Providers for service not found</Text>
          )}
        </NamedArea>
        <NamedArea name="Choose file">{attachments}</NamedArea>
        <NamedArea name="Choose method">
          {sendMethods.map(({name, active}) => (
            <ListItem
              key={name}
              title={name}
              active={active}
              onPress={() => selectMethod(name)}
            />
          ))}
        </NamedArea>
      </ScrollView>
      <BottomArea>
        <View style={styles.buttonRow}>
          <FullWidthButton title="Send" onPress={sendFileAction} />
        </View>
        <BottomTabBar>
          <TabButton active icon={faFolder} title="Send file" />
          <TabButton
            icon={faPaperPlane}
            title="Send email"
            onPress={() => nav.push('sendEmail')}
          />
        </BottomTabBar>
      </BottomArea>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  scrollableArea: {
    flex: 1,
    paddingHorizontal: theme.screenPadding,
    paddingTop: 15,
  },
  buttonRow: {
    marginVertical: 10,
  },
});
