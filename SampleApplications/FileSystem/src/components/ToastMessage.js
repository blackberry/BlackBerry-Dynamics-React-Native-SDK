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

import React from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export const ToastMessage = ({icon, color, message, onDismiss}) => (
  <View style={styles.messageContainer}>
    <FontAwesomeIcon icon={icon} size={18} color={color} />
    <Text style={styles.message}>{message}</Text>
    <TouchableHighlight onPress={onDismiss}>
      <FontAwesomeIcon icon={faTimes} size={18} color="#ccc" />
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  messageContainer: {
    marginTop: 'auto',
    marginBottom: 45,
    bottom: 0,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#2d2d2d',
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  icon: {
    width: 30,
    height: 30,
  },
  message: {
    flex: 1,
    color: '#fff',
    marginLeft: 15,
  }
});