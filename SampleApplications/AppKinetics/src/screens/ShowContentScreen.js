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
import { Text, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import {
  FullWidthButton,
  Header,
  BottomArea
} from '../components';
import { useNavigation } from '../context/ApplicationContext';
import { theme } from '../static';

export const ShowContentScreen = ({title, content, textAlign}) => {
  const nav = useNavigation();
  const handleBackAction = () => {
    nav.pop();
  };

  // Due to <Text> element limitation on iOS number of text symbols to be displayed limited to 200 000
  const maxTextLength = 200000;
  if(Platform.OS === 'ios' && content && content.length > maxTextLength) {
    content = content.substring(0, maxTextLength) + '...';
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Header title={title} marginVertical={15} />
      <ScrollView style={styles.scrollableArea}>
        <Text style={[
          styles.content,
          {textAlign: textAlign}
        ]}>
          {content}
        </Text>
      </ScrollView>
      <BottomArea>
        <FullWidthButton
          title="Close"
          onPress={handleBackAction} />
      </BottomArea>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingVertical: 25,
    backgroundColor: theme.white,
  },
  content: {
    flex: 1,
    marginVertical: 0,
  },
  scrollableArea: {
    paddingHorizontal: theme.screenPadding,
  },
});
