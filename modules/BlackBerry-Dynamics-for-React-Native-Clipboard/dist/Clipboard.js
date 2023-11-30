"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clipboard = void 0;
var react_native_1 = require("react-native");
var NativeClipboard_1 = __importStar(require("./NativeClipboard"));
/**
 * `Clipboard` gives you an interface for setting and getting content from Clipboard on both iOS and Android
 */
exports.Clipboard = {
    /**
     * Get content of string type, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getString();
     * }
     * ```
     */
    getString: function () {
        return NativeClipboard_1.default.getString();
    },
    /**
     * (iOS Only)
     * Get contents of string array type, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getStrings();
     * }
     * ```
     */
    getStrings: function () {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        return NativeClipboard_1.default.getStrings();
    },
    /**
     * (iOS Only)
     * Get clipboard image as PNG in base64, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getImagePNG();
     * }
     * ```
     */
    getImagePNG: function () {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        return NativeClipboard_1.default.getImagePNG();
    },
    /**
     * (iOS Only)
     * Get clipboard image as JPG in base64, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getImageJPG();
     * }
     * ```
     */
    getImageJPG: function () {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        return NativeClipboard_1.default.getImageJPG();
    },
    /**
     * (iOS Only)
     * Set content of base64 image type. You can use following code to set clipboard content
     * ```javascript
     * _setContent() {
     *   Clipboard.setImage(...);
     * }
     * ```
     * @param the content to be stored in the clipboard.
     */
    setImage: function (content) {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        NativeClipboard_1.default.setImage(content);
    },
    /**
     * (Android Only)
     * Get clipboard image in base64, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getImage();
     * }
     * ```
     */
    getImage: function () {
        if (react_native_1.Platform.OS !== 'android') {
            return;
        }
        return NativeClipboard_1.default.getImage();
    },
    /**
     * Set content of string type. You can use following code to set clipboard content
     * ```javascript
     * _setContent() {
     *   Clipboard.setString('hello world');
     * }
     * ```
     * @param the content to be stored in the clipboard.
     */
    setString: function (content) {
        NativeClipboard_1.default.setString(content);
    },
    /**
     * (iOS Only)
     * Set content of string array type. You can use following code to set clipboard content
     * ```javascript
     * _setContent() {
     *   Clipboard.setStrings(['hello world', 'second string']);
     * }
     * ```
     * @param the content to be stored in the clipboard.
     */
    setStrings: function (content) {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        NativeClipboard_1.default.setStrings(content);
    },
    /**
     * Returns whether the clipboard has content or is empty.
     * This method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _hasContent() {
     *   var hasContent = await Clipboard.hasString();
     * }
     * ```
     */
    hasString: function () {
        return NativeClipboard_1.default.hasString();
    },
    /**
     * (iOS Only)
     * Returns whether the clipboard has an image or is empty.
     * This method returns a `Promise`, so you can use following code to check clipboard content
     * ```javascript
     * async _hasContent() {
     *   var hasContent = await Clipboard.hasImage();
     * }
     * ```
     */
    hasImage: function () {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        return NativeClipboard_1.default.hasImage();
    },
    /**
     * (iOS Only)
     * Returns whether the clipboard has a URL content. Can check
     * if there is a URL content in clipboard without triggering PasteBoard notification for iOS 14+
     * This method returns a `Promise`, so you can use following code to check for url content in clipboard.
     * ```javascript
     * async _hasURL() {
     *   var hasURL = await Clipboard.hasURL();
     * }
     * ```
     */
    hasURL: function () {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        return NativeClipboard_1.default.hasURL();
    },
    /**
     * (iOS 14+ Only)
     * Returns whether the clipboard has a Number(UIPasteboardDetectionPatternNumber) content. Can check
     * if there is a Number content in clipboard without triggering PasteBoard notification for iOS 14+
     * This method returns a `Promise`, so you can use following code to check for Number content in clipboard.
     * ```javascript
     * async _hasNumber() {
     *   var hasNumber = await Clipboard.hasNumber();
     * }
     * ```
     */
    hasNumber: function () {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        return NativeClipboard_1.default.hasNumber();
    },
    /**
     * (iOS 14+ Only)
     * Returns whether the clipboard has a WebURL(UIPasteboardDetectionPatternProbableWebURL) content. Can check
     * if there is a WebURL content in clipboard without triggering PasteBoard notification for iOS 14+
     * This method returns a `Promise`, so you can use following code to check for WebURL content in clipboard.
     * ```javascript
     * async _hasWebURL() {
     *   var hasWebURL = await Clipboard.hasWebURL();
     * }
     * ```
     */
    hasWebURL: function () {
        if (react_native_1.Platform.OS !== 'ios') {
            return;
        }
        return NativeClipboard_1.default.hasWebURL();
    },
    /**
     * (iOS and Android Only)
     * Adds a listener to get notifications when the clipboard has changed.
     * If this is the first listener, turns on clipboard notifications on the native side.
     * It returns EmitterSubscription where you can call "remove" to remove listener
     * ```javascript
     * const listener = () => console.log("changed!");
     * Clipboard.addListener(listener);
     * ```
     */
    addListener: function (callback) {
        return (0, NativeClipboard_1.addListener)(callback);
    },
    /**
     * (iOS and Android Only)
     * Removes all previously registered listeners and turns off notifications on the native side.
     * ```javascript
     * Clipboard.removeAllListeners();
     * ```
     */
    removeAllListeners: function () {
        (0, NativeClipboard_1.removeAllListeners)();
    },
};
