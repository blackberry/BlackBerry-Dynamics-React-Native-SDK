/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

import React, { Component } from 'react';

import { Platform, StyleSheet, View, Text, TextInput, Button } from 'react-native';
// import TextInput from 'BlackBerry-Dynamics-for-React-Native-TextInput';
// import Text from 'BlackBerry-Dynamics-for-React-Native-Text';
import Clipboard from 'BlackBerry-Dynamics-for-React-Native-Clipboard';

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      clipboardText: "",
      textInputText: ""
    };
  }

  get_Text_From_Clipboard = async () => {
    var textHolder = await Clipboard.getString();
    console.log('getting value from clipboard: ' + textHolder)
    this.setState({
      clipboardText: textHolder
    })
  }

  set_Text_Into_Clipboard = async () => {
    console.log('setting value to clipboard: ' + this.state.textInputText)
    await Clipboard.setString(this.state.textInputText);
  }

  render() {
    return (
      <View style={styles.MainContainer}>

        <TextInput
          placeholder="Enter Text Here"
          style={styles.textInputStyle}
          underlineColorAndroid='transparent'
          onChangeText={value => this.setState({textInputText: value})}
        />

        <View>
          <Button
            title="PASTE THE COPIED TEXT"
            onPress={this.get_Text_From_Clipboard}
          />
        </View>

        <View>
          <Button
            title="COPY TEXTINPUT TEXT INTO CLIPBOARD"
            onPress={this.set_Text_Into_Clipboard}
          />
        </View>

        <Text style={{ fontSize: 20 }}>{this.state.clipboardText}</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer:
    {
      paddingTop: (Platform.OS === 'ios') ? 20 : 0,
      flex: 1,
      padding: 20,
      paddingBottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
    },
    textInputStyle: {
      textAlign: 'center',
      height: 41,
      width: '92%',
      borderWidth: 1,
      borderColor: '#AA00FF',
      borderRadius: 8,
      marginBottom: 20,
      color: '#000'
    },
    button: {
      width: '92%',
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: '#AA00FF',
      borderRadius: 5,
      marginBottom: 20
    },
    TextStyle: {
      color: '#fff',
      textAlign: 'center',
    }
});
