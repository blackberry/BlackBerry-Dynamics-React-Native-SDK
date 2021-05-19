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

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { theme } from '../static';

export const TextInputRow = ({placeholder, value, name, onChange}) => {

  const changeText = (text) => onChange({name, text});

  return (
    <View style={styles.inputRow}>
      <Text>{placeholder}</Text>
      <TextInput
        style={styles.roundedInput}
        value={value}
        onChangeText={changeText}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        clearButtonMode="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundedInput: {
    padding: 10,
    height: 40,
    width: '75%',
    borderWidth: 1,
    borderColor: theme.lightGray,
    borderRadius: 5,
    marginVertical: 8,
    color: theme.black,
  }
});
