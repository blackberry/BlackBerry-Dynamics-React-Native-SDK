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
import { StyleSheet, Text, View, SafeAreaView, Button, ScrollView, PermissionsAndroid, Platform } from 'react-native';

import RequestForm from './src/components/request-form';
import ShowResponseResults from './src/components/show-response-results';

import { Base64 } from 'js-base64';
import url from 'url';

import { Ntlm } from './src/scripts/ntlmHelper';
import { Digest } from './src/scripts/digestHelper';

import { fetch, XMLHttpRequest, Blob } from 'BlackBerry-Dynamics-for-React-Native-Networking';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'welcome',
      responseStatus: null,
      responseHeaders: {},
      responseWwwAuthHeader: '',
      authType: '',
      responseBody: ''
    };
  }
  REQUESTS_WITH_BODY = ['POST', 'PUT', 'PATCH', 'DELETE'];

  componentDidMount = () => {
    if(Platform.OS === 'android') {
      async function requestReadExternalStoragePermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          )
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            alert("Permission denied, add READ_EXTERNAL_STORAGE permission in AndroidManifest.xml and re-build the app.");
          }
        }
        catch (err) {
          alert("err", err);
          console.warn(err);
        }
      }
      requestReadExternalStoragePermission();
    }
  }

  onChangeTab(tab) {
    this.setState({ activeTab: tab });
  }

  async handleFetch(requestData) {
    const requestMethod = requestData.methodName;
    const authUsername = requestData.username;
    const authPassword = requestData.password;
    const authDomain = requestData.domain;
    const contentType = requestData.contentType;
    const formData = requestData.formData;
    let requestUrl = requestData.url;
    let body = requestData.body;
    let headers = {};

    if (requestUrl) {
      const currentResponseStatus = this.state.responseStatus;
      const currentAuthType = this.state.authType;

      switch (requestMethod) {
        case 'POST':
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
          if (contentType !== 'none') {
            headers['Content-type'] = contentType;
          }

          if (contentType === 'multipart/form-data') {
            body = formData;
          }

          break;
        case 'GET':
        case 'HEAD':
        case 'OPTIONS':
          body = null;
          break;
        default:
          console.error(`Request method with name ${requestMethod} is not supported!`);
          break;
      }

      if (this.isAuthorizationRequest(currentResponseStatus) && currentAuthType === 'ntlm') {
        const host = url.parse(requestUrl).host;

        try {
          // Send NTLM message 1
          Ntlm.setCredentials(authDomain, authUsername, authPassword);
          let msg1 = Ntlm.createMessage1(host);
          headers['Authorization'] = 'NTLM ' + msg1.toBase64();
          await handleBasicFetch.call(this);

          // Handle NTLM message 2 (received response from NTLM server)
          const ntlmResponseHeader = this.state.responseWwwAuthHeader;
          // DEVNOTE: Fix to handle scenario with no authentifications, if there is no NTLM auth header
          if (ntlmResponseHeader == null || !ntlmResponseHeader.includes('NTLM ')) {
            await handleBasicFetch.call(this);
            return;
          }
          const challenge = Ntlm.getChallenge(ntlmResponseHeader);

          // Send NTLM message 3
          const msg3 = Ntlm.createMessage3(challenge, host);
          headers['Authorization'] = 'NTLM ' + msg3.toBase64();
          await handleBasicFetch.call(this);

        } catch (error) {
          console.error('Error resolving sequence of NTLM fetch requests: ', error);
        }
      } else if (this.isAuthorizationRequest(currentResponseStatus) && currentAuthType === 'digest') {
        const digestResponseHeader = this.state.responseWwwAuthHeader;
        const digest = new Digest(authUsername, authPassword, requestMethod);
        const digestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

        headers['Authorization'] = digestHeader;
        handleBasicFetch.call(this);
      } else if (this.isAuthorizationRequest(currentResponseStatus) && currentAuthType === 'basic') {
        headers['Authorization'] = `Basic ${Base64.encode(`${authUsername}:${authPassword}`)}`;
        handleBasicFetch.call(this);
      } else if (this.isAuthorizationRequest(currentResponseStatus) && currentAuthType === 'kerberos') {
        console.log('NOTE: Kerberos authentification is not supported by this sample!');
      } else {
        // Handle scenario with no authentifications
        handleBasicFetch.call(this);
      }

      function handleBasicFetch() {
        return new Promise((resolve, reject) => {
          fetch(requestUrl, {
            method: requestMethod,
            body: body,
            headers: headers
          })
            .then(response => {
              // Log response object to console
              console.log('fetch response obj:', response);

              let authType = '';
              const responseStatus = response.status;
              const authResponseHeader = response.headers.get('Www-Authenticate');

              if (this.isAuthorizationRequest(responseStatus)) {
                if (authResponseHeader) {
                  authType = this.getAuthTypeByHeader(authResponseHeader);
                }
              }

              this.setState({
                responseStatus,
                responseHeaders: { ...response.headers.map },
                authType,
                responseWwwAuthHeader: authResponseHeader
              });

              return response.text();
            })
            .then(responseText => {
              console.log('fetch response text: ', responseText);
              // DEVNOTE: since we cannot de-allocate blob resources automatically in React Native, so consumers need to explicitly de-allocate it.
              // if (response.bodyUsed && response._bodyBlob && Blob.prototype.isPrototypeOf(response._bodyBlob)) {
              //   response._bodyBlob.close();
              // }
              this.setState({ responseBody: responseText }, () => { resolve(); });
            })
            .catch(error => {
              console.log('fetch error: ', error);
              this.setState({ responseStatus: '0' }, () => { reject(error); });
            })
        });
      }

    }
  }

  handleXmlHttpRequest(requestData) {
    const requestMethod = requestData.methodName;
    const authUsername = requestData.username;
    const authPassword = requestData.password;
    const authDomain = requestData.domain;
    const contentType = requestData.contentType;
    const responseType = requestData.responseType;
    const formData = requestData.formData;
    let requestUrl = requestData.url;
    let body = requestData.body;

    let xhr = new XMLHttpRequest();

    if (requestUrl) {
      xhr.open(requestMethod, requestUrl, true);
      xhr.responseType = responseType;

      const currentResponseStatus = this.state.responseStatus;
      const currentAuthType = this.state.authType;

      switch (requestMethod) {
        case 'POST':
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
          if (contentType !== 'none') {
            xhr.setRequestHeader('Content-type', contentType);
          }

          if (contentType === 'multipart/form-data') {
            body = formData;
          }

          break;
        case 'GET':
        case 'HEAD':
        case 'OPTIONS':
          body = null;
          break;
        default:
          console.error(`Request method with name ${requestMethod} is not supported!`);
          break;
      }

      if (this.isAuthorizationRequest(currentResponseStatus) && currentAuthType === 'ntlm') {
        const host = url.parse(requestUrl).host;

        Ntlm.setCredentials(authDomain, authUsername, authPassword);

        // Send NTLM message 1
        let msg1 = Ntlm.createMessage1(host);
        xhr.setRequestHeader('Authorization', 'NTLM ' + msg1.toBase64());
        sendNtlmMessage1.call(this);

        function sendNtlmMessage1() {
          xhr.onreadystatechange = e => {
            if (xhr.readyState !== 4) {
              return;
            }

            // Handle NTLM message 2 (received response from NTLM server)
            const authResponseHeader = xhr.getResponseHeader('Www-Authenticate');
            // DEVNOTE: Fix to handle scenario with no authentifications, if there is no NTLM auth header
            if (authResponseHeader == null || !authResponseHeader.includes('NTLM ')) {
              basicReadyStateChangeHandler.call(this);
              return;
            }
            const challenge = Ntlm.getChallenge(authResponseHeader);
            // Update response headers from NTLM message2 for showing in UI
            this.setState({
              responseBody: typeof xhr.response === 'string' ? xhr.response : '',
              responseStatus: xhr.status,
              responseHeaders: { ...xhr.responseHeaders },
              responseWwwAuthHeader: authResponseHeader
            });

            // Send NTLM message 3
            const msg3 = Ntlm.createMessage3(challenge, host);
            sendNtlmMessage3.call(this, msg3);
          }

          xhr.send(body);
        }

        function sendNtlmMessage3(msg3) {
          xhr = new XMLHttpRequest();
          xhr.open(requestMethod, requestUrl, true);
          xhr.setRequestHeader('Authorization', 'NTLM ' + msg3.toBase64());

          xhr.onreadystatechange = e => {
            if (xhr.readyState !== 4) {
              return;
            }

            basicReadyStateChangeHandler.call(this);
          };

          xhr.send(body);
        }
      } else if (this.isAuthorizationRequest(currentResponseStatus) && currentAuthType === 'digest') {
        const digestResponseHeader = this.state.responseWwwAuthHeader;
        const digest = new Digest(authUsername, authPassword, requestMethod);
        const digestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

        xhr.setRequestHeader('Authorization', digestHeader);

        xhr.onreadystatechange = e => {
          if (xhr.readyState !== 4) {
            return;
          }
          basicReadyStateChangeHandler.call(this);
        };

        xhr.send(body);
      } else if (this.isAuthorizationRequest(currentResponseStatus) && currentAuthType === 'basic') {
        xhr.setRequestHeader('Authorization', `Basic ${Base64.encode(`${authUsername}:${authPassword}`)}`);

        xhr.onreadystatechange = e => {
          if (xhr.readyState !== 4) {
            return;
          }
          basicReadyStateChangeHandler.call(this);
        };

        xhr.send(body);
      } else {
        // Handle scenario with no authentifications
        xhr.onreadystatechange = e => {
          if (xhr.readyState !== 4) {
            return;
          }
          basicReadyStateChangeHandler.call(this);
        };

        // DEVNOTE: Send request with body, when methodName supports body, in other cases body should be null (e.g. 'GET', OPTION', 'HEAD')
        xhr.send(body);
      }
    }

    function basicReadyStateChangeHandler() {
      let authType = '';
      const responseStatus = xhr.status;
      const authResponseHeader = xhr.getResponseHeader('Www-Authenticate');
      console.log('XHR after received reponse: ', xhr);
      console.log('XHR response', xhr.response);

      if (this.isAuthorizationRequest(responseStatus)) {
        if (authResponseHeader) {
          authType = this.getAuthTypeByHeader(authResponseHeader);
        }
      }

      this.setState({
        responseBody: typeof xhr.response === 'string' ? xhr.response : '',
        responseStatus,
        responseHeaders: { ...xhr.responseHeaders },
        authType,
        responseWwwAuthHeader: authResponseHeader
      });
    }

  }

  isAuthorizationRequest(responseStatus) {
    return responseStatus === 401;
  }

  getAuthTypeByHeader(headerValue) {
    const authHeaderValue = headerValue.toLowerCase();

    if (authHeaderValue.includes('basic')) {
      return 'basic';
    } else if (authHeaderValue.includes('digest')) {
      return 'digest';
    } else if (authHeaderValue.includes('ntlm')) {
      return 'ntlm';
    } else if (authHeaderValue.includes('negotiate')) {
      return 'kerberos';
    } else {
      return '';
    }
  }

  renderActiveTab() {
    let activeTab;

    switch (this.state.activeTab) {
      case 'welcome':
        activeTab = <Text style={styles.welcomeText}>Basic networking</Text>;
        break;
      case 'fetch':
        activeTab = <RequestForm
          responseStatus={this.state.responseStatus}
          method={this.state.activeTab}
          authType={this.state.authType}
          onSubmit={requestData => { this.handleFetch(requestData) }}>
        </RequestForm>;
        break;
      case 'xhr':
        activeTab = <RequestForm
          responseStatus={this.state.responseStatus}
          method={this.state.activeTab}
          authType={this.state.authType}
          onSubmit={requestData => { this.handleXmlHttpRequest(requestData) }}>
        </RequestForm>;
        break;
      default:
        activeTab = null;
        break;
    }

    return activeTab;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>

        <ScrollView
          keyboardShouldPersistTaps='always'
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, margin: 10, marginBottom: 0 }}>

          <View style={styles.container}>
            <View style={styles.stretch}>
              {this.renderActiveTab()}
              {
                this.state.responseStatus !== null ?
                  <ShowResponseResults
                    responseStatus={this.state.responseStatus}
                    responseHeaders={this.state.responseHeaders}
                    responseBody={this.state.responseBody}
                  >
                  </ShowResponseResults>
                  :
                  null
              }
            </View>
          </View>

        </ScrollView>

        <View style={styles.tabsRow}>
          <View style={[
            styles.tabContainer,
            { backgroundColor: this.state.activeTab === 'fetch' ? '#edf4ff' : '#fff' }]}>
            <Button
              onPress={() => { this.onChangeTab('fetch') }}
              title='Fetch'
              color={'#0070cc'} />
          </View>

          <View style={[
            styles.tabContainer,
            styles.tabLastInRow,
            { backgroundColor: this.state.activeTab === 'xhr' ? '#edf4ff' : '#fff' }]}>
            <Button
              onPress={() => { this.onChangeTab('xhr') }}
              title='XHR'
              color={'#0070cc'} />
          </View>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  stretch: {
    alignSelf: 'stretch',
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 25
  },
  tabsRow: {
    flexDirection: 'row',
    width: '100%'
  },
  tabContainer: {
    flex: 1,
    borderColor: '#4486f5',
    borderRightWidth: 1,
    padding: 5
  },
  tabLastInRow: {
    borderRightWidth: 0
  }
});
