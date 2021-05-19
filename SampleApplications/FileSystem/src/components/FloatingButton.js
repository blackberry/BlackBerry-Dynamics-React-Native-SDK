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
import { TouchableHighlight, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colorScheme } from '../theme';

const width = 110;
const height = width;

export const FloatingButton = ({ icon = null, onPress }) => {
  return (
    <TouchableHighlight
      style={styles.circle}
      activeOpacity={0.7}
      underlayColor={colorScheme.primaryLight}
      onPress={onPress}
    >
      <FontAwesomeIcon icon={icon} size={20} color="#fff" />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: Math.round(width + height) / 2,
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: colorScheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 35,
    right: 30,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
});
