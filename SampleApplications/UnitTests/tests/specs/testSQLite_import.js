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

import SQLite from 'BlackBerry-Dynamics-for-React-Native-SQLite-Storage';

import asyncJS from 'async';

import { Platform } from 'react-native';

import RNFS from 'react-native-fs';

export default function() {
  describe('SQLite import test', function() {
    const defaultFail = function(error) {
      console.log('SQLite error:', error || 'not specified');
      expect(true).toBe(false);
    },
      errorCB = function(tx, err) {
        expect(true).toBe(false);
    },
      errorTCB = function(tx, err) {
        // DEVNOTE: should not get here
        expect('Transaction should not fail').toBe(true);
        defaultFail();
    };

    it('Check SQLite Storage is available', function() {
      expect(SQLite).toBeDefined();
      expect(SQLite.openDatabase).toBeDefined();
      expect(SQLite.deleteDatabase).toBeDefined();
    });


    it('Import SQL database case 1, createFromLocation: 1', function(done) {
      const databaseName = 'testDB.db';
      const path = '1';

      asyncJS.waterfall([
        function(moveToNextFunction) {
          SQLite.deleteDatabase({ name: databaseName, },  function() {
            moveToNextFunction(null);
          }, function(error) {
            moveToNextFunction(null);
          });
        },
        function(moveToNextFunction) {
          let db;
          db = SQLite.openDatabase({ name: databaseName, createFromLocation: path }, function() {
            expect(true).toBe(true);
            moveToNextFunction(null, db);
          }, defaultFail);
        },
        function(db, moveToNextFunction) {
          expect(db).toBeDefined();

          db.transaction(function(tx) {
              tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function(tx, result) {
                  const expectedTableName = "demo";

                  expect(result.rows.item(0)).toBeDefined();
                  expect(result.rows.item(0).name).toBe(expectedTableName);
              }, errorCB);

              tx.executeSql("SELECT * FROM demo", [], function(tx, result) {
                  const expectedDbDataList = [
                      {
                          id: 1,
                          name: "SqLite",
                          hint: "is a relational database management system contained in a C programming library"
                      },
                      {
                          id: 2,
                          name: "jQuery",
                          hint: "is a cross-platform JavaScript library designed to simplify the client-side scripting of HTML"
                      },
                      {
                          id: 3,
                          name: "HTML5",
                          hint: "is a core technology markup language of the Internet used for structuring and presenting content for the World Wide Web"
                      }
                  ];

                  expect(result.rows.length).toBe(expectedDbDataList.length);
                  expect(result.rows.item(0)).toBeDefined();
                  expect(result.rows.item(0)).toEqual(expectedDbDataList[0]);
                  expect(result.rows.item(1)).toBeDefined();
                  expect(result.rows.item(1)).toEqual(expectedDbDataList[1]);
                  expect(result.rows.item(2)).toBeDefined();
                  expect(result.rows.item(2)).toEqual(expectedDbDataList[2]);
              }, errorCB);

          }, errorTCB, function() {
              moveToNextFunction(null, db);
          });

        }
      ], function() {
        done();
      });
    });

    [
      {
        title: "import DB in www",
        src: '~anothername.db',
        dest: 'otherDB1.db',
        table: "demo1"
      } ,
      {
        title: "import DB in www/data",
        src: '~data/otherDB.sqlite',
        dest: 'otherDB2.db',
        table: "demo2"
      } ,
      {
        title: "import DB with extension .bin in file name",
        src: '~database.bin',
        dest: 'otherDB3.db',
        table: "demo3"
      } ,
      {
        title: "import DB in long path",
        src: '~path1/path2/path3/otherDB4.db',
        dest: 'otherDB4.db',
        table: "demo4"
      } ,
    ].forEach(testSet => {
      it('Import SQL database case 2, createFromLocation: ~, ' + testSet.title, function(done) {
        const databaseName = testSet.dest;
        const path = testSet.src;

        asyncJS.waterfall([
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, },  function() {
              moveToNextFunction(null);
            }, function(error) {
              moveToNextFunction(null);
            });
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, createFromLocation: path }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();

            db.transaction(function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function(tx, result) {
                    const expectedTableName = testSet.table;

                    expect(result.rows.item(0)).toBeDefined();
                    expect(result.rows.item(0).name).toBe(expectedTableName);
                }, errorCB);

                tx.executeSql("SELECT * FROM " + testSet.table, [], function(tx, result) {
                    const expectedDbDataList = [
                        {
                            id: 1,
                            name: "SqLite",
                            hint: "is a relational database management system contained in a C programming library"
                        },
                        {
                            id: 2,
                            name: "jQuery",
                            hint: "is a cross-platform JavaScript library designed to simplify the client-side scripting of HTML"
                        },
                        {
                            id: 3,
                            name: "HTML5",
                            hint: "is a core technology markup language of the Internet used for structuring and presenting content for the World Wide Web"
                        }
                    ];

                    expect(result.rows.length).toBe(expectedDbDataList.length);
                    expect(result.rows.item(0)).toBeDefined();
                    expect(result.rows.item(0)).toEqual(expectedDbDataList[0]);
                    expect(result.rows.item(1)).toBeDefined();
                    expect(result.rows.item(1)).toEqual(expectedDbDataList[1]);
                    expect(result.rows.item(2)).toBeDefined();
                    expect(result.rows.item(2)).toEqual(expectedDbDataList[2]);
                }, errorCB);

            }, errorTCB, function() {
                moveToNextFunction(null, db);
            });

          }
        ], function() {
          done();
        });
      });
    });

    it('Import SQL database case 3, createFromLocation: /', function(done) {
      const databaseName = 'otherDB2.db';
      const assetsPath = 'www/data/otherDB.sqlite';
      const importPath = '/data/tempDB.db';
      const importDirectory = '/data';
      const copyDestPath = `${RNFS.DocumentDirectoryPath}${importPath}`;

      if (Platform.OS != "android") {
        //for ios, not support for now
        pending();
      }

      asyncJS.waterfall([
        function(moveToNextFunction) {
          SQLite.deleteDatabase({ name: databaseName, },  function() {
            moveToNextFunction(null);
          }, function(error) {
            moveToNextFunction(null);
          });
        },
        function(moveToNextFunction) {
          // copy assets db to App Document Directory
          RNFS.mkdir(`${RNFS.DocumentDirectoryPath}${importDirectory}`);
          if (Platform.OS == "android"){
            RNFS.copyFileAssets(assetsPath, copyDestPath)
            .then(() => {
              // success
              moveToNextFunction(null);
            })
            .catch(error => {
              defaultFail(error.message);
            });
          }
        },
        function(moveToNextFunction) {
          let db;
          db = SQLite.openDatabase({ name: databaseName, createFromLocation: importPath }, function() {
            expect(true).toBe(true);
            moveToNextFunction(null, db);
          }, defaultFail);
        },
        function(db, moveToNextFunction) {
          expect(db).toBeDefined();

          db.transaction(function(tx) {
              tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function(tx, result) {
                  const expectedTableName = "demo2";

                  expect(result.rows.item(0)).toBeDefined();
                  expect(result.rows.item(0).name).toBe(expectedTableName);
              }, errorCB);

              tx.executeSql("SELECT * FROM demo2", [], function(tx, result) {
                  const expectedDbDataList = [
                      {
                          id: 1,
                          name: "SqLite",
                          hint: "is a relational database management system contained in a C programming library"
                      },
                      {
                          id: 2,
                          name: "jQuery",
                          hint: "is a cross-platform JavaScript library designed to simplify the client-side scripting of HTML"
                      },
                      {
                          id: 3,
                          name: "HTML5",
                          hint: "is a core technology markup language of the Internet used for structuring and presenting content for the World Wide Web"
                      }
                  ];

                  expect(result.rows.length).toBe(expectedDbDataList.length);
                  expect(result.rows.item(0)).toBeDefined();
                  expect(result.rows.item(0)).toEqual(expectedDbDataList[0]);
                  expect(result.rows.item(1)).toBeDefined();
                  expect(result.rows.item(1)).toEqual(expectedDbDataList[1]);
                  expect(result.rows.item(2)).toBeDefined();
                  expect(result.rows.item(2)).toEqual(expectedDbDataList[2]);
              }, errorCB);

          }, errorTCB, function() {
              moveToNextFunction(null, db);
          });

        }
      ], function() {
        done();
      });
    });

  });
}

