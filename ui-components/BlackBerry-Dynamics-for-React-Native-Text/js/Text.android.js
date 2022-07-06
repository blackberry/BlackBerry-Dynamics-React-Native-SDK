/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original Text UI component for react-native
 * from https://github.com/facebook/react-native/blob/0.61-stable/Libraries/Text/Text.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

const DeprecatedTextPropTypes = require('deprecated-react-native-prop-types').TextPropTypes;
const React = require('react');
const ReactNativeViewAttributes = require('react-native/Libraries/Components/View/ReactNativeViewAttributes');
const TextAncestor = require('react-native/Libraries/Text/TextAncestor');
const Touchable = require('react-native/Libraries/Components/Touchable/Touchable');
const UIManager = require('react-native/Libraries/ReactNative/UIManager');

const createReactNativeComponentClass = require('react-native/Libraries/Renderer/shims/createReactNativeComponentClass');
const nullthrows = require('nullthrows');
const processColor = require('react-native/Libraries/StyleSheet/processColor');

import type {PressEvent} from 'CoreEventTypes';
import type {NativeComponent} from 'ReactNative';
import type {PressRetentionOffset, TextProps} from 'TextProps';

type ResponseHandlers = $ReadOnly<{|
  onStartShouldSetResponder: () => boolean,
  onResponderGrant: (event: PressEvent, dispatchID: string) => void,
  onResponderMove: (event: PressEvent) => void,
  onResponderRelease: (event: PressEvent) => void,
  onResponderTerminate: (event: PressEvent) => void,
  onResponderTerminationRequest: () => boolean,
|}>;

type Props = $ReadOnly<{|
  ...TextProps,
  forwardedRef: ?React.Ref<'AndroidTextBbd' | 'AndroidVirtualTextBbd'>,
|}>;

type State = {|
  touchable: {|
    touchState: ?string,
    responderID: ?number,
  |},
  isHighlighted: boolean,
  createResponderHandlers: () => ResponseHandlers,
  responseHandlers: ?ResponseHandlers,
|};

const PRESS_RECT_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

const viewConfig = {
  validAttributes: {
    ...ReactNativeViewAttributes.UIView,
    isHighlighted: true,
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
  },
  directEventTypes: {
    topTextLayout: {
      registrationName: 'onTextLayout',
    },
  },
  uiViewClassName: 'AndroidTextBbd',
};

/**
 * A React component for displaying text.
 *
 * See https://facebook.github.io/react-native/docs/text.html
 */
class TouchableText extends React.Component<Props, State> {
  static defaultProps = {
    accessible: true,
    allowFontScaling: true,
    ellipsizeMode: 'tail',
  };

  touchableGetPressRectOffset: ?() => PressRetentionOffset;
  touchableHandleActivePressIn: ?() => void;
  touchableHandleActivePressOut: ?() => void;
  touchableHandleLongPress: ?(event: PressEvent) => void;
  touchableHandlePress: ?(event: PressEvent) => void;
  touchableHandleResponderGrant: ?(
    event: PressEvent,
    dispatchID: string,
  ) => void;
  touchableHandleResponderMove: ?(event: PressEvent) => void;
  touchableHandleResponderRelease: ?(event: PressEvent) => void;
  touchableHandleResponderTerminate: ?(event: PressEvent) => void;
  touchableHandleResponderTerminationRequest: ?() => boolean;

  state = {
    ...Touchable.Mixin.touchableGetInitialState(),
    isHighlighted: false,
    createResponderHandlers: this._createResponseHandlers.bind(this),
    responseHandlers: null,
  };

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State,
  ): $Shape<State> | null {
    return prevState.responseHandlers == null && isTouchable(nextProps)
      ? {
          responseHandlers: prevState.createResponderHandlers(),
        }
      : null;
  }

  static viewConfig = viewConfig;

  render(): React.Node {
    let props = this.props;
    if (isTouchable(props)) {
      props = {
        ...props,
        ...this.state.responseHandlers,
        isHighlighted: this.state.isHighlighted,
      };
    }
    if (props.selectionColor != null) {
      props = {
        ...props,
        selectionColor: processColor(props.selectionColor),
      };
    }
    if (__DEV__) {
      if (Touchable.TOUCH_TARGET_DEBUG && props.onPress != null) {
        props = {
          ...props,
          style: [props.style, {color: 'magenta'}],
        };
      }
    }
    return (
      <TextAncestor.Consumer>
        {hasTextAncestor =>
          hasTextAncestor ? (
            <AndroidVirtualTextBbd {...props} ref={props.forwardedRef} />
          ) : (
            <TextAncestor.Provider value={true}>
              <AndroidTextBbd {...props} ref={props.forwardedRef} />
            </TextAncestor.Provider>
          )
        }
      </TextAncestor.Consumer>
    );
  }

  _createResponseHandlers(): ResponseHandlers {
    return {
      onStartShouldSetResponder: (): boolean => {
        const {onStartShouldSetResponder} = this.props;
        const shouldSetResponder =
          (onStartShouldSetResponder == null
            ? false
            : onStartShouldSetResponder()) || isTouchable(this.props);

        if (shouldSetResponder) {
          this._attachTouchHandlers();
        }
        return shouldSetResponder;
      },
      onResponderGrant: (event: PressEvent, dispatchID: string): void => {
        nullthrows(this.touchableHandleResponderGrant)(event, dispatchID);
        if (this.props.onResponderGrant != null) {
          this.props.onResponderGrant.call(this, event, dispatchID);
        }
      },
      onResponderMove: (event: PressEvent): void => {
        nullthrows(this.touchableHandleResponderMove)(event);
        if (this.props.onResponderMove != null) {
          this.props.onResponderMove.call(this, event);
        }
      },
      onResponderRelease: (event: PressEvent): void => {
        nullthrows(this.touchableHandleResponderRelease)(event);
        if (this.props.onResponderRelease != null) {
          this.props.onResponderRelease.call(this, event);
        }
      },
      onResponderTerminate: (event: PressEvent): void => {
        nullthrows(this.touchableHandleResponderTerminate)(event);
        if (this.props.onResponderTerminate != null) {
          this.props.onResponderTerminate.call(this, event);
        }
      },
      onResponderTerminationRequest: (): boolean => {
        const {onResponderTerminationRequest} = this.props;
        if (!nullthrows(this.touchableHandleResponderTerminationRequest)()) {
          return false;
        }
        if (onResponderTerminationRequest == null) {
          return true;
        }
        return onResponderTerminationRequest();
      },
    };
  }

  /**
   * Lazily attaches Touchable.Mixin handlers.
   */
  _attachTouchHandlers(): void {
    if (this.touchableGetPressRectOffset != null) {
      return;
    }
    for (const key in Touchable.Mixin) {
      if (typeof Touchable.Mixin[key] === 'function') {
        (this: any)[key] = Touchable.Mixin[key].bind(this);
      }
    }
    this.touchableHandleActivePressIn = (): void => {
      if (!this.props.suppressHighlighting && isTouchable(this.props)) {
        this.setState({isHighlighted: true});
      }
    };
    this.touchableHandleActivePressOut = (): void => {
      if (!this.props.suppressHighlighting && isTouchable(this.props)) {
        this.setState({isHighlighted: false});
      }
    };
    this.touchableHandlePress = (event: PressEvent): void => {
      if (this.props.onPress != null) {
        this.props.onPress(event);
      }
    };
    this.touchableHandleLongPress = (event: PressEvent): void => {
      if (this.props.onLongPress != null) {
        this.props.onLongPress(event);
      }
    };
    this.touchableGetPressRectOffset = (): PressRetentionOffset =>
      this.props.pressRetentionOffset == null
        ? PRESS_RECT_OFFSET
        : this.props.pressRetentionOffset;
  }
}

const isTouchable = (props: Props): boolean =>
  props.onPress != null ||
  props.onLongPress != null ||
  props.onStartShouldSetResponder != null;

const AndroidTextBbd = createReactNativeComponentClass(
  viewConfig.uiViewClassName,
  () => viewConfig,
);

const AndroidVirtualTextBbd =
  UIManager.getViewManagerConfig('AndroidVirtualTextBbd') == null
    ? AndroidTextBbd
    : createReactNativeComponentClass('AndroidVirtualTextBbd', () => ({
        validAttributes: {
          ...ReactNativeViewAttributes.UIView,
          isHighlighted: true,
          maxFontSizeMultiplier: true,
        },
        uiViewClassName: 'AndroidVirtualTextBbd',
      }));

const Text = (
  props: TextProps,
  forwardedRef: ?React.Ref<'AndroidTextBbd' | 'AndroidVirtualTextBbd'>,
) => {
  return <TouchableText {...props} forwardedRef={forwardedRef} />;
};
const TextToExport = React.forwardRef(Text);
TextToExport.displayName = 'Text';

// TODO: Deprecate this.
/* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.89 was deployed. To see the error, delete this comment
 * and run Flow. */
TextToExport.propTypes = DeprecatedTextPropTypes;

module.exports = ((TextToExport: $FlowFixMe): Class<
  NativeComponent<TextProps>,
>);
