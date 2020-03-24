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
import { StyleSheet, View, SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native';

import { SearchBar, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import TextInput from 'BlackBerry-Dynamics-for-React-Native-TextInput';
import Text from 'BlackBerry-Dynamics-for-React-Native-Text';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singleLineInputValue: 'Singleline Editable Input',
      multiLineInputValue: 'Multiline Editable Input: long long long text, veryyy loooooong text',
      searchValue: ''
    };
  }

  updateSingleLineInput = value => {
    this.setState({ singleLineInputValue: value });
  }

  updateSearch = value => {
    this.setState({ searchValue: value });
  }

  testMultiEditableInputOnChange = value => {
    this.setState({ multiLineInputValue: value });
  }

  render() {
    const { searchValue } = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1, paddingHorizontal: 8}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled>
          <ScrollView>
            <Text style={styles.pageTitle}>DLP</Text>
            <Text style={styles.pageHeader}>Basic React Native components</Text>

            <Text style={styles.blockHeader}> Text > Text</Text>
            <Text style={styles.baseText}>
              Text > (All Text-nested elements are inline) :
              <Text selectable> | Text > Selectable Text (NOTE: to make it selectable - place {'<Text>'} inside {'<View>'} tag) | </Text>
              <Text> | Text > Text | </Text>
            </Text>

            <Text style={styles.blockHeader}> View > Text</Text>
            <View>
              <Text selectable>| View > Text (selectable) |</Text>
              <Text>| View > Text (non-selectable) |</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                height: 45,
                padding: 10,
              }}>
              <View style={{backgroundColor: '#4486f5', flex: 0.3}} />
              <View style={{backgroundColor: 'orange', flex: 0.5}} />
              <Text selectable>  Empty {'<View>'} rectangles combination with {'<Text>'}</Text>
            </View>

            <Text style={styles.blockHeader}> TextInput</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder='Singleline Editable Input'
                value={this.state.singleLineInputValue}
                onChangeText={this.updateSingleLineInput}
              />

              <TextInput
                style={styles.input}
                editable={false}
                placeholder='Singleline Non Editable Input'
                value='Singleline Non Editable Input'
              />

              <TextInput
                style={styles.input}
                multiline
                placeholder='Multiline Editable Input'
                value={this.state.multiLineInputValue}
                onChangeText={this.testMultiEditableInputOnChange}
              />

              <TextInput
                style={styles.input}
                editable={false}
                multiline
                placeholder='Multiline Non Editable Input'
                value='Multiline Non Editable Input: long long long text, veryyy loooooong text'
              />
            </View>

            <Text style={styles.pageHeader}>react-native-elements</Text>
            <View>
              <SearchBar
                placeholder="RN-Elements: Search bar"
                onChangeText={this.updateSearch}
                value={searchValue}
              />

              <Input
                placeholder='RN-Elements: Basic input'
              />

              <Input
                placeholder='RN-Elements: Input with icon'
                leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}
              />

              <Input
                placeholder='RN-Elements: Input with custom icon'
                leftIcon={
                  <Icon
                    name='user'
                    size={24}
                    color='black'
                  />
                }
              />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  pageTitle: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 12,
    color: '#4486f5',
    fontSize: 22,
    fontWeight: 'bold'
  },
  pageHeader: {
    paddingVertical: 7,
    fontSize: 18,
    fontWeight: 'bold'
  },
  blockHeader: {
    paddingVertical: 3,
    fontSize: 16,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});
