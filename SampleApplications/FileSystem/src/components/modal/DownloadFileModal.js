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
import { BottomSheet } from './BottomSheet';
import { CustomButton } from '../CustomButton';
import { colorScheme } from '../../theme';
import { validate } from '../../services/validation.service';
import { CustomTextInput } from '../CustomTextInput';
import { useNotification, useStorage } from '../../context/hooks';

import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';

export const DownloadFileModal = ({ onSubmit, onDownloadEnd, onDismiss }) => {
  const { notification } = useNotification();
  const { storage } = useStorage();

  const [url, setUrl] = useState('http://www.textfiles.com/programming/24hrs.txt');
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState({
    url: null,
    name: null
  });

  useEffect(() => {
    let validated = { url: null, name: null };

    const urlPattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    if (!urlPattern.test(url)) {
      validated.url = 'Please provide correct url!';
    }

    validated = {
      ...validated,
      ...validate({
        name: 'name',
        value: name,
        msg: 'File name'
      })
    };

    setValidationError(validated);
  }, [name, url]);

  const urlHandler = (text) => setUrl(text);
  const nameHandler = (text) => setName(text);

  const downloadHandler = async () => {
    onSubmit();
    try {
      let { extension } = url.lastPathComponent().exposeNameAndExtension();
      let downloadTask = FS.downloadFile({
        fromUrl: url,
        toFile: `${storage.currentPath}/${name}.${extension}`,
        progress: res => {
          console.log(res)
          const percentage = Math.floor((res.bytesWritten / res.contentLength) * 100);
          notification.emmit('success', `File dowloaded: ${percentage}%`);
        },
        progressDivider: 1,
      });

      downloadTask.promise
        .then((res) => {
          if (res.statusCode === 200) {
            onDownloadEnd()
          } else {
            notification.emmit('alert', 'File can\'t be downloaded from following URL.');
          }
        })
        .catch((error) => {
          notification.emmit('alert', error.message);
          console.log(error)
        });

    } catch (error) {
      notification.emmit('alert', error.message);
    }
  }

  return (
    <BottomSheet visible={true}>
      <BottomSheet.Header text="Download file" />
      <BottomSheet.Body>
        <CustomTextInput
          value={url}
          onChangeText={urlHandler}
          validationError={validationError.url}
        />
        <CustomTextInput
          placeholder="file name"
          value={name}
          onChangeText={nameHandler}
          validationError={validationError.name}
        />
        <View style={{ height: 10 }} />
        {name && name.trim().length > 0 ? (
          <CustomButton
            title={'Download file'}
            disabled={!!validationError.name || !!validationError.url}
            onPress={downloadHandler}
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
