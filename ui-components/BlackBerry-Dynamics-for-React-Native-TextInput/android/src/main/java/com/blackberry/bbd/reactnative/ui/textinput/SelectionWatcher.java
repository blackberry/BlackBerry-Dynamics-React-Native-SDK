/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original TextInput UI component for react-native
 * from https://github.com/facebook/react-native/tree/0.70-stable/ReactAndroid/src/main/java/com/facebook/react/views/textinput
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.blackberry.bbd.reactnative.ui.textinput;

/**
 * Implement this interface to be informed of selection changes in the ReactTextEdit This is used by
 * the ReactTextInputManager to forward events from the EditText to JS
 */
interface SelectionWatcher {
  public void onSelectionChanged(int start, int end);
}
