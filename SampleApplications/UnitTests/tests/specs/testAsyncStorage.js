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
 
import AsyncStorage from 'BlackBerry-Dynamics-for-React-Native-Async-Storage';

export default function() {
  describe('AsyncStorage API', function() {

    beforeEach(async function() {
      // DEVNOTE: clear AsyncStorage before running each spec
      try {
        await AsyncStorage.clear();
      } catch (error) {
        // console.log('Async Storage: storage had been already cleared or clear error appeared!');
      }
    });

    it('Check AsyncStorage is available', function() {
      expect(AsyncStorage).toBeDefined();
    });

    it('Check AsyncStorage API', function() {
      let isAvailableAllAsyncStorageMethods = true;
      let AsyncStorageAPI = [];

      const asyncStorageMethodsMock = [
        'getItem',
        'setItem',
        'removeItem',
        'mergeItem',
        'clear',
        'getAllKeys',
        'flushGetRequests',
        'multiGet',
        'multiSet',
        'multiRemove',
        'multiMerge'
      ];

      for (key in AsyncStorage) {
        AsyncStorageAPI.push(key);
      }

      for (let i = 0; i < asyncStorageMethodsMock.length; i++) {
        if (!AsyncStorageAPI.includes(asyncStorageMethodsMock[i])) {
          isAvailableAllAsyncStorageMethods = false;
          break;
        }
      }

      expect(isAvailableAllAsyncStorageMethods).toBe(true);
    });

    it('AsyncStorage: getItem - not existing key', async function() {
      const key = '@Some_not_existing_key';

      const keyValue = await AsyncStorage.getItem(key);
      expect(keyValue).toBeNull();
    });

    it('AsyncStorage: setItem, getItem', async function() {
      const key = '@Good_item';
      const value = 'Some good description';

      await AsyncStorage.setItem(key, value);
      const item = await AsyncStorage.getItem(key);

      expect(item).toEqual('Some good description');
    });

    it('AsyncStorage: setItem, getItem - empty string key', async function() {
      await AsyncStorage.setItem(' ', ' ');
      const item = await AsyncStorage.getItem(' ');

      expect(item).toEqual(' ');
    });

    it('AsyncStorage: setItem, getItem - one symbol key, empty value', async function() {
      await AsyncStorage.setItem('@', '');
      const item = await AsyncStorage.getItem('@');

      expect(item).toBeNull();
    });

    it('AsyncStorage: setItem, getItem - one symbol key, not empty value', async function() {
      await AsyncStorage.setItem('@', 'item value');
      const item = await AsyncStorage.getItem('@');

      expect(item).toBe('item value');
    });

    it('AsyncStorage: setItem, getItem - two symbols key, not empty value', async function() {
      await AsyncStorage.setItem('@k', 'item value');
      const item = await AsyncStorage.getItem('@k');

      expect(item).toBe('item value');
    });

    it('AsyncStorage: mergeItem', async function() {
      const userKey = '@User';
      const user1 = {
        name: 'Tom',
        age: 20,
        traits: {
          hair: 'black',
          eyes: 'blue'
        }
      };
      const user2 = {
        name: 'Sarah',
        age: 21,
        hobby: 'cars',
        traits: {
          eyes: 'green'
        }
      };
      const expectedUserValue = '{"age":21,"hobby":"cars","name":"Sarah","traits":{"hair":"black","eyes":"green"}}';
      const expectedUserValueObj = JSON.parse(expectedUserValue);

      await AsyncStorage.setItem(userKey, JSON.stringify(user1));
      await AsyncStorage.mergeItem(userKey, JSON.stringify(user2))

      const mergedUserValue = await AsyncStorage.getItem(userKey);
      expect(mergedUserValue).not.toBeNull();
      const mergedUserValueObj = JSON.parse(mergedUserValue);
      expect(mergedUserValueObj).toEqual(expectedUserValueObj);
    });

    it('AsyncStorage: removeItem, negative case - not existing key', async function() {
      const keyToRemove = '@Not_existing_key';
      const expectedKeys = await AsyncStorage.getAllKeys();
      expect(expectedKeys).toEqual([]);

      try {
        await AsyncStorage.removeItem(keyToRemove);
      } catch (error) {
        // DEVNOTE: should not get here
        expect(true).toBe(false);
      }

      const currentKeys = await AsyncStorage.getAllKeys();
      expect(currentKeys).toEqual([]);
    });

    it('AsyncStorage: removeItem, positive case - existing key', async function() {
      const key = '@Key_to_remove'
      const value = 'test key value';

      await AsyncStorage.setItem(key, value);
      const currentValue = await AsyncStorage.getItem(key);
      expect(currentValue).toBe(value);

      await AsyncStorage.removeItem(key);

      const valueAfterRemoveItem = await AsyncStorage.getItem(key);
      expect(valueAfterRemoveItem).toBeNull();
    });

    it('AsyncStorage: getAllKeys', async function() {
      const key1 = '@Test_key1';
      const value1 = 'Test value for key 1';
      const key2 = '@Test_key2';
      const value2 = 'Test value for key 2';
      const key3 = '@Test_key3';
      const value3 = 'Test value for key 3';

      // Set first item
      await AsyncStorage.setItem(key1, value1);
      const item1Value = await AsyncStorage.getItem(key1);
      expect(item1Value).toBe(value1);

      // Set second item
      await AsyncStorage.setItem(key2, value2);
      const item2Value = await AsyncStorage.getItem(key2);
      expect(item2Value).toBe(value2);

      // Set third item
      await AsyncStorage.setItem(key3, value3);
      const item3Value = await AsyncStorage.getItem(key3);
      expect(item3Value).toBe(value3);

      const keysResult = await AsyncStorage.getAllKeys();
      expect(keysResult.includes(key1)).toBe(true);
      expect(keysResult.includes(key2)).toBe(true);
      expect(keysResult.includes(key3)).toBe(true);
    });

    it('AsyncStorage: clear', async function() {
      const key1 = '@Test_key1';
      const value1 = 'Test value for key 1';

      await AsyncStorage.setItem(key1, value1);
      const item1Value = await AsyncStorage.getItem(key1);
      expect(item1Value).toBe(value1);

      await AsyncStorage.clear();
      const item1ValueAfterStorageClear = await AsyncStorage.getItem(key1);
      expect(item1ValueAfterStorageClear).toBeNull();

      const keysResult = await AsyncStorage.getAllKeys();
      expect(keysResult).toEqual([]);
    });

    it('AsyncStorage: multiGet', async function() {
      const key1 = '@Test_key1';
      const value1 = 'Test value for key 1';
      const key2 = '@Test_key2';
      const value2 = 'Test value for key 2';
      const key3 = '@Test_key3';
      const value3 = 'Test value for key 3';

      // Set first item
      await AsyncStorage.setItem(key1, value1);
      const item1Value = await AsyncStorage.getItem(key1);
      expect(item1Value).toBe(value1);

      // Set second item
      await AsyncStorage.setItem(key2, value2);
      const item2Value = await AsyncStorage.getItem(key2);
      expect(item2Value).toBe(value2);

      // Set third item
      await AsyncStorage.setItem(key3, value3);
      const item3Value = await AsyncStorage.getItem(key3);
      expect(item3Value).toBe(value3);

      const values = await AsyncStorage.multiGet([key1, key2, key3]);
      const [firstKeyValue, secondKeyValue, thirdKeyValue] = values;

      expect(firstKeyValue[0]).toBe(key1);
      expect(firstKeyValue[1]).toBe(value1);
      expect(secondKeyValue[0]).toBe(key2);
      expect(secondKeyValue[1]).toBe(value2);
      expect(thirdKeyValue[0]).toBe(key3);
      expect(thirdKeyValue[1]).toBe(value3);
    });

    it('AsyncStorage: multiSet', async function() {
      const key1 = '@Test_multiSet_key1';
      const value1 = 'Test value for key 1';
      const key2 = '@Test_multiSet_key2';
      const value2 = 'Test value for key 2';
      const key3 = '@Test_multiSet_key3';
      const value3 = 'Test value for key 3';
      const firstPair = [key1, value1];
      const secondPair = [key2, value2];
      const thirdPair = [key3, value3];

      await AsyncStorage.multiSet([ firstPair, secondPair, thirdPair ]);

      // Get first pair
      const item1Value = await AsyncStorage.getItem(key1);
      expect(item1Value).toBe(value1);

      // Get second pair
      const item2Value = await AsyncStorage.getItem(key2);
      expect(item2Value).toBe(value2);

      // Get third pair
      const item3Value = await AsyncStorage.getItem(key3);
      expect(item3Value).toBe(value3);
    });

    it('AsyncStorage: multiMerge', async function() {
      const user1 = {
        name: 'Tom',
        age: 30,
        traits: { hair: 'brown' },
      };
      const user1Delta = {
        age: 31,
        traits: { eyes: 'blue' },
      };
      const user2 = {
        name: 'Sarah',
        age: 25,
        traits: { hair: 'black' },
      };
      const user2Delta = {
        age: 26,
        traits: { hair: 'green' },
      };
      const user1Key = '@Test_USER_1';
      const user2Key = '@Test_USER_2';

      const multiSet = [
        [user1Key, JSON.stringify(user1)],
        [user2Key, JSON.stringify(user2)]
      ];
      const multiMerge = [
        [user1Key, JSON.stringify(user1Delta)],
        [user2Key, JSON.stringify(user2Delta)]
      ];

      await AsyncStorage.multiSet(multiSet);
      await AsyncStorage.multiMerge(multiMerge);

      const multiMerged = await AsyncStorage.multiGet([user1Key, user2Key]);
      const [multiMergedUser1, multiMergedUser2] = multiMerged;
      expect(multiMergedUser1[0]).toBe(user1Key);
      expect(multiMergedUser1[1]).toBe('{"name":"Tom","age":31,"traits":{"hair":"brown","eyes":"blue"}}');
      expect(multiMergedUser2[0]).toBe(user2Key);
      expect(multiMergedUser2[1]).toBe('{"name":"Sarah","age":26,"traits":{"hair":"green"}}');
    });

    it('AsyncStorage: multiRemove', async function() {
      const key1 = '@Test_key1';
      const value1 = 'Test value for key 1';
      const key2 = '@Test_key2';
      const value2 = 'Test value for key 2';

      // Set first item
      await AsyncStorage.setItem(key1, value1);
      const item1Value = await AsyncStorage.getItem(key1);
      expect(item1Value).toBe(value1);

      // Set second item
      await AsyncStorage.setItem(key2, value2);
      const item2Value = await AsyncStorage.getItem(key2);
      expect(item2Value).toBe(value2);

      await AsyncStorage.multiRemove([key1, key2]);

      const item1AfterRemoveValue = await AsyncStorage.getItem(key1);
      const item2AfterRemoveValue = await AsyncStorage.getItem(key2);
      expect(item1AfterRemoveValue).toBeNull();
      expect(item2AfterRemoveValue).toBeNull();
    });

    it('AsyncStorage: flushGetRequests', async function() {
      // DEVNOTE: check flushGetRequests returns undefined and doesn't throw an exception
      const flushGetRequestsResult = await AsyncStorage.flushGetRequests();
      expect(flushGetRequestsResult).toBeUndefined();
    });

  });
};
