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
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

export default class FormdataForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      data: ''
    }
  }

  onFormdataChange(name, value) {
    this.setState({ [name]: value })
  }

  addFormData() {
    const { key, data } = this.state;

    this.props.onSubmit({ key, data });

    this.setState({
      key: '',
      data: ''
    });
  }

  render() {
    const { key, data } = this.state;

    return (
      <View style={{ marginVertical: 4 }}>
        <Text style={styles.title}>Add key / value</Text>
        <TextInput
          style={styles.input}
          autoCapitalize='none'
          autoCorrect={false}
          placeholder={'key'}
          value={key}
          onChangeText={value => { this.onFormdataChange('key', value) }}>
        </TextInput>
        <TextInput
          style={styles.input}
          autoCapitalize='none'
          autoCorrect={false}
          multiline={true}
          placeholder={'data'}
          value={data}
          onChangeText={value => { this.onFormdataChange('data', value) }}>
        </TextInput>
        <Button
          onPress={() => { this.addFormData(key, data) }}
          title='Add'
          color={'#0070cc'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingVertical: 2,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  input: {
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
    borderColor: '#4486f5',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    margin: 7
  }
});
