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

import androidx.annotation.Nullable;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

/** Event emitted by EditText native view when the text selection changes. */
/* package */ class ReactTextInputSelectionEvent extends Event<ReactTextInputSelectionEvent> {

  private static final String EVENT_NAME = "topSelectionChange";

  private int mSelectionStart;
  private int mSelectionEnd;

  @Deprecated
  public ReactTextInputSelectionEvent(int viewId, int selectionStart, int selectionEnd) {
    this(-1, viewId, selectionStart, selectionEnd);
  }

  public ReactTextInputSelectionEvent(
      int surfaceId, int viewId, int selectionStart, int selectionEnd) {
    super(surfaceId, viewId);
    mSelectionStart = selectionStart;
    mSelectionEnd = selectionEnd;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Nullable
  @Override
  protected WritableMap getEventData() {
    WritableMap eventData = Arguments.createMap();

    WritableMap selectionData = Arguments.createMap();
    selectionData.putInt("end", mSelectionEnd);
    selectionData.putInt("start", mSelectionStart);

    eventData.putMap("selection", selectionData);
    return eventData;
  }
}
