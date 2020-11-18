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
import { View, ScrollView, Keyboard, KeyboardAvoidingView } from 'react-native';
import ActionButton from '../components/ActionButton';
import TextInfo from '../components/TextInfo';

import { openDatabase, deleteDatabase } from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';

export default class InitDB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: '',
    };
  }

  deteleAndCreateDB = () => {
    Keyboard.dismiss();

    deleteDatabase({ name: 'RNTestDatabase.db', }, () => {
      const db = openDatabase({ name: 'RNTestDatabase.db' }, () => {

        db.transaction(tx => {
          tx.executeSql(`SELECT name FROM sqlite_master WHERE type="table" AND LOWER(name)="users";`, [], (tx, result) => {
            if (result.rows.length === 0) {
              tx.executeSql('DROP TABLE IF EXISTS Users', []);
            }

            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), phone VARCHAR(10), address VARCHAR(255))',
              []
            );

            this.props.navigation.navigate('HomeScreen', { db: db });

          });
        }, error => {
          console.log('Transaction error: ', error);
        }, () => {
          console.log('Transaction for initialization users table is succesfully finished!');
        })

      }, () => {
        console.log('Error in opening database!')
      });

    }, () => {
      console.log('Error in deleteing database!')
    });
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1, paddingTop: 10 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <TextInfo text="Initialize database: delete current database and create new" />
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <ActionButton
              title="Delete"
              customClick={this.deteleAndCreateDB.bind(this)}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}
