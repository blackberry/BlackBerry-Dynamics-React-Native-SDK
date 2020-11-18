/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SelectItems = props => {
  const PickerItems = props.items.map(item =>
    <Picker.Item
      key={item.value}
      label={item.label}
      value={item.value}
    />
  );

  return (
    <Picker
      style={styles.picker}
      selectedValue={props.selected}
      prompt={props.prompt}
      onValueChange={props.onValueChange}>
      {PickerItems}
    </Picker>
  );
};

const styles = StyleSheet.create({
  picker: {
    fontSize: 16,
    padding: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35
  }
});

export default SelectItems;
