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

export default function() {
  describe('SQLite API', function() {
    const defaultFail = function(error) {
      console.log('SQLite error:', error || 'not specified');
      expect(true).toBe(false);
    };

    it('Check SQLite Storage is available', function() {
      expect(SQLite).toBeDefined();
      expect(SQLite.openDatabase).toBeDefined();
      expect(SQLite.deleteDatabase).toBeDefined();
    });

    describe('SQLite database: openDatabase, close, deleteDatabase', function() {

      it('SQLite: openDatabase, close', function(done) {
        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase('testDB1.db', '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          }
        ], function() {
          done();
        });
      });

      it('SQLite: openDatabase at location - default (Library/LocalDatabase), close, deleteDatabase', function(done) {
        const databaseName = 'testLocationDefault.db';
        const databaseLocation = 'default';

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          },
        ], function() {
          done();
        });
      });

      it('SQLite: openDatabase at location - Library, close, deleteDatabase', function(done) {
        const databaseName = 'testLocationLibrary.db';
        const databaseLocation = 'Library';

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          },
        ], function() {
          done();
        });
      });

      it('SQLite: openDatabase at location - Documents, close, deleteDatabase', function(done) {
        const databaseName = 'testLocationDocuments.db';
        const databaseLocation = 'Documents';

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          },
        ], function() {
          done();
        });
      });

      it('SQLite: run 2 times openDatabase for the same database - positive case', function(done) {
        const databaseName = 'testDB2.db';

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase(databaseName, '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null);
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase(databaseName, '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          }
        ], function() {
          done();
        });
      });

      it('SQLite: run 2 times close database for the same database - negative case', function(done) {
        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase('testDB3.db', '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(defaultFail, function(error) {
              const expectedErrorMessage = 'cannot close: database is not open';

              expect(error).toBe(expectedErrorMessage);
              moveToNextFunction(null);
            });
          }
        ], function() {
          done();
        });
      });

      it('SQLite: deleteDatabase', function(done) {
        const databaseName = 'testDBDelete.db';

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase(databaseName, '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            })
          },
          function(moveToNextFunction) {
            SQLite.openDatabase(databaseName, '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
              moveToNextFunction(null);
            }, defaultFail);
          },
        ], function() {
          done();
        });
      });

    });

    describe('SQLite transactions', function() {

      it('SQLite: run transaction with INSERT, SELECT queries', function(done) {
        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            const len = result.rows.length,
              one = 1, two = 2, three = 3, four = 4;

            expect(len).toBe(4);
            expect(result.rows.item(0).id.toString()).toBe(one.toString());
            expect(result.rows.item(0).data).toBe('First row');
            expect(result.rows.item(1).id.toString()).toBe(two.toString());
            expect(result.rows.item(1).data).toBe('Second row');
            expect(result.rows.item(2).id.toString()).toBe(three.toString());
            expect(result.rows.item(2).data).toBe('Third row');
            expect(result.rows.item(3).id.toString()).toBe(four.toString());
            expect(result.rows.item(3).data).toBe('Fourth row');
          },
          errorCB = function(tx, err) {
            expect(true).toBe(false);
          },
          errorTCB = function(tx, err) {
            // DEVNOTE: should not get here
            expect('Transaction should not fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase('testDBBasicTransactions.db', '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          }
        ], function() {
          done();
        });
      });

      it('SQLite: run transaction with INSERT, UPDATE and SELECT queries', function(done) {
        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          }, updateSuccess = function(tx, result) {
            expect(true).toBe(true);
          }
        querySuccess = function(tx, result) {
          const len = result.rows.length,
            one = 1, two = 2, three = 3, four = 4;

          expect(len).toBe(4);
          expect(result.rows.item(0).id.toString()).toBe(one.toString());
          expect(result.rows.item(0).data).toBe('row updated');
          expect(result.rows.item(1).id.toString()).toBe(two.toString());
          expect(result.rows.item(1).data).toBe('row updated');
          expect(result.rows.item(2).id.toString()).toBe(three.toString());
          expect(result.rows.item(2).data).toBe('row updated');
          expect(result.rows.item(3).id.toString()).toBe(four.toString());
          expect(result.rows.item(3).data).toBe('row updated');
        },
          errorCB = function(tx, err) {
            expect(true).toBe(false);
          },
          errorTCB = function(tx, err) {
            expect(true).toBe(false);
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase('testDBBasicTransactions2.db', '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('UPDATE DEMO SET DATA = ?', ['row updated'], updateSuccess, errorCB);
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          }
        ], function() {
          done();
        });
      });

      it('SQLite: run transaction with errors', function(done) {
        const databaseName = 'testDBCheckTransactionWithError.db';

        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            expect(true).toBeFalse(false);
          },
          queryFailure = function(tx, err) {
            expect(tx.message).toContain('syntax error');
          },
          errorCB = function(tx, err) {
            // DEVNOTE: should get here
            expect(tx.message).toContain('syntax error');
          },
          successTCB = function(tx, err) {
            // DEVNOTE: should not get here
            expect('Transaction should fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase(databaseName, '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, '11 row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT *343 FROM DEMO', [], querySuccess, queryFailure);
            }, function(tx, err) {
              // DEVNOTE: Transaction should fail due to syntax error in SQL query
              expect(tx.message).toContain('syntax error');
              moveToNextFunction(null, db);
            }, successTCB);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          }
        ], function() {
          done();
        });
      });

      it("SQLite: run transaction with errors, check transaction wasn't executed", function(done) {
        const databaseName = 'testDBCheckTransactionWithError2.db';

        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            expect(true).toBeFalse(false);
          },
          queryFailure = function(tx, err) {
            expect(tx.message).toContain('syntax error');
          },
          errorCB = function(tx, err) {
            // DEVNOTE: should get here
            expect(tx.message).toContain('syntax error');
          },
          successTCB = function(tx, err) {
            // DEVNOTE: should not get here
            expect('Transaction should fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase(databaseName, '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, '11 row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT *343 FROM DEMO', [], querySuccess, queryFailure);
            }, function(tx, err) {
              // DEVNOTE: Transaction should fail due to syntax error in SQL query
              expect(tx.message).toContain('syntax error');
              moveToNextFunction(null, db);
            }, successTCB);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase(databaseName, '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.transaction(function(tx) {
              tx.executeSql('SELECT * FROM DEMO', [], defaultFail, function(error) {
                const expectedErrorMessage = 'no such table';

                expect(error.message).toContain(expectedErrorMessage);
                moveToNextFunction(null);
              });
            });
          }
        ], function() {
          done();
        });
      });

      it('SQLite: run nested transaction', function(done) {
        const errorTCB = function(tx, err) {
          // DEVNOTE: should not get here
          expect('Transaction should not fail').toBe(true);
          defaultFail();
        };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase('testDBNestedTransaction.db', '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS test_table');
              tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
              tx.executeSql('INSERT INTO test_table (data, data_num) VALUES (?,?)', ['test', 100], function(tx, res) {
                if (res.rowsAffected) {
                  expect(res.rowsAffected).toBe(1);
                } else {
                  expect(true).toBe(false);
                }

                tx.executeSql('SELECT COUNT(id) AS CNT FROM test_table;', [], function(tx, res) {
                  if (res.rows) {
                    expect(res.rows.length).toBe(1);
                  } else {
                    expect(true).toBe(false);
                  }
                });
              });
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          }
        ], function() {
          done();
        });
      });

      it('SQLite: run 2 transactions, second after closing database - negative case', function(done) {
        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase('testDBClosedTransaction.db', '1.0', 'ReactNativeDemo', 200000, function() {
              expect(true).toBe(true);
            }, defaultFail);
            moveToNextFunction(null, db);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS test_table_for_performance');
              tx.executeSql('CREATE TABLE IF NOT EXISTS test_table_for_performance ' +
                '(id integer primary key, data text, data_num integer, name text, age integer, job text)');
              for (let i = 0; i < 2; i += 1) {
                tx.executeSql('INSERT INTO test_table_for_performance (data, data_num, name, age, job) VALUES (?,?,?,?,?)',
                  ['test' + i, i, 'name' + i, 50, 'job' + i]);
              }
            }, defaultFail, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function(success) {
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS test_table_for_performance');
              tx.executeSql('CREATE TABLE IF NOT EXISTS test_table_for_performance ' +
                '(id integer primary key, data text, data_num integer, name text, age integer, job text)');
              for (let i = 0; i < 2; i += 1) {
                tx.executeSql('INSERT INTO test_table_for_performance (data, data_num, name, age, job) VALUES (?,?,?,?,?)',
                  ['test' + i, i, 'name' + i, 50, 'job' + i]);
              }
            }, function(error) {
              const expectedErrorMessage = 'database not open';

              expect(error.message).toBe(expectedErrorMessage);
              moveToNextFunction(null);
            }, function(tx, result) {
              // DEVNOTE: should not get here
              expect('Should fail transaction, when database is already closed').toBe(true);
              defaultFail();
            });
          }
        ], function() {
          done();
        });
      });

    });

    describe('SQLite multiple commands scenarios', function() {

      it('SQLite: location - default: check inserted data exists in database after closing and opening it again', function(done) {
        // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close
        // openDatabase, run transaction (SELECT), close, deleteDatabase
        const databaseName = 'testDBDefault1.db';
        const databaseLocation = 'default';

        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            const len = result.rows.length,
              one = 1, two = 2, three = 3, four = 4;

            expect(len).toBe(4);
            expect(result.rows.item(0).id.toString()).toBe(one.toString());
            expect(result.rows.item(0).data).toBe('First row');
            expect(result.rows.item(1).id.toString()).toBe(two.toString());
            expect(result.rows.item(1).data).toBe('Second row');
            expect(result.rows.item(2).id.toString()).toBe(three.toString());
            expect(result.rows.item(2).data).toBe('Third row');
            expect(result.rows.item(3).id.toString()).toBe(four.toString());
            expect(result.rows.item(3).data).toBe('Fourth row');
          },
          errorCB = function(tx, err) {
            expect(true).toBe(false);
          },
          errorTCB = function(tx, err) {
            // DEVNOTE: should not get here
            expect('Transaction should not fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail();
            });
          }
        ], function() {
          done();
        });
      });

      it('SQLite: location - default: check inserted data does not exist in database after deleting it', function(done) {
        // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close, deleteDatabase
        // openDatabase, transaction (SELECT), close, deleteDatabase
        const databaseName = 'testDBDefault2.db';
        const databaseLocation = 'default';

        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            const len = result.rows.length,
              one = 1, two = 2, three = 3, four = 4;

            expect(len).toBe(4);
            expect(result.rows.item(0).id.toString()).toBe(one.toString());
            expect(result.rows.item(0).data).toBe('First row');
            expect(result.rows.item(1).id.toString()).toBe(two.toString());
            expect(result.rows.item(1).data).toBe('Second row');
            expect(result.rows.item(2).id.toString()).toBe(three.toString());
            expect(result.rows.item(2).data).toBe('Third row');
            expect(result.rows.item(3).id.toString()).toBe(four.toString());
            expect(result.rows.item(3).data).toBe('Fourth row');
          },
          errorCB = function(tx, err) {
            expect(true).toBe(false);
          },
          errorTCB = function(tx, err) {
            expect(true).toBe(false);
            // DEVNOTE: should not get here
            expect('Transaction should not fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail();
            });
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            const expectedErrorMessage = 'no such table: DEMO';

            db.transaction(function(tx) {
              tx.executeSql('SELECT * FROM DEMO', [], defaultFail, function(error) {
                expect(error.message).toContain(expectedErrorMessage);
              });
            }, function(error) {
              expect(error.message).toContain(expectedErrorMessage);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          }
        ], function() {
          done();
        });
      });

      it('SQLite: location - Library: check inserted data exists in database after closing and opening it again', function(done) {
        // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close
        // openDatabase, run transaction (SELECT), close, deleteDatabase
        const databaseName = 'testDBLibrary1.db';
        const databaseLocation = 'Library';

        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            const len = result.rows.length,
              one = 1, two = 2, three = 3, four = 4;

            expect(len).toBe(4);
            expect(result.rows.item(0).id.toString()).toBe(one.toString());
            expect(result.rows.item(0).data).toBe('First row');
            expect(result.rows.item(1).id.toString()).toBe(two.toString());
            expect(result.rows.item(1).data).toBe('Second row');
            expect(result.rows.item(2).id.toString()).toBe(three.toString());
            expect(result.rows.item(2).data).toBe('Third row');
            expect(result.rows.item(3).id.toString()).toBe(four.toString());
            expect(result.rows.item(3).data).toBe('Fourth row');
          },
          errorCB = function(tx, err) {
            expect(true).toBe(false);
          },
          errorTCB = function(tx, err) {
            // DEVNOTE: should not get here
            expect('Transaction should not fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          }
        ], function() {
          done();
        });
      });

      it('SQLite: location - Library: check inserted data does not exist in database after deleting it', function(done) {
        // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close, deleteDatabase
        // openDatabase, transaction (SELECT), close, deleteDatabase
        const databaseName = 'testDBLibrary2.db';
        const databaseLocation = 'Library';

        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            const len = result.rows.length,
              one = 1, two = 2, three = 3, four = 4;

            expect(len).toBe(4);
            expect(result.rows.item(0).id.toString()).toBe(one.toString());
            expect(result.rows.item(0).data).toBe('First row');
            expect(result.rows.item(1).id.toString()).toBe(two.toString());
            expect(result.rows.item(1).data).toBe('Second row');
            expect(result.rows.item(2).id.toString()).toBe(three.toString());
            expect(result.rows.item(2).data).toBe('Third row');
            expect(result.rows.item(3).id.toString()).toBe(four.toString());
            expect(result.rows.item(3).data).toBe('Fourth row');
          },
          errorCB = function(tx, err) {
            expect(true).toBe(false);
          },
          errorTCB = function(tx, err) {
            expect(true).toBe(false);
            // DEVNOTE: should not get here
            expect('Transaction should not fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            const expectedErrorMessage = 'no such table: DEMO';

            db.transaction(function(tx) {
              tx.executeSql('SELECT * FROM DEMO', [], defaultFail, function(error) {
                expect(error.message).toContain(expectedErrorMessage);
              });
            }, function(error) {
              expect(error.message).toContain(expectedErrorMessage);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          }
        ], function() {
          done();
        });
      });

      it('SQLite: location - Documents: check inserted data exists in database after closing and opening it again', function(done) {
        // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close
        // openDatabase, run transaction (SELECT), close, deleteDatabase
        const databaseName = 'testDBDocuments1.db';
        const databaseLocation = 'Documents';

        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            const len = result.rows.length,
              one = 1, two = 2, three = 3, four = 4;

            expect(len).toBe(4);
            expect(result.rows.item(0).id.toString()).toBe(one.toString());
            expect(result.rows.item(0).data).toBe('First row');
            expect(result.rows.item(1).id.toString()).toBe(two.toString());
            expect(result.rows.item(1).data).toBe('Second row');
            expect(result.rows.item(2).id.toString()).toBe(three.toString());
            expect(result.rows.item(2).data).toBe('Third row');
            expect(result.rows.item(3).id.toString()).toBe(four.toString());
            expect(result.rows.item(3).data).toBe('Fourth row');
          },
          errorCB = function(tx, err) {
            expect(true).toBe(false);
          },
          errorTCB = function(tx, err) {
            // DEVNOTE: should not get here
            expect('Transaction should not fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          }
        ], function() {
          done();
        });
      });

      it('SQLite: location - Documents: check inserted data does not exist in database after deleting it', function(done) {
        // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close, deleteDatabase
        // openDatabase, transaction (SELECT), close, deleteDatabase
        const databaseName = 'testDBDocuments2.db';
        const databaseLocation = 'Documents';

        const selectSQLsuccessCB = function(tx, result) {
          expect(true).toBe(true);
        },
          insertSuccess = function(tx, result) {
            if (result.rowsAffected) {
              expect(result.rowsAffected).toBe(1);
            } else {
              expect(true).toBe(false);
            }
          },
          querySuccess = function(tx, result) {
            const len = result.rows.length,
              one = 1, two = 2, three = 3, four = 4;

            expect(len).toBe(4);
            expect(result.rows.item(0).id.toString()).toBe(one.toString());
            expect(result.rows.item(0).data).toBe('First row');
            expect(result.rows.item(1).id.toString()).toBe(two.toString());
            expect(result.rows.item(1).data).toBe('Second row');
            expect(result.rows.item(2).id.toString()).toBe(three.toString());
            expect(result.rows.item(2).data).toBe('Third row');
            expect(result.rows.item(3).id.toString()).toBe(four.toString());
            expect(result.rows.item(3).data).toBe('Fourth row');
          },
          errorCB = function(tx, err) {
            expect(true).toBe(false);
          },
          errorTCB = function(tx, err) {
            expect(true).toBe(false);
            // DEVNOTE: should not get here
            expect('Transaction should not fail').toBe(true);
            defaultFail();
          };

        asyncJS.waterfall([
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            db.transaction(function(tx) {
              tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
              tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
              tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
            }, errorTCB, function() {
              moveToNextFunction(null, db);
            });
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          },
          function(moveToNextFunction) {
            let db;
            db = SQLite.openDatabase({ name: databaseName, location: databaseLocation }, function() {
              expect(true).toBe(true);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            const expectedErrorMessage = 'no such table: DEMO';

            db.transaction(function(tx) {
              tx.executeSql('SELECT * FROM DEMO', [], defaultFail, function(error) {
                expect(error.message).toContain(expectedErrorMessage);
              });
            }, function(error) {
              expect(error.message).toContain(expectedErrorMessage);
              moveToNextFunction(null, db);
            }, defaultFail);
          },
          function(db, moveToNextFunction) {
            expect(db).toBeDefined();
            db.close(function() {
              moveToNextFunction(null);
            }, defaultFail);
          },
          function(moveToNextFunction) {
            SQLite.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
              moveToNextFunction(null);
            }, function(error) {
              // DEVNOTE: should not get here
              expect('Deleting database should not fail').toBe(true);
              defaultFail(error);
            });
          }
        ], function() {
          done();
        });
      });

    });

  });
}
