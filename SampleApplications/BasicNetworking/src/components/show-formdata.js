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

export default class ShowFormdata extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.title}>FORM DATA</Text>
        <View style={{ marginVertical: 2 }}>
          {
            this.props.formDataList.map((item, index) => {
              return (
                <View key={index}>
                  <Text style={styles.result}>"{item.fieldName}" : "{item.string}"</Text>
                </View>
              )
            })
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 4,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  result: {
    fontSize: 14,
    padding: 2
  }
});
