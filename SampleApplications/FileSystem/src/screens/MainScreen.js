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

import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { faPlus, faFolderOpen, faFileAlt, faDownload } from '@fortawesome/free-solid-svg-icons';

import { ScreenContext } from '../../App';
import { NotificationContext } from '../context/NotificationContext';
import { ViewEditFileScreen } from './ViewEditFileScreen';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { Header } from '../components/Header';
import { FolderListItem } from '../components/FolderListItem';
import { FileListItem } from '../components/FileListItem';
import { BackListItem } from '../components/BackListItem';
import { CreateTxtFile } from '../components/modal/CreateTxtFile';
import { colorScheme } from '../theme';
import { CreateFolderModal } from '../components/modal/CreateFolderModal';
import { ApplicationContext } from '../context/ApplicationContext';
import { DownloadFileModal } from '../components/modal/DownloadFileModal';
import { NoEntries } from '../components/NoEntries';

import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';

export const MainScreen = () => {
  const { storage } = useContext(ApplicationContext);
  const { screen } = useContext(ScreenContext);
  const { notification } = useContext(NotificationContext);

  const [modal, setModal] = useState(null);

  const loadFSEntries = async (dir) => {
    try {
      const entries = await FS.readDir(dir);

      const normalized = entries.map(entry => ({
        name: entry.name,
        size: entry.size,
        type: entry.isDirectory() ? 'folder' : 'file',
        path: entry.path,
      }));

      const back = {
        name: '...',
        type: 'back',
        path: dir,
      }

      const directoryEntries = dir === storage.rootPath ? normalized : [back, ...normalized];
      storage.currentPath = dir;

      storage.entries = directoryEntries;
    } catch (error) {
      notification.emmit('alert', error.message)
    }
  };

  useEffect(() => {
    loadFSEntries(storage.currentPath);
  }, []);

  const openFile = fileEntry => {
    screen.push(<ViewEditFileScreen source={fileEntry} />)
  };

  const fsEntries = storage.entries.map((item, idx) => {
    let component = null;
    switch (item.type) {
      case 'folder':
        component = (
          <FolderListItem
            key={idx}
            {...item}
            onPress={() => { loadFSEntries(item.path) }}
            onReload={() => { loadFSEntries(storage.currentPath) }}
          />
        );
        break;
      case 'file':
        component = (
          <FileListItem
            key={idx}
            {...item}
            onPress={() => { openFile(item) }}
            onReload={() => { loadFSEntries(storage.currentPath) }}
          />
        );
        break;
      case 'back':
        component = (
          <BackListItem
            key={idx}
            onPress={() => {
              const arr = storage.currentPath.split('/')
              arr.pop();
              const newPath = arr.join('/');
              loadFSEntries(newPath)
            }}
          />
        );
        break;
      default:
        break;
    }

    return component;
  });

  const createFolderModal = (
    <CreateFolderModal
      path={storage.currentPath}
      visible={true}
      onSubmit={() => {
        loadFSEntries(storage.currentPath);
        setModal(null)
      }}
      onDismiss={() => setModal(null)}
    />
  );

  const createFileModal = (
    <CreateTxtFile
      visible={true}
      onSubmit={() => {
        loadFSEntries(storage.currentPath);
        setModal(null);
      }}
      onDismiss={() => setModal(null)}
    />
  );

  const downloadFileModal = (
    <DownloadFileModal
      visible={true}
      onDownloadEnd={() => {
        loadFSEntries(storage.currentPath);
        notification.emmit('success', 'File is downloaded!');
      }}
      onSubmit={() => setModal(null)}
      onDismiss={() => setModal(null)}
    />
  );

  return (
    <>
      <View style={styles.main}>
        <Header title="File System" />
        <View style={styles.content}>
          {storage.entries.length > 0 ?
            (<ScrollView>
              {fsEntries}
            </ScrollView>)
            : <NoEntries />}
          <FloatingActionButton
            icon={faPlus}
            actions={[
              {
                title: "New Folder",
                iconSource: faFolderOpen,
                onPress: () => setModal(createFolderModal)
              },
              {
                title: "New File",
                iconSource: faFileAlt,
                onPress: () => setModal(createFileModal)
              },
              {
                title: "Download File",
                iconSource: faDownload,
                onPress: () => setModal(downloadFileModal)
              },
            ]} />
        </View>
        {modal}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
    backgroundColor: colorScheme.primary,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
