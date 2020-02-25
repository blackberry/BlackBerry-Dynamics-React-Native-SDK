/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
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
 
import React, {Component} from 'react';
import { StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';

import { Base64 } from 'js-base64';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://google.com'
    };
  }

  onSubmitUrl(url) {
    const updatedUrl = url.nativeEvent.text.trim();
    if (updatedUrl) {
      this.setState({
        url: updatedUrl
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <TextInput
          defaultValue={this.state.url}
          style={styles.input}
          autoCapitalize='none'
          onSubmitEditing={url => {this.onSubmitUrl(url)}}>
        </TextInput>
        <WebView
          source={{uri: this.state.url}}
          originWhitelist={['*']}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 5,
    paddingLeft: 5,
    borderColor: '#4486f5',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 5
  }
});
