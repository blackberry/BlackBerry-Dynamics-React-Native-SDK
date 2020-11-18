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
import { View, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';

import FormInput from '../components/FormInput';
import ActionButton from '../components/ActionButton';

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      phone: '',
      address: '',
      database: this.props.navigation.state.params.db
    };
  }

  addUser = () => {
    var that = this;
    const { username, phone, address } = this.state;

    if (username) {
      if (phone) {
        if (address) {
          this.state.database.transaction(function(tx) {
            tx.executeSql('INSERT INTO Users (username, phone, address) VALUES (?,?,?)', [username, phone, address],
              (tx, results) => {
                console.log('Results', results.rowsAffected);

                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'User is successfully added',
                    [
                      {
                        text: 'Ok',
                        onPress: () =>
                          that.props.navigation.navigate('HomeScreen'),
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  alert('ERROR: Failed to add user');
                }
              }
            );
          });
        } else {
          alert('ERROR: Please, fill in address');
        }
      } else {
        alert('ERROR: Please, fill in contact number');
      }
    } else {
      alert('ERROR: Please, fill in name');
    }
  };

  render() {

    return (
      <View style={{ backgroundColor: 'white', flex: 1, paddingTop: 10 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <FormInput
              placeholder="Name"
              onChangeText={username => this.setState({ username })}
              style={{ padding: 10 }}
            />
            <FormInput
              placeholder="Phone"
              onChangeText={phone => this.setState({ phone })}
              maxLength={10}
              keyboardType="numeric"
              style={{ padding: 10 }}
            />
            <FormInput
              placeholder="Address"
              onChangeText={address => this.setState({ address })}
              maxLength={225}
              numberOfLines={5}
              multiline={true}
              style={{ padding: 10 }}
            />
            <ActionButton
              title="Submit"
              customClick={this.addUser.bind(this)}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

