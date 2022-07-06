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

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import FileSystemService from '../../services/file-system.service';
import { BottomSheet } from './BottomSheet';
import { CustomButton } from '../CustomButton';
import { colorScheme } from '../../theme';
import { validate } from '../../services/validation.service';
import { CustomTextInput } from '../CustomTextInput';
import { useNotification } from '../../context/hooks';

export const CreateFolderModal = ({ path, onSubmit, onDismiss }) => {
  const { notification } = useNotification();
  const [name, setName] = useState('');

  const [validationError, setValidationError] = useState({
    name: null
  });

  useEffect(() => {
    setValidationError(validate({
      name: 'name',
      value: name,
      msg: 'Folder name'
    }));
  }, [name]);

  const folderNameHandler = (text) => setName(text);
  const createFolderHandler = () => {
    FileSystemService
      .createFolder(`${path}/${name}`)
      .then(() => onSubmit())
      .catch(err => {
        notification.emmit('alert', err.message);
        onDismiss();
      });
  }

  return (
    <BottomSheet visible={true}>
      <BottomSheet.Header text="Create Folder" />
      <BottomSheet.Body>
        <CustomTextInput
          placeholder="Folder name"
          value={name}
          onChangeText={folderNameHandler}
          validationError={validationError.name}
        />
        <View style={{ height: 10 }} />
        {name && name.trim().length > 0 ? (
          <CustomButton
            title="Create Folder"
            disabled={!!validationError.name}
            onPress={createFolderHandler}
          />)
          :
          null
        }
        <View style={{ height: 10 }} />
        <CustomButton
          title="Close"
          color={colorScheme.red}
          onPress={onDismiss}
        />
      </BottomSheet.Body>
    </BottomSheet>
  );
};
