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
import { FlatList, Text, View } from 'react-native';

export default class ViewUsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: [],
      database: this.props.navigation.state.params.db
    };

    this.viewUsers()

  }

  viewUsers() {
    this.state.database.transaction(tx => {
      tx.executeSql('SELECT * FROM Users', [], (tx, results) => {
        let users = [];
        for (let i = 0; i < results.rows.length; ++i) {
          console.log('User:', results.rows.item(i));
          users.push(results.rows.item(i));
        }
        this.setState({
          usersList: users
        });
      });
    });
  }

  render() {
    return (
      <View style={{ paddingTop: 10 }}>
        <FlatList
          data={this.state.usersList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item.id} style={{ backgroundColor: 'white', padding: 10 }}>
              <Text>Id: {item.id}</Text>
              <Text>Name: {item.username}</Text>
              <Text>Phone: {item.phone}</Text>
              <Text>Address: {item.address}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}
