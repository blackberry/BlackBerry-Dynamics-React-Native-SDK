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

import React, { Component } from 'react';
import { Platform, StyleSheet, SafeAreaView, Text, TextInput, Button, View, FlatList, KeyboardAvoidingView } from 'react-native';

import { WebSocket, Blob, FileReader, Response, Headers } from 'BlackBerry-Dynamics-for-React-Native-Networking';

const webSocketServerAddress = Platform.select({
  ios: 'ws://localhost:8080',
  android: 'ws://10.0.2.2:8080'
  // ios: 'ws://echo.wss-websocket.net',
  // android: 'ws://echo.wss-websocket.net'
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webSocketServerUrl: webSocketServerAddress,
      connectionStatus: 'not connected',
      inputText: '',
      messages: [],
      currentMessageType: 'Text',
      binaryType: 'blob'
    };
  }
  webSocketClient;
  messageTypes = ['Text', 'Blob', 'ArrayBuffer'];
  binaryTypes = ['blob', 'arraybuffer'];

  componentDidMount() {}

  handleNewWebSocketConnection() {
    this.webSocketClient = new WebSocket(this.state.webSocketServerUrl);
    this.webSocketClient.binaryType = 'blob';

    this.webSocketClient.onopen = () => {
      console.log('WS connection is opened!');
      this.setState({ connectionStatus: 'connected' });
    };

    this.webSocketClient.onmessage = async(e) => {
      const data = e.data;
      let text = data;
      console.log('Event message:', e);
      console.log('isBlob:', data instanceof Blob);
      console.log('isArrayBuffer', data instanceof ArrayBuffer);

      const now = new Date()
      let messageTemplate = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} `;

      if (data instanceof Blob) {
        messageTemplate += 'Received binary Blob: ';

        try {
          text = await this.readBlobAsText(data);
          // DEVNOTE: Response API can be used here too
          // text = await new Response(data).text();
        } catch (error) {
          text = 'failed to convert Blob to text message. Please, check response binary type...';
        }
      } else if (data instanceof ArrayBuffer) {
        messageTemplate += 'Received binary ArrayBuffer: ';
        text = this.convertArrayBufferToString(data);
        if (!text) {
          text = 'failed to convert ArrayBuffer to text message. Please, check response binary type...'
        }
      }

      this.setState((state, props) => {
        return { messages: [...state.messages, `${messageTemplate}${text}`] };
      });

    };

    this.webSocketClient.onerror = (e) => {
      alert(`WS error: ${e.message}`);
    };

    this.webSocketClient.onclose = (e) => {
      console.log('WS connection is closed!');
      this.setState({ connectionStatus: 'closed' });
    };
  }

  handleWebServerConnection() {
    if (this.state.connectionStatus === 'connected') {
      this.webSocketClient.close();
    } else {
      this.handleNewWebSocketConnection();
    }
  }

  onMessageChange(message) {
    this.setState({ inputText: message });
  }

  onUrlChange(url) {
    this.setState({ webSocketServerUrl: url })
  }

  onMessageTypeChange(currentMessageType) {
    let newMessageType = this.messageTypes.shift();
    if (currentMessageType === newMessageType) {
      newMessageType = this.messageTypes.shift();
    }
    this.messageTypes.push(currentMessageType);
    this.setState({ currentMessageType: newMessageType });
  }

  onBinaryTypeChange(currentBinaryType) {
    let newBinaryType = this.binaryTypes.shift();
    if (currentBinaryType === newBinaryType) {
      newBinaryType = this.binaryTypes.shift();
    }
    this.binaryTypes.push(currentBinaryType);

    this.webSocketClient.binaryType = newBinaryType;
    this.setState({ binaryType: newBinaryType });
  }

  sendMessage() {
    let message = this.state.inputText.trim();
    if (message) {
      switch (this.state.currentMessageType) {
        case 'Blob':
          message = new Blob([message], { type: 'plain/text' });
          break;
        case 'ArrayBuffer':
          message = this.convertStringToArrayBuffer(message);
          break;
        default:
          break;
      }

      this.webSocketClient.send(message);
      this.setState({ inputText: '' });
    }
  }

  convertStringToArrayBuffer(string) {
    const stringLength = string.length;
    let buffer = new ArrayBuffer(stringLength * 2);
    let bufferView = new Uint16Array(buffer);

    for (let i = 0; i < stringLength; i++) {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
  }

  convertArrayBufferToString(buffer) {
    let convertedString = '';
    try {
      convertedString = String.fromCharCode.apply(null, new Uint16Array(buffer));
    } catch (error) {
      console.error('Failed to convert ArrayBuffer to text!');
    }
    return convertedString;
  }

  readBlobAsText(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function() {
        resolve(reader.result)
      }

      reader.onerror = function() {
        reject(reader.error)
      }

      reader.readAsText(blob);
    });
  }

  render() {
    const { messages, binaryType, currentMessageType, connectionStatus } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Text style={styles.pageHeader}>WebSockets Client</Text>
        <Text style={styles.status}>Connection: {connectionStatus}</Text>

        <TextInput
          defaultValue={this.state.webSocketServerUrl}
          style={styles.inputHeader}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={url => { this.onUrlChange(url) }}>
        </TextInput>

        <View style={[styles.buttonActionFullWidth, { marginBottom: 10 }]}>
          <Button
            onPress={() => { this.handleWebServerConnection() }}
            title={connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}
            color='#0070cc'>
          </Button>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'positon'}
          enabled>
          {
            messages &&
              <FlatList
                data={messages}
                ref={flatList => { this.flatList = flatList }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.textMessage}>{item}</Text>}
                onContentSizeChange={() => { this.flatList.scrollToEnd() }}/>
          }

          {
            connectionStatus === 'connected' ?
              <View>
                <View style={styles.buttonTogglerFullWidth}>
                  <Button
                    onPress={() => { this.onBinaryTypeChange(binaryType) }}
                    title={`Response binary type: ${binaryType}`}
                    color='#4486f5'>
                  </Button>
                </View>
                <TextInput
                  value={this.state.inputText}
                  style={[styles.inputMessage]}
                  multiline
                  textAlignVertical='top'
                  numberOfLines={3}
                  maxHeight={100}
                  autoCapitalize='none'
                  autoCorrect={false}
                  placeholder='Type a message'
                  onChangeText={message => { this.onMessageChange(message) }}>
                </TextInput>

                <View style={{ paddingVertical: 2 }}>
                  <Button
                    onPress={() => { this.onMessageTypeChange(currentMessageType) }}
                    title={currentMessageType}
                    color='#4486f5'>
                  </Button>
                </View>

                <View style={styles.buttonActionRoundBorders}>
                  <Button
                    onPress={() => { this.sendMessage() }}
                    title='Send'
                    color='#0070cc'>
                  </Button>
                </View>
              </View>
              :
              null
          }
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  inputHeader: {
    padding: 10,
    borderColor: '#4486f5',
    borderStyle: 'solid',
    marginTop: 3,
    fontSize: 18,
    textAlign: 'center',
    color: '#000'
  },
  inputMessage: {
    padding: 15,
    fontSize: 18,
    borderColor: '#f8f9fa',
    borderStyle: 'solid',
    borderBottomWidth: 3,
    minHeight: 100,
    color: '#000'
  },
  buttonActionFullWidth: {
    backgroundColor: '#edf4ff',
    padding: 3
  },
  buttonActionRoundBorders: {
    backgroundColor: '#edf4ff',
    padding: 4,
    borderRadius: 12,
    marginHorizontal: 12
  },
  buttonTogglerFullWidth: {
    backgroundColor: '#f8f9fa',
    padding: 3
  },
  status: {
    fontWeight: 'bold',
    marginVertical: 4,
    marginHorizontal: 15
  },
  textMessage: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 16
  },
  pageHeader: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 12,
    color: '#4486f5',
    fontSize: 22,
    fontWeight: 'bold'
  }
});
