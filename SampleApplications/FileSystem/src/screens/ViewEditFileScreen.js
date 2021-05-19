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
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import FileSystemService from '../services/file-system.service';
import { ScreenContext } from '../../App';
import { NotificationContext } from '../context/NotificationContext';
import { Header } from '../components/Header';
import { IconButton, icons } from '../components/IconButton';
import { FloatingButton } from '../components/FloatingButton';
import { colorScheme } from '../theme';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

const screenHeight = Math.round(Dimensions.get('window').height);

export const ViewEditFileScreen = ({ source }) => {
  const { screen } = useContext(ScreenContext);
  const { notification } = useContext(NotificationContext);

  const [file, setFile] = useState(source);
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(
    'File content can\'t be shown, only text formats are supported!'
  );

  useEffect(() => {
    FileSystemService
      .readFile(file.path)
      .then(content => setContent(content))
      .catch(error => notification.emmit('alert', error.message));
  }, []);

  const toggleEdit = () => setEdit(!edit);

  const saveFile = async () => {
    toggleEdit();
    FileSystemService
      .writeFile(file.path, content)
      .catch(error => notification.emmit('alert', error.message));
  }

  const backButton = (
    <IconButton
      icon={icons.back}
      onPress={() => screen.pop()}
    />
  );

  const editableContent = (
    <TextInput
      style={styles.fileContent}
      onChangeText={text => setContent(text)}
      value={content}
      multiline={true}
      textAlignVertical="top"
    />
  );

  const viewableContent = <Text>{content}</Text>;

  return (
    <View style={styles.main}>
      <Header title={file.name} leading={backButton} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.content}>
          <ScrollView>
            {edit ? editableContent : viewableContent}
          </ScrollView>
          {edit ?
            (<FloatingButton
              icon={faSave}
              onPress={saveFile}
            />)
            :
            (<FloatingButton
              icon={faEdit}
              onPress={toggleEdit}
            />)
          }
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
    backgroundColor: colorScheme.primary,
  },
  content: {
    flex: 1,
    padding: 5,
    backgroundColor: colorScheme.white,
  }
});
