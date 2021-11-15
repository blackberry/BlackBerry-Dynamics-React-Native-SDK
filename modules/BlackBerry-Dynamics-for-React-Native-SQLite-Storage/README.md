# BlackBerry-Dynamics-for-React-Native-SQLite-Storage

`BlackBerry-Dynamics-for-React-Native-SQLite-Storage` secures SQLite database management and is based on the [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage) 3rd party module.

The JavaScript API of this module remains the same however the SQLite database is created in the Dynamics secure container and is managed by secure SQLite API. 

For more details please refer to [com.good.gd.database](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/namespacecom_1_1good_1_1gd_1_1database.html) package on Android and [sqlite3enc](https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/sqlite.html) Dynamics runtime feature on iOS.

## Supportability
#### React Native
 - 0.63.x (deprecated)
 - 0.64.x
 - 0.65.x
 - 0.66.x (0.66.1 is latest supported)

## Preconditions
`BlackBerry-Dynamics-for-React-Native-SQLite-Storage` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.
## Installation

    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-SQLite-Storage

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

## Importing pre-populated DB
> Importing pre-populated DB as described [here](https://github.com/andpor/react-native-sqlite-storage#importing-a-pre-populated-database) is now supported.

You can import an existing - pre-populated database file into your application. Depending on your instructions in openDatabase call, the module will look at different places to locate your pre-populated database file.

> NOTE: all the cases below are covered in `SampleApplications/SQLite` sample app.
Also, there are useful scripts that allow to copy and link DB files.

#### createFromLocation : 1
If your folder is called `www` and data file is named the same as the `dbName` - `testDB` in this example:
```javascript
import {openDatabase} from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';

const db = openDatabase({name : "testDB", createFromLocation : 1}, okCallback,errorCallback);
```

#### createFromLocation : "~data/<db_path>"
In case if your folder is called `data` rather than `www` or your file name does not match the name of the DB, for example, DB is named `testDB` but the file is `mydbfile.sqlite` which is located in a `data` subdirectory of `www`.
```javascript
import {openDatabase} from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';

const db = openDatabase({name : "testDB", createFromLocation : "~data/mydbfile.sqlite"}, okCallback,errorCallback);
```

#### createFromLocation : "/data/<db_path>" (Android only)
> This option in supported on Android only and is not supported on iOS for now

If your folder is not in application bundle but in app sandbox i.e. downloaded from some remote location. In this case the source file is located in `data` subdirectory of `Documents` location (iOS) or `FilesDir` (Android).
```javascript
import {openDatabase} from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';

const db = openDatabase({name : "testDB", createFromLocation : "/data/mydbfile.sqlite"}, okCallback,errorCallback);
```

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-SQLite-Storage

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
