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

import React from 'react';
import { View, Modal, Text, StyleSheet } from 'react-native';
import { TransparentButton } from './TransparentButton';
import { theme } from '../static';

export const IosStyleModal = ({visible, title, onShow, children, buttons}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onShow={onShow}
  >
    <View style={styles.overlay}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>{title}</Text>
          {children}
          <View style={styles.modalButtons}>
            {buttons.map((button, idx) => (<TransparentButton key={idx} {...button} />))}
          </View>
        </View>
      </View>
    </View>
  </Modal>
);

IosStyleModal.Body = ({children}) => (
  <View style={styles.modalBody}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    height: '100%',
    marginTop: 'auto',
    backgroundColor: theme.darkGray,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    maxWidth: '70%',
    minWidth: '55%',
    backgroundColor: theme.white,
    borderRadius: 10,
    paddingHorizontal: 35,
    paddingVertical: 10,
    shadowColor: theme.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1
  },
  modalHeader: {
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  modalBody: {
    marginVertical: 10,
  }
});
