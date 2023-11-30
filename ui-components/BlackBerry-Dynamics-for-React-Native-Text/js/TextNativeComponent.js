/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Text UI component for react-native
 * from https://github.com/facebook/react-native/blob/0.70-stable/Libraries/Text/Text.js
 *
* Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import ReactNativeViewAttributes from 'react-native/Libraries/Components/View/ReactNativeViewAttributes';
import UIManager from 'react-native/Libraries/ReactNative/UIManager';
import {type HostComponent} from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass';
import {type ProcessedColorValue} from 'react-native/Libraries/StyleSheet/processColor';
import {type TextProps} from 'react-native/Libraries/Text/TextProps';
import {type PressEvent} from 'react-native/Libraries/Types/CoreEventTypes';

type NativeTextProps = $ReadOnly<{
  ...TextProps,
  isHighlighted?: ?boolean,
  selectionColor?: ?ProcessedColorValue,
  onClick?: ?(event: PressEvent) => mixed,
  // This is only needed for platforms that optimize text hit testing, e.g.,
  // react-native-windows. It can be used to only hit test virtual text spans
  // that have pressable events attached to them.
  isPressable?: ?boolean,
}>;

export const NativeText: HostComponent<NativeTextProps> =
  (createReactNativeComponentClass('AndroidTextBbd', () => ({
    validAttributes: {
      ...ReactNativeViewAttributes.UIView,
      isHighlighted: true,
      isPressable: true,
      numberOfLines: true,
      ellipsizeMode: true,
      allowFontScaling: true,
      maxFontSizeMultiplier: true,
      disabled: true,
      selectable: true,
      selectionColor: true,
      adjustsFontSizeToFit: true,
      minimumFontScale: true,
      textBreakStrategy: true,
      onTextLayout: true,
      onInlineViewLayout: true,
      dataDetectorType: true,
      android_hyphenationFrequency: true,
    },
    directEventTypes: {
      topTextLayout: {
        registrationName: 'onTextLayout',
      },
      topInlineViewLayout: {
        registrationName: 'onInlineViewLayout',
      },
    },
    uiViewClassName: 'AndroidTextBbd',
  })): any);

export const NativeVirtualText: HostComponent<NativeTextProps> =
  !global.RN$Bridgeless && !UIManager.hasViewManagerConfig('AndroidVirtualTextBbd')
    ? NativeText
    : (createReactNativeComponentClass('AndroidVirtualTextBbd', () => ({
        validAttributes: {
          ...ReactNativeViewAttributes.UIView,
          isHighlighted: true,
          isPressable: true,
          maxFontSizeMultiplier: true,
        },
        uiViewClassName: 'AndroidVirtualTextBbd',
      })): any);