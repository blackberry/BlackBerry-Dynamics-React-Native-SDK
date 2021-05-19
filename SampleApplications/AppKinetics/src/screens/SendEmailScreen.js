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

import React, { useState, Fragment } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import {
  BottomArea,
  BottomTabBar,
  FullWidthButton,
  Header,
  TabButton,
  TextAreaRow,
  TextInputRow,
  TransparentButton,
  ListItem,
  IosStyleModal as Modal
} from '../components';
import { faFolder, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useNotification } from '../context/ApplicationContext';
import { theme } from '../static';

import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';
import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';


const normalizeEmailString = (string) => {
  return string
    .split(',')
    .map(email => email.trim())
    .filter(email => email !== '')
};

export const SendEmailScreen = () => {
  const nav = useNavigation();
  const notification = useNotification();
  const [files, setFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: []
  });

  const toggleModal = () => setModalVisible(!modalVisible);

  const handleInput = ({name, text}) => setForm({
    ...form,
    [name]: text
  });

  const loadModalContent = async () => {
    try {
      const root = FS.DocumentDirectoryPath;
      const dataFolder = `${root}/data`;
      const files = [
        ...await FS.readDir(dataFolder),
        ...await FS.readDir(root)
      ]
      .filter(item => item.isFile())
      .map(({name, path}) => ({
        relativePath: path.replace(root, ''),
        path,
        name,
        selected: false
      }));

      setFiles(files);
    } catch (error) {
      console.log({error});
    }
  };

  const sendEmailViaBBWork = async () => {
    try {
      const result = await BbdAppKinetics.sendEmailViaBBWork(
        normalizeEmailString(form.to),
        normalizeEmailString(form.cc),
        normalizeEmailString(form.bcc),
        form.subject,
        form.body,
        form.attachments
      );
      notification.emmit('success', `SendEmailViaBBWork - ${result}`);
    } catch (error) {
      notification.emmit('alert', error.message);
    }
  };

  const selectAttachment = (index) => {
    const nextFiles = [...files];
    nextFiles[index].selected = !nextFiles[index].selected;
    setFiles(nextFiles);
  };

  const addAttachments = () => {
    const attachments = [];
    files.forEach(({path, selected}) => {
      selected && attachments.push(path);
    });
    setForm({
      ...form,
      attachments
    });
    setFiles([]);
    toggleModal();
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Fragment>
          <ScrollView style={styles.scrollableArea}>
            <Header title="Send Email" />
            <Fragment>
              <TextInputRow
                placeholder="To:"
                name="to"
                value={form.to}
                onChange={handleInput} />
              <TextInputRow
                placeholder="Cc:"
                name="cc"
                value={form.cc}
                onChange={handleInput} />
              <TextInputRow
                placeholder="Bcc:"
                name="bcc"
                value={form.bcc}
                onChange={handleInput} />
              <TextInputRow
                placeholder="Subject:"
                name="subject"
                value={form.subject}
                onChange={handleInput} />
              <TextAreaRow
                placeholder="Compose email"
                name="body"
                value={form.body}
                onChange={handleInput} />
              <View style={styles.buttonArea}>
                <Text>
                  Attachments: [{form.attachments.length}]
                </Text>
                <TransparentButton
                  title="Add attachment"
                  onPress={toggleModal} />
              </View>
            </Fragment>
          </ScrollView>
          <BottomArea>
            <View style={styles.buttonRow}>
              <FullWidthButton title="Send to BlackBerry Work" onPress={sendEmailViaBBWork} />
            </View>
            <BottomTabBar>
              <TabButton
                icon={faFolder}
                title="Send file"
                onPress={() => nav.pop()} />
              <TabButton icon={faPaperPlane} active title="Send email" />
            </BottomTabBar>
          </BottomArea>
          <Modal
            title="Add Attachments"
            visible={modalVisible}
            onShow={loadModalContent}
            buttons={[
              { title: "Cancel", onPress: toggleModal},
              { title: "OK", onPress: addAttachments},
            ]}
          >
            <Modal.Body>
              <View style={styles.scrollViewWrapper}>
                {files.length > 0 ? 
                  (<ScrollView>
                    {files.map(({relativePath, selected}, idx) => (
                      <ListItem
                        key={idx}
                        title={relativePath}
                        active={selected}
                        onPress={() => selectAttachment(idx)} />
                    ))}
                  </ScrollView>
                  ) : (<Text style={styles.loading}>Loading ...</Text>)
                }
              </View>
            </Modal.Body>
          </Modal>
        </Fragment>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

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
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonRow: {
    marginVertical: 10,
  },
  scrollViewWrapper: {
    maxHeight: 250,
  },
  loading: {
    textAlign: 'center',
  }
});
