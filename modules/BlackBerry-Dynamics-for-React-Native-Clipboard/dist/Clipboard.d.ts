import { EmitterSubscription } from 'react-native';
/**
 * `Clipboard` gives you an interface for setting and getting content from Clipboard on both iOS and Android
 */
export declare const Clipboard: {
    /**
     * Get content of string type, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getString();
     * }
     * ```
     */
    getString(): Promise<string>;
    /**
     * (iOS Only)
     * Get contents of string array type, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getStrings();
     * }
     * ```
     */
    getStrings(): Promise<string[]>;
    /**
     * (iOS Only)
     * Get clipboard image as PNG in base64, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getImagePNG();
     * }
     * ```
     */
    getImagePNG(): Promise<string>;
    /**
     * (iOS Only)
     * Get clipboard image as JPG in base64, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getImageJPG();
     * }
     * ```
     */
    getImageJPG(): Promise<string>;
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
    setImage(content: string): void;
    /**
     * (Android Only)
     * Get clipboard image in base64, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getImage();
     * }
     * ```
     */
    getImage(): Promise<string>;
    /**
     * Set content of string type. You can use following code to set clipboard content
     * ```javascript
     * _setContent() {
     *   Clipboard.setString('hello world');
     * }
     * ```
     * @param the content to be stored in the clipboard.
     */
    setString(content: string): void;
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
    setStrings(content: string[]): void;
    /**
     * Returns whether the clipboard has content or is empty.
     * This method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _hasContent() {
     *   var hasContent = await Clipboard.hasString();
     * }
     * ```
     */
    hasString(): Promise<boolean>;
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
    hasImage(): Promise<boolean>;
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
    hasURL(): Promise<boolean> | undefined;
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
    hasNumber(): Promise<boolean> | undefined;
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
    hasWebURL(): Promise<boolean> | undefined;
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
    addListener(callback: () => void): EmitterSubscription;
    /**
     * (iOS and Android Only)
     * Removes all previously registered listeners and turns off notifications on the native side.
     * ```javascript
     * Clipboard.removeAllListeners();
     * ```
     */
    removeAllListeners(): void;
};
