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
import { View, ScrollView, Keyboard, Platform } from 'react-native';
import ActionButton from '../components/ActionButton';
import TextInfo from '../components/TextInfo';
import SelectItems from '../components/SelectItems.js';

import { openDatabase, deleteDatabase } from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';

export default class ImportDB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: '1',
    };
  }

  importDB = () => {
    const { path } = this.state;

    Keyboard.dismiss();

    if (path) {

      deleteDatabase({ name: 'RNTestDatabase.db', }, () => {
        console.log('Database is succesfully deleted!');

        const db = openDatabase({ name: 'RNTestDatabase.db', createFromLocation: path, }, () => {
          this.props.navigation.navigate('HomeScreen', { db: db });
        }, () => {
          console.log('Error in opening database!')
        });

      }, () => {
        console.log('Error in deleteing database!')
      });

    } else {
      alert('ERROR: Please select path for createFromLocation');
    }
  }

  render() {
    let items = [
      { label: 'case 1: assets/www', value: '1' },
      { label: 'case 2: assets/data', value: '~data/other.sqlite' }
    ];
    if (Platform.OS == 'android') {
      items.push(
        { label: 'case 3: /data', value: 'data/external.db' }
      );
    }

    return (
      <View style={{ backgroundColor: 'white', flex: 1, paddingTop: 10 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <TextInfo text="Import database by createFromLocation: select the path of pre-populated database file for import" />
            <SelectItems
              items={items}
              prompt="Select path for createFromLocation"
              selected={this.state.path}
              onValueChange={value => this.setState({ path: value })}
            />
            <ActionButton
              title="Import pre-populated database"
              customClick={this.importDB.bind(this)}
            />
        </ScrollView>
      </View>
    );
  }
}
