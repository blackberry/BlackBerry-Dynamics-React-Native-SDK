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
import { Text, View } from 'react-native';

import FormInput from '../components/FormInput';
import ActionButton from '../components/ActionButton';

export default class ViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputUserId: '',
      userData: '',
      database: this.props.navigation.state.params.db
    };
  }

  searchUser = () => {
    const { inputUserId } = this.state;

    this.state.database.transaction(tx => {
      tx.executeSql('SELECT * FROM Users where id = ?', [inputUserId], (tx, results) => {

          if (results.rows.length > 0) {
            this.setState({
              userData: results.rows.item(0),
            });
          } else {
            alert('User is not found!');
            this.setState({
              userData: '',
            });
          }

        }
      );
    });

  };

  render() {
    return (
      <View style={{paddingTop: 10}}>
        <FormInput
          placeholder="User Id"
          onChangeText={inputUserId => this.setState({ inputUserId })}
          style={{ padding: 10 }}
        />
        <ActionButton
          title="Search"
          customClick={this.searchUser.bind(this)}
        />

        {
          this.state.userData ? 
            (
              <View style={{ marginLeft: 35, marginRight: 35, marginTop: 10 }}>
                <Text>Id: {this.state.userData.id}</Text>
                <Text>Name: {this.state.userData.username}</Text>
                <Text>Phone: {this.state.userData.phone}</Text>
                <Text>Address: {this.state.userData.address}</Text>
              </View>
            )
            :
            null
        }

      </View>
    );
  }
}
