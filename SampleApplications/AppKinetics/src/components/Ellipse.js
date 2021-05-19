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
import { View, StyleSheet } from 'react-native';
import { theme } from '../static';

export const Ellipse = ({color}) => (
  <View style={[
    styles.circleOuter,
    {backgroundColor: color},
  ]}>
    <View style={styles.circleInner} />
  </View>
);

const OuterCircleSize = 17;
const InnerCircleSize = 9;

const styles = StyleSheet.create({
  circleOuter: {
    borderRadius: OuterCircleSize / 2,
    height: OuterCircleSize,
    width: OuterCircleSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    borderRadius: InnerCircleSize / 2,
    backgroundColor: theme.white,
    height: InnerCircleSize,
    width: InnerCircleSize,
  }
});
