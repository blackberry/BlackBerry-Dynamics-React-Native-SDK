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
import { View, StyleSheet, SafeAreaView, Button, TextInput, Platform, TouchableHighlight, Modal, Text } from 'react-native';
import { WebView } from 'BlackBerry-Dynamics-for-React-Native-WebView';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://google.com',
      modalVisible: false,
      permissions: []
    };
  }

  webView = {
    canGoBack: false,
    canGoForward: false,
    ref: null
  }

  onSubmitUrl(url) {
    const updatedUrl = url.nativeEvent.text.trim();
    if (updatedUrl) {
      this.setState({
        url: updatedUrl
      });
    }
  }

  onBackPress() {
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    return false;
  }

  onForwardPress() {
    if (this.webView.canGoForward && this.webView.ref) {
      this.webView.ref.goForward();
      return true;
    }
    return false;
  }

  onNavigationStateChange(navState) {
    this.webView.canGoBack = navState.canGoBack;
    this.webView.canGoForward = navState.canGoForward;
  }

  onLoadEnd(syntheticEvent) {
    if (Platform.OS === "ios") {
      this.setState({
        url: syntheticEvent.nativeEvent.url
      });
    }
  }

  onReload() {
    if (this.webView.ref) {
      this.webView.ref.reload();
      return true;
    }
    return false;
  }

  onStopLoading() {
    if (this.webView.ref) {
      this.webView.ref.stopLoading();
      return true;
    }
    return false;
  }

  onPermissionRequest(event) {
    if (this.webView.ref.answerPermissionRequest) {
      this.setState({
        modalVisible: true,
        permissions: event.nativeEvent.resources
      });
      return true;
    }
    return false;
  }

  handlePermissions(isAllowed) {
    this.webView.ref.answerPermissionRequest(isAllowed, this.state.permissions );
  }

  dismissModal() {
    this.setState({
      modalVisible: false
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Button
            onPress={() => {this.onBackPress()}}
            title="⇦"
            style={styles.button}
            accessibilityLabel="Back button"
          />
          <Button
            onPress={() => {this.onForwardPress()}}
            title="⇨"
            style={styles.button}
            accessibilityLabel="Forward button"
          />
          <TextInput
            defaultValue={this.state.url}
            style={styles.input}
            autoCapitalize='none'
            onSubmitEditing={url => {this.onSubmitUrl(url)}}
          />
          <Button
            onPress={() => {this.onReload()}}
            title="↻"
            style={styles.button}
            accessibilityLabel="Reload button"
          />
          <Button
            onPress={() => {this.onStopLoading()}}
            title="×"
            style={styles.button}
            accessibilityLabel="StopLoading button"
          />
        </View>
        <WebView
          ref={(webView) => {this.webView.ref = webView;}}
          onNavigationStateChange={(navState) => {this.onNavigationStateChange(navState)}}
          onLoad={(syntheticEvent) => {this.onLoadEnd(syntheticEvent)}}
          automaticallyAdjustContentInsets={false}
          source={{uri: this.state.url}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          style={{marginTop: 5}}
          originWhitelist={['*']}
          onPermissionRequest={(event) => {this.onPermissionRequest(event)}}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>This page wants to use following resources.</Text>
              <Text></Text>
              <Text>{this.state.permissions}</Text>
              <Text></Text>

              <View style={styles.container}>
                <Button
                  onPress={() => {
                    this.handlePermissions(false)
                    this.dismissModal()
                  }}
                  title="Deny"
                  style={styles.button}
                  accessibilityLabel="Deny permission button"
                />
                <Text> </Text>
                <Button
                  onPress={() => {
                    this.handlePermissions(true)
                    this.dismissModal()
                  }}
                  title="Allow"
                  style={styles.button}
                  accessibilityLabel="Allow permission button"
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  input: {
    height: 40,
    paddingLeft: 10,
    borderColor: '#4486f5',
    borderStyle: 'solid',
    borderWidth: 1,
    width: '75%'
  },
  button: {
    color: '#4486f5',
    fontWeight: 'bold',
    fontSize: 18,
    width: '5%',
    height: 40
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});
