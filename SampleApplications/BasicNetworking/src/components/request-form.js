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
 
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-fetch-blob';

import FormdataForm from './formdata-form';
import ShowFormdata from './show-formdata';

export default class RequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://google.com',
      requestMethod: 'GET',
      username: '',
      password: '',
      domain: '',
      requestBody: null,
      contentType: 'none',
      responseType: '',
      document: this.DEFAULT_DOCUMENT_VALUE,
      formData: new FormData()
    };
  }
  DEFAULT_DOCUMENT_VALUE = {
    uri: '',
    type: '',
    name: '',
    size: 0
  };
  REQUESTS_WITH_BODY = ['POST', 'PUT', 'PATCH', 'DELETE'];
  REQUEST_METHODS = [
    {
      method: 'GET'
    },
    {
      method: 'POST'
    },
    {
      method: 'PUT'
    },
    {
      method: 'PATCH'
    },
    {
      method: 'DELETE'
    },
    {
      method: 'OPTIONS'
    },
    {
      method: 'HEAD'
    }
  ];
  CONTENT_TYPES = [
    'none',
    'text/plain',
    'application/json',
    'multipart/form-data',
    'application/x-www-form-urlencoded'
  ];
  DEFAULT_TEXT_BODY = 'some plain text';
  DEFAULT_JSON_BODY = JSON.stringify({
    key1: 'value1',
    key2: 'value2'
  });
  DEFAULT_FORM_URLENCODED_BODY = 'param1=value1&param2=value2';
  RESPONSE_TYPES = [
    'arraybuffer',
    'blob',
    'document',
    'json',
    'text'
  ];

  onChangeUrl(updatedUrl) {
    this.setState({ url: updatedUrl });
  }

  onChangeCredentials(credential, value) {
    this.setState({ [credential]: value });
  }

  onChangeRequestMethod(requestMethod) {
    if (this.state.requestMethod === requestMethod) {
      return;
    }

    this.setState({ requestMethod });
  }

  onChangeRequestBody(body) {
    this.setState({ requestBody: body });
  }

  onSubmit() {
    const document = this.state.document;

    if (document.uri) {
      const formDataFile = {
        key: 'file',
        data: {
          uri: document.uri,
          type: document.type,
          name: document.name
        }
      };

      this.addFormdata(formDataFile);
    }

    this.props.onSubmit({
      url: this.state.url.trim(),
      methodName: this.state.requestMethod,
      contentType: this.state.contentType,
      responseType: this.state.responseType,
      body: this.state.requestBody,
      username: this.state.username.trim(),
      password: this.state.password.trim(),
      domain: this.state.domain.trim(),
      formData: this.state.formData
    });

    this.resetRequestForm();
  }

  resetRequestForm() {
    this.setState({
      username: '',
      password: '',
      domain: '',
      requestBody: null,
      document: this.DEFAULT_DOCUMENT_VALUE,
      formData: new FormData(),
      responseType: ''
    });
  }

  setUrl(url) {
    this.setState({ url });
  }

  onChangeContentType(contentType) {
    let requestBody;

    switch (contentType) {
      case 'none':
        requestBody = this.DEFAULT_TEXT_BODY;
        break;
      case 'text/plain':
        requestBody = this.DEFAULT_TEXT_BODY;
        break;
      case 'application/json':
        requestBody = this.DEFAULT_JSON_BODY;
        break;
      case 'multipart/form-data':
        requestBody = null;
        break;
      case 'application/x-www-form-urlencoded':
        requestBody = this.DEFAULT_FORM_URLENCODED_BODY;
        break;
      default:
        console.error(`Content type with name ${contentType} is not recognized`);
        break;
    }

    this.setState({
      requestBody,
      contentType
    });
  }

  onChangeResponseType(responseType) {
    this.setState({ responseType });
  }

  async addDocument() {
    try {
      const document = await DocumentPicker.pick();
      console.log('document:', document);
      console.log('document uri:', document.uri);
      console.log('document name:', document.name);
      let documentUri = document.uri;

      // DEVNOTE: quick fix for Android for using file:// despite content://
      if (Platform.OS === 'android') {
        // const checkIfFileExists  = await RNFetchBlob.fs.exists(`${RNFetchBlob.fs.dirs.DCIMDir}/${document.name}`);
        // const checkIfFileExists  = await RNFetchBlob.fs.exists(`${RNFetchBlob.fs.dirs.PictureDir}/${document.name}`);
        // const checkIfFileExists  = await RNFetchBlob.fs.exists(`${RNFetchBlob.fs.dirs.SDCardDir}/${document.name}`);
        const checkIfFileExists = await RNFetchBlob.fs.exists(`${RNFetchBlob.fs.dirs.DownloadDir}/${document.name}`);

        console.log('Check if file exists in documents folder:', checkIfFileExists);

        documentUri = `file://${RNFetchBlob.fs.dirs.DownloadDir}/${document.name}`;
      }

      this.setState({
        document: {
          ...document,
          uri: documentUri
        }
      });

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  DocumentInfo() {
    return (
      <View>
        <Text style={styles.formDataTitle}>DOCUMENT</Text>
        <Text style={styles.documentTextInfo}>File: {this.state.document.name}</Text>
        <Text style={styles.documentTextInfo}>Size: {this.state.document.size}</Text>
        <Text style={styles.documentTextInfo}>Type: {this.state.document.type}</Text>
        <Text style={styles.documentTextInfo}>URI: {this.state.document.uri}</Text>
      </View>
    );
  }

  removeDocument() {
    this.setState({ document: this.DEFAULT_DOCUMENT_VALUE });
  }

  DocumentAction() {
    const isDocumentSet = !!this.state.document.uri;
    const buttonTitle = isDocumentSet ? 'Remove document' : 'Attach document';
    const buttonAction = isDocumentSet ? this.removeDocument : this.addDocument;

    return (
      <Button
        onPress={() => { buttonAction.call(this) }}
        title={buttonTitle}>
      </Button>
    );
  }

  addFormdata(formResult) {
    const { key, data } = formResult;

    // DEVNOTE: we directly set update FormData here and force update state for detecting FormData changes
    this.state.formData.append(key, data)
    this.forceUpdate();
  }

  render() {
    const { requestMethod, contentType } = this.state;
    const formDataList = this.state.formData.getParts();

    return (
      <View>
        {this.props.method ? <Text style={styles.pageTitle}>{this.props.method.toUpperCase()}</Text> : null}

        <TextInput
          style={styles.input}
          autoCapitalize='none'
          autoCorrect={false}
          clearButtonMode='while-editing'
          defaultValue={this.state.url}
          onChangeText={url => { this.onChangeUrl(url) }}>
        </TextInput>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>

          <Button
            onPress={() => { this.setUrl('https://google.com') }}
            title='Google'
            color='#0070cc'>
          </Button>
          <Button
            onPress={() => { this.setUrl('http://httpbin.org/') }}
            title='httpbin'
            color='#0070cc'>
          </Button>

        </ScrollView>

        {
          this.REQUEST_METHODS.map(request => (
            <View key={request.method}>
              <TouchableOpacity onPress={() => { this.onChangeRequestMethod(request.method) }}>
                <Text style={styles.radioList}>
                  {this.state.requestMethod === request.method ? '⦿' : '○'} {request.method}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        }

        {
          this.props.method === 'xhr' ? (
            <View>
              <Text style={styles.requestTitle}>Response type (optional)</Text>
              {
                this.RESPONSE_TYPES.map(responseType => (
                  <View key={responseType}>
                    <TouchableOpacity onPress={() => { this.onChangeResponseType(responseType) }}>
                      <Text style={styles.radioList}>
                        {this.state.responseType === responseType ? '⦿' : '○'} {responseType}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              }
            </View>
          )
          :
          null
        }

        {
          this.REQUESTS_WITH_BODY.includes(this.state.requestMethod) ? (
            <View>

              <Text style={styles.requestTitle}>Attach data to request:</Text>
              {
                this.CONTENT_TYPES.map(contentType => (
                  <View key={contentType}>
                    <TouchableOpacity onPress={() => { this.onChangeContentType(contentType) }}>
                      <Text style={styles.radioList}>
                        {this.state.contentType === contentType ? '⦿' : '○'} {contentType}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              }

              <View>
                {
                  contentType !== 'multipart/form-data' ? (
                    <TextInput
                      multiline
                      autoCapitalize='none'
                      autoCorrect={false}
                      style={styles.input}
                      value={this.state.requestBody}
                      onChangeText={body => { this.onChangeRequestBody(body) }}>
                    </TextInput>
                  )
                    :
                    null
                }
              </View>

            </View>
          )
            :
            null
        }

        {
          this.REQUESTS_WITH_BODY.includes(this.state.requestMethod) && contentType === 'multipart/form-data' ? (
            <View>
              <Text style={styles.formDataTitle}>ADD FORM DATA</Text>
              {this.state.document.uri ? this.DocumentInfo() : null}
              {this.DocumentAction()}
              <FormdataForm
                onSubmit={formData => { this.addFormdata(formData) }}>
              </FormdataForm>
              {
                formDataList && formDataList.length > 0 ? (
                  <ShowFormdata formDataList={formDataList}></ShowFormdata>
                )
                  :
                  null
              }
            </View>
          )
            :
            null
        }

        {
          this.props.responseStatus === 401 ?
            <View>
              <Text style={styles.formHeader}>Authorization: {this.props.authType}</Text>
              <TextInput
                style={styles.credential}
                autoCapitalize='none'
                autoCorrect={false}
                placeholder='username'
                value={this.state.username}
                onChangeText={username => { this.onChangeCredentials('username', username) }}>
              </TextInput>
              <TextInput
                style={styles.credential}
                autoCapitalize='none'
                autoCorrect={false}
                placeholder='password'
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={password => { this.onChangeCredentials('password', password) }}>
              </TextInput>
              {
                this.props.authType === 'ntlm' ? (
                  <TextInput
                    style={styles.credential}
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='domain'
                    value={this.state.domain}
                    onChangeText={domain => { this.onChangeCredentials('domain', domain) }}
                  >
                  </TextInput>
                )
                  :
                  null
              }
            </View>
            :
            null
        }

        {/* DEVNOTE: display info message for not handling Kerberos */}
        {
          this.props.authType === 'kerberos' ? (
            <Text style={{ padding: 5 }}>NOTE: Kerberos authentification is not supported by this sample</Text>
          )
            :
            null
        }

        <View style={styles.submit}>
          <Button
            onPress={() => { this.onSubmit() }}
            title='Send'
            color='#0070cc'>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
    borderColor: '#4486f5',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    margin: 7,
    marginTop: 9
  },
  credential: {
    padding: 12,
    fontSize: 18,
    borderColor: '#0070cc',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 15
  },
  pageTitle: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 12,
    color: '#4486f5',
    fontSize: 22,
    fontWeight: 'bold'
  },
  formHeader: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    textAlign: 'center',
    fontSize: 16,
  },
  submit: {
    backgroundColor: '#edf4ff',
    paddingVertical: 3,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 5
  },
  radioList: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 18
  },
  requestTitle: {
    fontSize: 14,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 2,
    fontWeight: 'bold'
  },
  formDataTitle: {
    paddingVertical: 3,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  documentTextInfo: {
    fontSize: 14,
    padding: 2
  }
});
