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
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Ellipse } from './Ellipse';
import { theme } from '../static';

export const ListItem = ({title, active = false, trailing = null, onPress}) => (
  <TouchableHighlight
    style={styles.itemContainer}
    activeOpacity={theme.activeOpacity}
    underlayColor={theme.underlayColor}
    onPress={onPress}
  >
    <View style={styles.flexContainer}>
      <Ellipse color={active ? theme.blue : theme.lightGray} />
      <Text style={styles.title}>{title}</Text>
      {trailing}
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    padding: 4,
  },
  title: {
    flex: 1,
    paddingHorizontal: 10,
  }
});
