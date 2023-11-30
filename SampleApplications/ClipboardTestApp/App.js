/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Clipboard module example
 * from https://github.com/react-native-clipboard/clipboard/blob/v1.11.1/example/App.tsx
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

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import Clipboard, {
  useClipboard,
} from 'BlackBerry-Dynamics-for-React-Native-Clipboard';

// Small icon of a plus for demo purposes
const TEST_IMAGE =
  'iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';

const changeListener = () => {
  console.info('Clipboard changed!');
};

const App = () => {
  const [userInputText, setUserInputText] = useState('');
  const [textFromClipboard, setTextFromClipboard] = useClipboard();
  const [isURL, setIsURL] = useState(false); // iOS only
  const [isNumber, setIsNumber] = useState(false); // iOS only
  const [imageIos, setImageIos] = useState(null); // iOS only
  const [imageAndroid, setImageAndroid] = useState(''); // Android only

  const checkStringType = async () => {
    const checkClipboardHasURL = await Clipboard.hasURL();
    const checkClipboardHasNumber = await Clipboard.hasNumber();
    setIsURL(checkClipboardHasURL);
    setIsNumber(checkClipboardHasNumber);
  };

  const pasteImageAndroid = async () => {
    const base64 = await Clipboard.getImage();
    setImageAndroid(base64);
  };

  useEffect(() => {
    checkStringType();
  }, [textFromClipboard]);

  useEffect(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const listener = Clipboard.addListener(changeListener);

      return () => {
        listener.remove();
      };
    }
  }, []);

  const writeToClipboard = async () => {
    setTextFromClipboard(userInputText);
    Alert.alert(`Copied to clipboard: ${userInputText}`);
  };

  const getTextFromClipboard = async () => {
    const content = await Clipboard.getString();
    setTextFromClipboard(content);
    Alert.alert(`Clipboard text: ${content}`);
  };

  const writeImageToClipboard = async () => {
    Clipboard.setImage(TEST_IMAGE);
    Alert.alert('Copied Image to clipboard');
  };

  const getImage = async () => {
    if (await Clipboard.hasImage()) {
      const imgFromCb = await Clipboard.getImagePNG();
      setImageIos(imgFromCb);
    } else {
      console.warn('No image in clipboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Clipboard Module</Text>
      <View style={styles.main}>
        <Text style={styles.boldText}>Clipboard Contents (string): </Text>
        <Text style={styles.clipboardContent}>{textFromClipboard}</Text>
        {Platform.OS === 'ios' && (
          <>
            <Text style={styles.boldText}>Content is URL (boolean): </Text>
            <Text style={styles.clipboardContent}>{JSON.stringify(isURL)}</Text>
            <Text style={styles.boldText}>Content is NUMBER (boolean): </Text>
            <Text style={styles.clipboardContent}>
              {JSON.stringify(isNumber)}
            </Text>
            <Text style={styles.boldText}>Content is IMAGE (img): </Text>
            {imageIos && (
              <Image source={{uri: imageIos}} style={styles.imageContent} />
            )}
          </>
        )}
        <View style={styles.separator} />
        <TextInput
          selectTextOnFocus={true}
          style={styles.textInput}
          onChangeText={input => setUserInputText(input)}
          value={userInputText}
          placeholder="Type here..."
        />
        <Button onPress={writeToClipboard} title="Write text to Clipboard" />
        <Button
          onPress={getTextFromClipboard}
          title="Paste text from Clipboard"
        />
        {Platform.OS === 'ios' && (
          <>
            <Button
              onPress={writeImageToClipboard}
              title="Write Image to Clipboard"
            />
            <Button onPress={getImage} title="Get Image from clipboard" />
          </>
        )}
        {Platform.OS === 'android' && (
          <View style={styles.imageButtonAndroid}>
            <Button
              onPress={pasteImageAndroid}
              title="Paste image from Android Clipboard"
            />
            <View style={styles.separator} />
            {imageAndroid === '' ? null : (
              <Image style={styles.imageAndroid} source={{uri: imageAndroid}} />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: '700',
    fontSize: 30,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: '600',
    marginBottom: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'gray',
    width: '80%',
    marginVertical: 20,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 80,
    paddingVertical: 8,
    marginBottom: 16,
  },
  clipboardContent: {
    marginBottom: 20,
  },
  imageContent: {
    width: 40,
    height: 40,
  },
  imageAndroid: {
    height: 160,
    width: 160,
  },
  imageButtonAndroid: {
    marginTop: 10,
  },
});

export default App;
