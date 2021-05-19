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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { CustomButton } from '../CustomButton';
import { colorScheme } from '../../theme';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faFileAlt, faFolder } from '@fortawesome/free-solid-svg-icons';

import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';

export const MoveFileModal = ({file, onSuccess, onError, onDismiss}) => {
  const [root, setRoot] = useState(FS.DocumentDirectoryPath);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    loadFSContent();
  }, [root]);

  const loadFSContent = async () => {
    try {
      const content = await FS.readDir(root);
      let dirs = content.filter(item => item.isDirectory());

      dirs = dirs.map(dir => ({
        title: dir.name,
        path: dir.path,
        type: 'dir',
        onPress: () => setRoot(dir.path)
      }));

      if (root !== FS.DocumentDirectoryPath) {
        dirs = [
          {
            type: 'back',
            onPress: () => {
              const currentFolder = root.lastPathComponent();
              setRoot(root.replace('/' + currentFolder, ''));
            }
          },
          ...dirs
        ];
      }

      if (dirs.length) {
        dirs = [...dirs, {type: 'info'}];
      }

      setFolders(dirs);
    } catch (error) {
      onDismiss();
      onError(error.message);
    }
  };

  const renderFolderItems = () => folders.map((item, idx) => {
    switch(item.type) {
      case 'dir':
        return <FolderItemView key={idx} {...item} />;
      case 'back':
        return <FolderItemBackView key={idx} {...item} />;
      case 'info':
        return <FolderMoveInstructionView key={idx} path={root.replace(FS.DocumentDirectoryPath, '') || '/'} />;
      default:
        return <View />
    }
  });

  const move = async () => {
    try {
      await FS.moveFile(file.path, `${root}/${file.name}`);
      onSuccess();
    } catch (error) {
      onError(error.message);
    } finally {
      onDismiss();
    }
  };

  return (
    <BottomSheet visible={true}>
      <BottomSheet.Body>
        <View style={styles.bodyContainer}>
          <View style={styles.headerItem}>
            <FontAwesomeIcon
              icon={faFileAlt}
              style={styles.headerItemIcon}
              size={28}
            />
            <Text style={styles.headerItemTitle}>{file.name}</Text>
          </View>
          <View style={styles.locationContainer}>
            <View style={styles.flex}>
              <Text style={styles.textBold}>Location: </Text>
              <Text>{root.replace(FS.DocumentDirectoryPath, '') || '/'}</Text>
            </View>
          </View>
          <View style={styles.foldersList}>
            <ScrollView>
              {folders.length ? renderFolderItems() : (<FolderMoveInstructionView />)}
            </ScrollView>
          </View>
          <View>
            <CustomButton
              title="Move"
              onPress={move}
            />
            <View style={{height: 10}} />
            <CustomButton
              color={colorScheme.red}
              title="Cancel"
              onPress={onDismiss}
            />
          </View>
        </View>
      </BottomSheet.Body>
    </BottomSheet>
  );
};

const FolderItemView = ({title, onPress}) => (
  <TouchableOpacity
    style={styles.folderItemView}
    onPress={onPress}
  >
    <View style={styles.flex}>
      <FontAwesomeIcon icon={faFolder} size={19} />
      <Text style={styles.folderItemViewText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const FolderItemBackView = ({onPress}) => (
  <TouchableOpacity
    style={styles.folderItemView}
    onPress={onPress}
  >
    <View style={styles.flex}>
      <FontAwesomeIcon icon={faAngleLeft} size={19} />
      <Text style={styles.folderItemViewText}>back</Text>
    </View>
  </TouchableOpacity>
);

const FolderMoveInstructionView = ({path}) => (
  <Text style={styles.folderMoveInstruction}>
    Press "Move" button to move file to
    <Text style={styles.textBold}> "{path}" </Text>
    or press "Cancel" to discard changes.
  </Text>
);

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBold: {
    fontWeight: '800',
  },
  bodyContainer: {
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  headerItemIcon: {
    marginRight: 10,
  },
  headerItemTitle: {
    fontSize: 17,
  },
  locationContainer: {
    marginTop: 12,
  },
  foldersList: {
    marginVertical: 10,
    flexGrow: 1,
  },
  folderItemView: {
    borderBottomWidth: 1,
    borderBottomColor: colorScheme.lightGray,
    paddingVertical: 9,
    paddingHorizontal: 5,
    marginVertical: 2,
  },
  folderMoveInstruction: {
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    lineHeight: 22,
    padding: 15,
    color: colorScheme.placeholderTextColor,
  },
  folderItemViewText: {
    marginLeft: 10,
  }
});
