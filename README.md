# BlackBerry Dynamics SDK for React Native
This page provides an overview on how to use the BlackBerry Dynamics SDK for React Native. For details on BlackBerry Dynamics please see https://www.blackberry.com/dynamics

# Supportability
#### Development environment
 - Mac OS X
 - Windows 10 (Android only)
#### React Native
 - 0.60.x
 - 0.61.x
#### BlackBerry Dynamics
 - BlackBerry Dynamics SDK for iOS v7.1, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-ios/7_1).
 - BlackBerry Dynamics SDK for Android v7.1, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/7_1).

# Features
#### Integration with BlackBerry Dynamics
Integration of BlackBerry Dynamics SDK for iOS and Android into React Native application is supported by addition of the `BlackBerry-Dynamics-for-React-Native-Base` module.
#### Secure connectivity
Both `XMLHttpRequest` and `fetch` are secured in scope of `BlackBerry-Dynamics-for-React-Native-Networking` module.

- On iOS secure communication within `<WebView />` component is supported using `XMLHttpRequest` and `fetch`. You may use either `UIWebView` (DEPRECATED) and `WKWebView`. 
- On Android secure communication within `<WebView />` component is not supported.

> NOTE: secure communication via [WebSockets](https://facebook.github.io/react-native/docs/network#websocket-support) is not supported.
#### Secure storage
 - `AsyncStorage` is secured in scope of `BlackBerry-Dynamics-for-React-Native-Async-Storage` module
 - `SQLite` is secured in scope of `BlackBerry-Dynamics-for-React-Native-SQLite-Storage` module
#### Data Leakage Prevention (DLP)
On iOS `<Text />` component, `<TextInput />` component and `Clipboard` API are secured simply by integrating BlackBerry Dynamics. 

On Android the following items are required:

 - `<Text />` component is secured in scope of `BlackBerry-Dynamics-for-React-Native-Text` UI component
 - `<TextInput />` component is secured in scope of `BlackBerry-Dynamics-for-React-Native-TextInput` UI component
 - `BlackBerry-Dynamics-for-React-Native-Clipboard` module secures [Clipboard](https://facebook.github.io/react-native/docs/clipboard) API on Android.

# Package contents
#### Modules
- `BlackBerry-Dynamics-for-React-Native-Base` - automatically integrates BlackBerry Dynamics SDK for iOS and Android into React Native application
- `BlackBerry-Dynamics-for-React-Native-Networking` - secures `XMLHttpRequest` and `fetch` APIs on Android. For more details please refer to [networking](https://facebook.github.io/react-native/docs/network) topic in React Native.
- `BlackBerry-Dynamics-for-React-Native-SQLite-Storage` - secures SQLite DB usage. It is based on [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage) 3rd party module.
- `BlackBerry-Dynamics-for-React-Native-Async-Storage` - secures built-in [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage#docsNav).
- `BlackBerry-Dynamics-for-React-Native-Clipboard` - secures built-in [Clipboard](https://facebook.github.io/react-native/docs/clipboard) API.

#### UI components
- `BlackBerry-Dynamics-for-React-Native-Text` - enables DLP within [<Text />](https://facebook.github.io/react-native/docs/text#docsNav) UI component on Android
- `BlackBerry-Dynamics-for-React-Native-TextInput` - enables DLP within [<TextInput />](https://facebook.github.io/react-native/docs/textinput#docsNav) UI component on Android

#### Sample Applications
- `BasicNetworking` - shows example of using `fetch` and `XMLHttpRequest` in different ways, covers different HTTP request types (GET, POST, PUT, DELETE etc.), some authentication types (basic auth, Digest, NTLM), has a possibility to send data to the server of different types (text, JSON, FormData etc.) and receive response of different types if server supports it (ArrayBuffer, text, JSON, Blob, etc.).
- `ClipboardTestApp` - demonstrates usage of [Clipboard](https://facebook.github.io/react-native/docs/clipboard) API in terms of Data Leakage Prevention. It is possible to change DLP policy on UEM and see how it affects the clipboard within the application. If DLP is on, it will not be possible to copy clipboard data from "Dynamics" application to "non-Dynamics" application and vice-versa.
- `DLP` - demonstrates usage of `<Text />` and `<TextInput />` UI components together with DLP policy option on UEM. If DLP is on, it will not be possible to do cut-copy-paste operations over data from "Dynamics" to "non-Dynamics" application and vice-versa.
- `SQLite` - shows example of using secure SQLite DB instance in React Native application.
- `UnitTest` - runs Jasmine unit tests for `fetch`, `XMLHttpRequest`, `Clipboard`, `AsyncStorage` and `SQLite` in React Native application.
- `WKWebViewBrowser` - demonstrates usage of `<WebView />` component in React Native application for iOS.
