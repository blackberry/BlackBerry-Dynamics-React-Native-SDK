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
import { View, StyleSheet, Text } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { CustomButton } from '../CustomButton';
import { colorScheme } from '../../theme';
import { CustomTextInput } from '../CustomTextInput';

import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';

export const UploadFileModal = ({file, onSubmit, onDismiss}) => {
  const [url, setUrl] = useState('http://httpbin.org/post');
  const [msg, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(false);

  const [validationError, setValidationError] = useState({
    url: null
  });

  useEffect(() => {
    let validated = { url: null};
    const urlPattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    if(!urlPattern.test(url)) {
      validated.url = 'Please provide correct url!';
    }

    setValidationError(validated)
  }, [url]);

  const uploadingProgressHandler = (response) => {
    if(response.totalBytesExpectedToSend > 0) {
      const percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
      setUploadingProgress(`${percentage}%`);
      setUploading(true);
    }
  };

  const uploadFileHandler = () => {
    setMessage(null);

    const files = [file];

    FS.uploadFiles({
      toUrl: url,
      files,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      progress: uploadingProgressHandler
    }).promise.then((response) => {
        if (response.statusCode == 200) {
          setMessage('Done!');
        } else {
          setMessage('Server error: something went wrong!');
        }
      }).catch((error) => {
        setMessage(`Server error: ${error}`);
      }).finally(() => setUploading(false));
  };

  return (
    <BottomSheet visible={true}>
      <BottomSheet.Header text={`upload to server: ${file.filename}`} />
      <BottomSheet.Body>
        {msg && <Text style={styles.uploadProgress}>{msg} </Text>}
        {uploading && <Text style={styles.uploadProgress}>Uploading: {uploadingProgress} </Text>}
        <CustomTextInput
          value={url}
          onChangeText={(text) => setUrl(text)}
          validationError={validationError.url}
        />
        <View style={{height: 10}} />
        <CustomButton
          title="Upload to server"
          disabled={!!validationError.url || uploading}
          onPress={uploadFileHandler}
        />
        <View style={{height: 10}} />
        <CustomButton
          title="Close"
          color={colorScheme.red}
          onPress={onDismiss}
        />
      </BottomSheet.Body>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  uploadProgress: {
    textAlign: 'center',
    marginVertical: 10
  }
});
