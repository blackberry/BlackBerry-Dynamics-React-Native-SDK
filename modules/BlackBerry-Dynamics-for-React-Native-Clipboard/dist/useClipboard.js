"use strict";
/**
 * useClipboard.ts
 * This code is inspired from the @react-native-community/hooks package
 * All credit goes to author of the useClipboard custom hooks.
 * https://github.com/react-native-community/hooks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClipboard = void 0;
var react_1 = require("react");
var Clipboard_1 = require("./Clipboard");
var listeners = new Set();
function setString(content) {
    Clipboard_1.Clipboard.setString(content);
    listeners.forEach(function (listener) { return listener(content); });
}
var useClipboard = function () {
    var _a = (0, react_1.useState)(''), data = _a[0], updateClipboardData = _a[1];
    (0, react_1.useEffect)(function () {
        Clipboard_1.Clipboard.getString().then(updateClipboardData);
    }, []);
    (0, react_1.useEffect)(function () {
        listeners.add(updateClipboardData);
        return function () {
            listeners.delete(updateClipboardData);
        };
    }, []);
    return [data, setString];
};
exports.useClipboard = useClipboard;
