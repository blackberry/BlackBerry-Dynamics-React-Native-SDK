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
import { View, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';

import FormInput from '../components/FormInput';
import ActionButton from '../components/ActionButton';

export default class UpdateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputUserId: '',
      username: '',
      phone: '',
      address: '',
      showUpdateUserForm: false,
      database: this.props.navigation.state.params.db
    };
  }

  searchUser = () => {
    const { inputUserId } = this.state;

    this.state.database.transaction(tx => {
      tx.executeSql('SELECT * FROM Users where id = ?', [inputUserId], (tx, results) => {

          if (results.rows.length > 0) {
            const { username, phone, address } = results.rows.item(0);
            this.setState({
              username,
              phone,
              address,
              showUpdateUserForm: true
            });
          } else {
            alert('User is not found');
            this.setState({
              username: '',
              phone: '',
              address: '',
              showUpdateUserForm: false
            });
          }
        }
      );
    });
  };

  updateUser = () => {
    var that = this;
    const { inputUserId, username, phone, address } = this.state;

    if (username) {
      if (phone) {
        if (address) {
          this.state.database.transaction(tx => {
            tx.executeSql(
              'UPDATE Users set username=?, phone=?, address=? where id=?', [username, phone, address, inputUserId],
              (tx, results) => {
                console.log('Results',results.rowsAffected);
                if (results.rowsAffected > 0) {
                  Alert.alert('Success', 'User is successfully updated',
                    [
                      {text: 'Ok', onPress: () => that.props.navigation.navigate('HomeScreen')},
                    ],
                    { cancelable: false }
                  );
                } else {
                  alert('ERROR: Failed to update user');
                }
              }
            );
          });
        } else {
          alert('ERROR: Please, fill in Address');
        }
      } else {
        alert('ERROR: Please, fill in Phone');
      }
    } else {
      alert('ERROR: Please, fill in Name');
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
              placeholder="User Id"
              style={{ padding: 10 }}
              onChangeText={inputUserId => this.setState({ inputUserId })}
            />
            <ActionButton
              title="Search"
              customClick={this.searchUser.bind(this)}
            />

            {
              this.state.showUpdateUserForm ?
                (
                  <View>
                    <FormInput
                      placeholder="Name"
                      value={this.state.username}
                      style={{ padding: 10 }}
                      onChangeText={username => this.setState({ username })}
                    />
                    <FormInput
                      placeholder="Phone"
                      value={''+ this.state.phone}
                      onChangeText={phone => this.setState({ phone })}
                      maxLength={10}
                      style={{ padding: 10 }}
                      keyboardType="numeric"
                    />
                    <FormInput
                      value={this.state.address}
                      placeholder="Address"
                      onChangeText={address => this.setState({ address })}
                      maxLength={225}
                      numberOfLines={5}
                      multiline={true}
                      style={{textAlignVertical : 'top', padding: 10}}
                    />
                    <ActionButton
                      title="Update"
                      customClick={this.updateUser.bind(this)}
                    />
                  </View>
                )
                :
                null
            }
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}
