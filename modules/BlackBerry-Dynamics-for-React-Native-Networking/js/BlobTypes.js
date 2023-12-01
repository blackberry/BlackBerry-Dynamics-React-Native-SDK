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

'use strict';

export opaque type BlobCollector = {...};

export type BlobData = {
  blobId: string,
  offset: number,
  size: number,
  name?: string,
  type?: string,
  lastModified?: number,
  __collector?: ?BlobCollector,
  ...
};

export type BlobOptions = {
  type: string,
  lastModified: number,
  ...
};
