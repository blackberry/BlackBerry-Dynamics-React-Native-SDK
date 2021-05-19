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

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { theme } from '../static';

export const Selector = ({items, onSelect}) => {
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    setListItems(items);
  }, [items])

  const handleSelect = (name) => {
    const newList = listItems.map(item => {
      item.active = false;
      if (item.name === name) {
        item.active = true;
        onSelect(item);
      }

      return item;
    });

    setListItems(newList);
  };

  return (
    <View>
      {listItems.map(item => (
        <SelectorItem
          key={item.name}
          {...item}
          onPress={handleSelect}
        />))}
    </View>
  );
}

const SelectorItem = ({name, active, onPress}) => (
  <TouchableHighlight
    style={active ? [styles.selectorItem, styles.selectorItemActive] : styles.selectorItem}
    activeOpacity={theme.activeOpacity}
    underlayColor={theme.underlayColor}
    onPress={() => {onPress(name)}}
  >
    <View style={styles.container}>
      <Text
        style={active ? [styles.selectorItemText, styles.selectorItemTextActive] : styles.selectorItemText}
      >
        {name}
      </Text>
      <FontAwesomeIcon
        icon={faCheck}
        color={theme.white}
        size={22}
      />
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  selectorItem: {
    marginVertical: 5,
    padding: 8,
    borderRadius: 5,
  },
  selectorItemActive: {
    backgroundColor: theme.blue,
  },
  selectorItemText: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.black,
  },
  selectorItemTextActive: {
    color: theme.white,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
});
