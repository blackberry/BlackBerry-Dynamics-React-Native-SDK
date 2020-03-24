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
 *
 * Sample code for React Native SQLite Storage: https://aboutreact.com/example-of-sqlite-database-in-react-native/ 
 */
 
import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';

import ActionButton from '../components/ActionButton';
import TextInfo from '../components/TextInfo';

import {openDatabase} from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';
const db = openDatabase({ name: 'RNTestDatabase.db', }, () => {
  console.log('Database is succesfully opened!')
}, () => { 
  console.log('Error in opening database!')
});

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.setupTableUsers();
  }

  setupTableUsers() {
    db.transaction(tx => {
      tx.executeSql(`SELECT name FROM sqlite_master WHERE type="table" AND name="Users";`, [], (tx, result) => {
        if (result.rows.length === 0) {
          tx.executeSql('DROP TABLE IF EXISTS Users', []);
        }

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), phone VARCHAR(10), address VARCHAR(255))',
          []
        );

      });
    }, error => {
      console.log('Transaction error: ', error);
    }, () => {
      console.log('Transaction for initialization users table is succesfully finished!');
    })
  }

  render() {
    return (
    <View style={{flex: 1, backgroundColor: 'white', flexDirection: 'column', paddingTop: 10}}>
      <TextInfo text="Users" />
      <ActionButton
        title="Add"
        customClick={() => this.props.navigation.navigate('Add')}
      />
      <ActionButton
        title="Update"
        customClick={() => this.props.navigation.navigate('Update')}
      />
      <ActionButton
        title="View"
        customClick={() => this.props.navigation.navigate('View')}
      />
      <ActionButton
        title="View All"
        customClick={() => this.props.navigation.navigate('ViewAll')}
      />
      <ActionButton
        title="Delete"
        customClick={() => this.props.navigation.navigate('Delete')}
      />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
