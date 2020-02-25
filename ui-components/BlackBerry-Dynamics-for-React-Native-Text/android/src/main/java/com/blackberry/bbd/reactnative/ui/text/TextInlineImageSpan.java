/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Text UI component for react-native
 * from https://github.com/facebook/react-native/tree/0.61-stable/ReactAndroid/src/main/java/com/facebook/react/views/text
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * <p>This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 */

package com.blackberry.bbd.reactnative.ui.text;

import javax.annotation.Nullable;

import android.graphics.drawable.Drawable;
import android.text.Spannable;
import android.text.style.ReplacementSpan;
import android.view.View;
import com.good.gd.widget.GDTextView;

import com.facebook.react.views.text.ReactSpan;

/**
 * Base class for inline image spans.
 */
public abstract class TextInlineImageSpan extends ReplacementSpan implements ReactSpan {

    /**
     * For TextInlineImageSpan we need to update the Span to know that the window is attached and
     * the TextView that we will set as the callback on the Drawable.
     *
     * @param spannable The spannable that may contain TextInlineImageSpans
     * @param view The view which will be set as the callback for the Drawable
     */
    public static void possiblyUpdateInlineImageSpans(Spannable spannable, GDTextView view) {
        TextInlineImageSpan[] spans =
                spannable.getSpans(0, spannable.length(), TextInlineImageSpan.class);
        for (TextInlineImageSpan span : spans) {
            span.onAttachedToWindow();
            span.setTextView(view);
        }
    }

    /**
     * Get the drawable that is span represents.
     */
    public abstract @Nullable Drawable getDrawable();

    /**
     * Called by the text view from {@link View#onDetachedFromWindow()},
     */
    public abstract void onDetachedFromWindow();

    /**
     * Called by the text view from {@link View#onStartTemporaryDetach()}.
     */
    public abstract void onStartTemporaryDetach();

    /**
     * Called by the text view from {@link View#onAttachedToWindow()}.
     */
    public abstract void onAttachedToWindow();

    /**
     * Called by the text view from {@link View#onFinishTemporaryDetach()}.
     */
    public abstract void onFinishTemporaryDetach();

    /**
     * Set the textview that will contain this span.
     */
    public abstract void setTextView(GDTextView textView);

    /**
     * Get the width of the span.
     */
    public abstract int getWidth();

    /**
     * Get the height of the span.
     */
    public abstract int getHeight();
}
