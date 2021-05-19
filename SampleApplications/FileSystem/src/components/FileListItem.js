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

import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faCopy, faUpload, faFileAlt, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { colorScheme } from '../theme';
import { MoreButton } from './MoreButton';
import { ApplicationContext } from '../context/ApplicationContext';
import { IconButton } from './IconButton';
import { NotificationContext } from '../context/NotificationContext';
import { UploadFileModal } from './modal/UploadFileModal';
import { MoveFileModal } from './modal/MoveFileModal';

import FileSystemService from '../services/file-system.service';
import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';

const iconSize = 22;

export const FileListItem = ({name, path, size, onPress, onReload}) => {
  const [showSubItems, setShowSubItems] = useState(false);

  const { storage, bottomSheet } = useContext(ApplicationContext);
  const { notification } = useContext(NotificationContext);

  const removeItem = async () => {
    setShowSubItems(!showSubItems);
    try {
      await FileSystemService.delete(path);
      onReload();
    } catch (error) {
      notification.emmit('alert', error.message);
    }
  };

  const copyItem = async () => {
    setShowSubItems(!showSubItems);
    try {
      let fileName = path.lastPathComponent();
      let { name, extension } = fileName.exposeNameAndExtension();

      name = `${name}-copy.${extension}`;
      let destination = `${storage.currentPath}/${name}`;

      await FS.copyFile(path, destination);
      onReload();
    } catch (error) {
      notification.emmit('alert', error.message);
    }
  };

  const uploadItem = async () => {
    setShowSubItems(!showSubItems);
    try {
      let fileName = path.lastPathComponent();
      let {name} = fileName.exposeNameAndExtension();
      let type = 'text/plain'; // there is no API to get file's mime type: https://github.com/itinance/react-native-fs/issues/910
      bottomSheet.show(
        <UploadFileModal
          file={{
            name,
            filename: fileName,
            filepath: path,
            filetype: type
          }}
          onDismiss={() => {bottomSheet.hide()}}
        />
      );
    } catch (error) {
      notification.emmit('alert', error.message);
    }
  };

  const moveItem = () => {
    const file = {
      name,
      path
    };

    bottomSheet.show(
      <MoveFileModal
        file={file}
        onSuccess={() => {
          onReload();
          notification.emmit('success', `File "${name}" moved.`);
        }}
        onError={(message) => notification.emmit('alert', message)}
        onDismiss={() => {bottomSheet.hide()}}
      />
    );
  };

  return (
    <TouchableHighlight
      style={styles.listItem}
      activeOpacity={0.9}
      underlayColor={colorScheme.primaryLightAlfa}
      onPress={onPress}>
      <View style={styles.flexContainer} >
        <FontAwesomeIcon style={styles.image} icon={faFileAlt} size={iconSize} />
        <View style={styles.fileDetails}>
          <Text style={styles.fileDetailsName}>{name}</Text>
          <Text style={styles.shortInfo}>{size}</Text>
        </View>
        {showSubItems && (
          <View style={styles.subItemContainer}>
            <IconButton icon={faCopy} size={iconSize} onPress={copyItem} />
            <IconButton icon={faFileImport} size={iconSize} onPress={moveItem} />
            <IconButton icon={faUpload} size={iconSize} onPress={uploadItem} />
            <IconButton icon={faTrashAlt} size={iconSize} onPress={removeItem} />
          </View>
        )}
        <MoreButton onPress={() => setShowSubItems(!showSubItems)} />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center'
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 20,
  },
  shortInfo: {
    fontSize: 11,
    color: '#ccc',
  },
  subItemContainer: {
    flexDirection: 'row',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileDetails: {
    flexDirection: 'column',
    flex: 2,
  },
  fileDetailsName: {
    color: '#2d2d2d',
  },
});
