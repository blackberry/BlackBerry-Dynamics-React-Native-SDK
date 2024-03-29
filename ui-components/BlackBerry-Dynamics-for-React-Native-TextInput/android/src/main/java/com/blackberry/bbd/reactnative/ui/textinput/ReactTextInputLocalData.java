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

import android.os.Build;
import android.text.SpannableStringBuilder;
import android.util.TypedValue;
import com.good.gd.widget.GDEditText;

/** Local state bearer for EditText instance. */
public final class ReactTextInputLocalData {

  private final SpannableStringBuilder mText;
  private final float mTextSize;
  private final int mMinLines;
  private final int mMaxLines;
  private final int mInputType;
  private final int mBreakStrategy;
  private final CharSequence mPlaceholder;

  public ReactTextInputLocalData(GDEditText editText) {
    mText = new SpannableStringBuilder(editText.getText());
    mTextSize = editText.getTextSize();
    mInputType = editText.getInputType();
    mPlaceholder = editText.getHint();
    mMinLines = editText.getMinLines();
    mMaxLines = editText.getMaxLines();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      mBreakStrategy = editText.getBreakStrategy();
    } else {
      mBreakStrategy = 0;
    }
  }

  public void apply(GDEditText editText) {
    editText.setText(mText);
    editText.setTextSize(TypedValue.COMPLEX_UNIT_PX, mTextSize);
    editText.setMinLines(mMinLines);
    editText.setMaxLines(mMaxLines);
    editText.setInputType(mInputType);
    editText.setHint(mPlaceholder);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      editText.setBreakStrategy(mBreakStrategy);
    }
  }
}
