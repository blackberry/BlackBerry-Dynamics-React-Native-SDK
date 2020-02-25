# BlackBerry-Dynamics-for-React-Native-SQLite-Storage

`BlackBerry-Dynamics-for-React-Native-SQLite-Storage` secures SQLite database management and is based on the [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage) 3rd party module.

The JavaScript API of this module remains the same however the SQLite database is created in the Dynamics secure container and is managed by secure SQLite API. 

For more details please refer to [com.good.gd.database](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/namespacecom_1_1good_1_1gd_1_1database.html) package on Android and [sqlite3enc](https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/sqlite.html) Dynamics runtime feature on iOS.

## Supportability
#### React Native
 - 0.60.x
 - 0.61.x

## Preconditions
`BlackBerry-Dynamics-for-React-Native-SQLite-Storage` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.
## Installation
> Starting from `0.60` react-native supports auto-linking, so running `$ react-native link ...` command is not required.

    $ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-SQLite-Storage
    $ yarn

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ react-native run-ios
###### Android
    $ react-native run-android

## Usage
```javascript
import {openDatabase} from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';

// ...

const db = openDatabase({ name: 'RNTestDatabase.db' }, () => {
  console.log('Database is succesfully opened!')
}, () => { 
  console.log('Error in opening database!')
});

// ...

db.transaction(tx => {
  tx.executeSql(`SELECT name FROM sqlite_master WHERE type="table" AND name="Users";`, [], (tx, result) => {
    if (result.rows.length === 0) {
      tx.executeSql('DROP TABLE IF EXISTS Users', []);
    }

    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), phone INT(10), address VARCHAR(255))',
      []
    );

  });
}, error => {
  console.log('Transaction error: ', error);
}, () => {
  console.log('Transaction for initialization users table is succesfully finished!');
})

// ...
```

## Uninstallation
    $ cd <appFolder>
    $ react-native uninstall BlackBerry-Dynamics-for-React-Native-SQLite-Storage

###### iOS
    $ cd ios
    $ pod install
    $ cd ..

## Known limitations
#### Importing pre-populated DB is not supported
Importing pre-populated DB as described [here](https://github.com/andpor/react-native-sqlite-storage#importing-a-pre-populated-database) is not supported as for now.
As a workaround some query can be executed against newly created DB to fill-in the data.