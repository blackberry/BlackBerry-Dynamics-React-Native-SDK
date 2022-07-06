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
import { Platform, StyleSheet, Text, View, FlatList } from 'react-native';

export const ShowItemsList = props => {
  const { header, objectData } = props;

  const renderItem = ({item}) => (
    <View style={styles.listItemContainer}>
      <Text style={styles.listItemFont}>
        <Text style={styles.listItemKey}>{item}: </Text>
        { renderObjectOrValue(objectData[item]) }
      </Text>
    </View>
  );

  const renderObjectOrValue = itemValue => {
    if (Array.isArray(itemValue)) {
      let arrayAsString = '';

      itemValue.forEach(item => {
        arrayAsString += `\n  ${JSON.stringify(item)},`;
      });

      return `[${removeEndLineComma(arrayAsString)}\n]`;
    } else if (typeof itemValue === 'object' && itemValue !== null) {
      let objectAsString = '{';

      for (const key in itemValue) {
        objectAsString += `\n  ${key}: ${JSON.stringify(itemValue[key])},`;
      }

      return `${removeEndLineComma(objectAsString)}\n}`;
    }

    return JSON.stringify(itemValue);
  }

  const removeEndLineComma = str => {
    return str[str.length - 1] === ',' ? str.slice(0, -1) : str;
  }

  return (
    <View>
      <Text style={styles.listTitle}>{header}</Text>
      <FlatList
        data={Object.keys(objectData)}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    paddingHorizontal: 18,
    paddingVertical: 6
  },
  listItemFont: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'CourierNewPSMT' : 'monospace',
    color: '#000'
  },
  listTitle: {
    textAlign: 'center',
    paddingVertical: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000'
  },
  listItemKey: {
    fontWeight: 'bold',
    fontFamily: 'Arial'
  }
});
