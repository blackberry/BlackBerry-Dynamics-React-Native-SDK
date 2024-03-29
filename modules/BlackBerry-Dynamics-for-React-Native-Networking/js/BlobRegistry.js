/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Blob API of react-native
 * from https://github.com/facebook/react-native/blob/0.70-stable/Libraries/Blob
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

const registry: {[key: string]: number, ...} = {};

const register = (id: string) => {
  if (registry[id]) {
    registry[id]++;
  } else {
    registry[id] = 1;
  }
};

const unregister = (id: string) => {
  if (registry[id]) {
    registry[id]--;
    if (registry[id] <= 0) {
      delete registry[id];
    }
  }
};

const has = (id: string): number | boolean => {
  return registry[id] && registry[id] > 0;
};

module.exports = {
  register,
  unregister,
  has,
};
