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
import { View, Alert } from 'react-native';

import FormInput from '../components/FormInput';
import ActionButton from '../components/ActionButton';

export default class DeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputUserId: '',
      database: this.props.navigation.state.params.db
    };
  }

  deleteUser = () => {
    var that = this;
    const { inputUserId } = this.state;

    this.state.database.transaction(tx => {
      tx.executeSql('DELETE FROM Users where id=?', [inputUserId], (tx, results) => {
          console.log('Results', results.rowsAffected);

          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User is successfully deleted',
              [
                {
                  text: 'Ok',
                  onPress: () => that.props.navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else {
            alert('ERROR: Please, enter valid User Id');
          }
        }
      );
    });
  };

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1, paddingTop: 10 }}>
        <FormInput
          placeholder="User Id"
          onChangeText={inputUserId => this.setState({ inputUserId })}
          style={{ padding: 10 }}
        />
        <ActionButton
          title="Delete"
          customClick={this.deleteUser.bind(this)}
        />
      </View>
    );
  }
}
