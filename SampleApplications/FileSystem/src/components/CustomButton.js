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
import { TouchableHighlight, Text, StyleSheet } from 'react-native';
import { colorScheme } from '../theme';

export const CustomButton = ({title, color = colorScheme.primary, disabled = false, onPress}) => (
  <TouchableHighlight
    disabled={disabled}
    activeOpacity={0.7}
    style={{
      ...styles.btn,
      borderColor: color,
      backgroundColor: color,
    }}
    onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create ({
  container: {
    alignItems: 'center',
  },
  btn: {
    borderWidth: 1,
    padding: 13,
    color: '#ffffff',
    borderRadius: 5,
  },
  text: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  }
})