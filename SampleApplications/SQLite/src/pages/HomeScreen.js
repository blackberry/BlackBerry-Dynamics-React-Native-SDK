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
import { StyleSheet, View } from 'react-native';
import RNFS from 'react-native-fs';

import ActionButton from '../components/ActionButton';
import TextInfo from '../components/TextInfo';

import { openDatabase } from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: null
    }
    this.initDb();
    this.setupData();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.navigation.state.params && props.navigation.state.params.db) {
      return { db: props.navigation.state.params.db };
    }
    return false;
  }

  initDb() {
    if (this.props.navigation.state.params && this.props.navigation.state.params.db) {
      this.setState({ db: this.props.navigation.state.params.db }, () => {
        this.setupTableUsers();
      });
    } else {
      const db = openDatabase({ name: 'RNTestDatabase.db' }, () => {
        this.setState({ db: db }, () => {
          this.setupTableUsers();
        })
      }, () => {
        console.log('Error in opening database!');
      });
    }

  }

  setupTableUsers() {
    this.state.db.transaction(tx => {
      tx.executeSql(`SELECT name FROM sqlite_master WHERE type="table" AND LOWER(name)="users";`, [], (tx, result) => {
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

  setupData() {
    if (Platform.OS == "android") {
      const assetsPath = 'www/misc/external.db';
      const importPath = '/data/external.db';
      const importDirectory = '/data';
      const copyDestPath = `${RNFS.DocumentDirectoryPath}${importPath}`;

      RNFS.mkdir(`${RNFS.DocumentDirectoryPath}${importDirectory}`).finally(() => {
        RNFS.unlink(copyDestPath).finally(() => {
          RNFS.copyFileAssets(assetsPath, copyDestPath)
            .then(() => {
              // success
              console.log('RNFS.copyFileAssets() succesfully finished');
            })
            .catch(error => {
              console.log('RNFS.copyFileAssets() failed: ', error);
            });
        });
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', paddingTop: 10 }}>
        <TextInfo text="Users" />
        <ActionButton
          title="Add Item"
          customClick={() => this.props.navigation.navigate('Add', { db: this.state.db })}
        />
        <ActionButton
          title="Update Item"
          customClick={() => this.props.navigation.navigate('Update', { db: this.state.db })}
        />
        <ActionButton
          title="View Item"
          customClick={() => this.props.navigation.navigate('View', { db: this.state.db })}
        />
        <ActionButton
          title="View All"
          customClick={() => this.props.navigation.navigate('ViewAll', { db: this.state.db })}
        />
        <ActionButton
          title="Delete Item"
          customClick={() => this.props.navigation.navigate('Delete', { db: this.state.db })}
        />
        <ActionButton
          title="Import DB"
          customClick={() => this.props.navigation.navigate('ImportDB', { db: this.state.db })}
        />
        <ActionButton
          title="Initialize DB"
          customClick={() => this.props.navigation.navigate('InitDB', { db: this.state.db })}
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
