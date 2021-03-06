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
import { Text, StyleSheet, TouchableHighlight } from 'react-native';
import { theme } from '../static';

export const FullWidthButton = ({title, onPress}) => (
  <TouchableHighlight
    style={styles.button}
    activeOpacity={theme.activeOpacity}
    underlayColor={theme.underlayColor}
    onPress={onPress}
  >
    <Text style={styles.title}>{title}</Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: theme.blue,
  },
  title: {
    color: theme.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
