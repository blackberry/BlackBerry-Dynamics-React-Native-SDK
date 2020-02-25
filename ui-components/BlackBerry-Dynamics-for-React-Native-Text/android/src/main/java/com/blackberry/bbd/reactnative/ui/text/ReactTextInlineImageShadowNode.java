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

import com.facebook.yoga.YogaNode;
import com.facebook.react.uimanager.LayoutShadowNode;

/**
 * Base class for {@link YogaNode}s that represent inline images.
 */
public abstract class ReactTextInlineImageShadowNode extends LayoutShadowNode {

    /**
     * Build a {@link TextInlineImageSpan} from this node. This will be added to the TextView in
     * place of this node.
     */
    public abstract TextInlineImageSpan buildInlineImageSpan();

    public ReactTextInlineImageShadowNode() {}

}

