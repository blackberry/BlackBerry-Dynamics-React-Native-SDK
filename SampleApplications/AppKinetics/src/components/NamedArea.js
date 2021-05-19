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

import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../static';

export const NamedArea = ({name, children}) => (
  <View style={styles.area}>
    <Text style={styles.title}>{name}</Text>
    <Fragment>
      {children}
    </Fragment>
  </View>
);

const styles = StyleSheet.create({
  area: {
    paddingVertical: 10,
  },
  title: {
    marginBottom: 15,
    color: theme.gray,
    fontSize: 16,
    lineHeight: 18,
  }
});
