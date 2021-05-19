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
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { colorScheme } from '../theme';

export const CustomTextInput = ({placeholder, onChangeText, value, validationError}) => (
  <View>
    <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      placeholderTextColor={colorScheme.placeholderTextColor}
      autoCapitalize="none"
      clearButtonMode="always"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText} />
      {validationError && <Text style={styles.validation}>{validationError}</Text>}
  </View>
);

const styles = StyleSheet.create({
  validation: {
    color: colorScheme.red,
    marginVertical: 15,
  },
  input: {
    padding: 10,
    height: 40,
    borderWidth: 1,
    borderColor: colorScheme.primary,
    color: colorScheme.black,
    borderRadius: 5,
    marginBottom: 10,
  },
});
