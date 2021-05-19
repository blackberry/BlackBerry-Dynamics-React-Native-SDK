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

import React, { Fragment, useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { FloatingButton } from './FloatingButton';

export const FloatingActionButton = ({ icon, actions }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Fragment>
      {pressed && (
        <View style={styles.container}>
          {actions.map(item => (
            <TouchableHighlight
              key={item.title}
              underlayColor='#f2f2f2'
              onPress={() => {
                item.onPress();
                setPressed(!pressed);
              }}
            >
              <View style={styles.itemRow}>
                <FontAwesomeIcon icon={item.iconSource} size={20} color="#2d2d2d" />
                <View style={{width: 15}} />
                <Text>{item.title}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      )}
      <FloatingButton icon={icon} onPress={() => setPressed(!pressed)} />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
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
    marginRight: 12,
  },
  itemRow: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  }
});
