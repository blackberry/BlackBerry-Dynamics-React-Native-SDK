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
import { View } from 'react-native';
import { colorScheme } from '../../theme';
import { CustomButton } from '../CustomButton';
import { ApplicationContext} from '../../context/ApplicationContext';
import { NotificationContext } from '../../context/NotificationContext';
import { BottomSheet } from './BottomSheet';
import { validate } from '../../services/validation.service';
import { CustomTextInput } from '../CustomTextInput';

import FileSystemService from '../../services/file-system.service';

export const CreateTxtFile = ({visible, onSubmit, onDismiss}) => {
  const { storage } = useContext(ApplicationContext);
  const { notification } = useContext(NotificationContext);

  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState({
    name: null
  });

  useEffect(() => {
    setValidationError(validate({
      name: 'name',
      value: name,
      msg: 'File name'
    }));
  }, [name]);

  const fileNameHandler = text => setName(text);

  const createFileHandler = () => {
    const path = `${storage.currentPath}/${name}.txt`;

    FileSystemService.createFile(path)
      .then(() => {
        onSubmit({
          name,
          location: path
        })
      })
      .catch(err => {
        onDismiss();
        notification.emmit('alert', err.message);
      });
  };

  return (
    <BottomSheet>
      <BottomSheet.Header text="Create empty txt file" />
      <BottomSheet.Body>
        <CustomTextInput
          placeholder="File name"
          value={name}
          onChangeText={fileNameHandler}
          validationError={validationError.name}
        />
        <View style={{height: 10}} />
        { name && name.trim().length > 0 ? (
          <CustomButton
            title="Create File"
            disabled={!!validationError.name}
            onPress={createFileHandler}
          />)
          :
          null
        }

        <View style={{height: 10}} />
        <CustomButton
          title="Close"
          color={colorScheme.red}
          onPress={() => onDismiss()}
        />
      </BottomSheet.Body>
    </BottomSheet>
  );
};
