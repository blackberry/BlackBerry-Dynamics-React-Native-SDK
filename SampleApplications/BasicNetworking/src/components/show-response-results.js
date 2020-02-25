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
import { StyleSheet, Text, View } from 'react-native';

export default class ShowResponseResults extends Component {
  constructor(props) {
    super(props);
  }

  ResponseHeaders() {
    const responseHeaders = this.props.responseHeaders;

    return Object.keys(responseHeaders).map((value, index) => {
      return (
        <Text
          key={index}
          style={{ paddingVertical: 2, fontWeight: 'bold' }}>
          {value}: <Text style={{ fontWeight: 'normal' }}>{responseHeaders[value]}</Text>
        </Text>
      );
    });
  }

  render() {
    return (
      <View style={{ paddingVertical: 2 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>RESULTS</Text>

        <Text style={styles.responseText}>
          Status code: <Text>{this.props.responseStatus}</Text>
        </Text>

        <Text style={styles.resultTitle}>
          RESPONSE HEADERS:
        </Text>
        <View style={{ paddingVertical: 2 }}>
          {
            this.props.responseHeaders ? this.ResponseHeaders() : null
          }
        </View>

        {/* DEVNOTE: Response body is displayed only for text response */}
        {
          this.props.responseBody && this.props.responseBody.length > 0 ? (
            <View>
              <Text style={styles.resultTitle}>RESPONSE BODY:</Text>
              <Text style={{ padding: 2 }}>{this.props.responseBody}</Text>
            </View>
          )
          :
          null
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  responseText: {
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  resultTitle: {
    padding: 5,
    paddingBottom: 3,
    fontWeight: 'bold'
  }
});
