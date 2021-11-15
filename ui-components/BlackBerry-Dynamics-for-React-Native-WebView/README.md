# BlackBerry-Dynamics-for-React-Native-WebView

Secures `<WebView />` UI component provided by [react-native-webview@10.8.3](https://github.com/react-native-webview/react-native-webview) and allows to access to private/corporate network resources through BlackBerry Dynamics SDK. The JavaScript API remains unchanged.

> **NOTE:** on Android `BBWebView` library is used under the hood.

## Supportability

#### Platforms Supported

- [x] iOS
- [x] Android

#### React Native
 - 0.63.x (deprecated)
 - 0.64.x
 - 0.65.x
 - 0.66.x (0.66.1 is latest supported)

#### Supported on iOS and Android
 - HTTP redirection
 - File upload
 - Secured cookies storage
 - Page resource and content loading
 - MTD Safe browsing
 - DLP (secure cut/copy/paste) within WebView

 #### Supported on iOS and not supported on Android
 - Browsing history - `GoBack`, `GoForward`, `Reload` and `StopLoading` API
 - AutoZSO

#### Not supported on iOS and Android
 - HTTP authentication (Basic, Digest, NTLM, Kerberos, Client Cert)
 - File download
 - URL schemes `mailto:`, `geo:`, `tel:`
 - Secured HTTP cache
 - WebSocket
 - WebWorker
 - SSO

## Preconditions
`BlackBerry-Dynamics-for-React-Native-WebView` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module, so please install required modules first.

## Installation

    $ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-WebView

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ react-native run-ios
###### Android
    $ react-native run-android

## Usage

Import the `WebView` component from `BlackBerry-Dynamics-for-React-Native-WebView` and use it like so:

```javascript
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'BlackBerry-Dynamics-for-React-Native-WebView';

// ...
class MyWebComponent extends Component {
  render() {
    return <WebView source={{ uri: 'https://reactnative.dev/' }} />;
  }
}
```

For more, read the [API Reference](https://github.com/react-native-community/react-native-webview/blob/v10.8.3/docs/Reference.md) and [Guide](https://github.com/react-native-community/react-native-webview/blob/v10.8.3/docs/Guide.md) of original `WebView` component.

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-WebView

###### iOS
    $ cd ios
    $ pod install
    $ cd ..

## Known issues
 - [Android] Response with error message is not shown for unsuccessful request
