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
import { faTrashAlt, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { colorScheme } from '../theme';
import { MoreButton } from './MoreButton';
import { IconButton } from './IconButton';
import { NotificationContext } from '../context/NotificationContext';

import FileSystemService from '../services/file-system.service';

const iconSize = 22;

export const FolderListItem = ({name, path, size, onPress, onReload}) => {
  const [showSubItems, setShowSubItems] = useState(false);

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

  return (
    <TouchableHighlight
      style={styles.listItem}
      activeOpacity={0.9}
      underlayColor={colorScheme.primaryLightAlfa}
      onPress={onPress}>
      <View style={styles.flexContainer} >
        <FontAwesomeIcon style={styles.image} icon={faFolderOpen} size={iconSize} />
        <View style={styles.fileDetails}>
          <Text style={styles.fileDetailsName}>{name}</Text>
          <Text style={styles.shortInfo}>{size}</Text>
        </View>
        {showSubItems && (
          <View style={styles.subItemContainer}>
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
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 8,
    borderRadius: 4,
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
