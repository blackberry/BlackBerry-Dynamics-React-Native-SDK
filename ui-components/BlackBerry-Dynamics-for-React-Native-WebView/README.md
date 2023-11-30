# BlackBerry-Dynamics-for-React-Native-WebView

Secures `<WebView />` UI component provided by [react-native-webview@13.3.1](https://github.com/react-native-webview/react-native-webview) and allows to access to private/corporate network resources through BlackBerry Dynamics SDK. The JavaScript API remains unchanged.

> **NOTE:** on Android `BBWebView` library is used under the hood.

## Supportability

#### Platforms Supported

- [x] iOS
- [x] Android

#### React Native
 - 0.66.x (deprecated)
 - 0.67.x (deprecated)
 - 0.68.x (deprecated)
 - 0.69.x (deprecated)
 - 0.70.x
 - 0.71.x
 - 0.72.x

#### Supported on iOS and Android
 - HTTP redirection
 - File upload
 - Secured cookies storage
 - Page resource and content loading
 - MTD Safe browsing
 - DLP (secure cut/copy/paste) within WebView
 - Browsing history - `GoBack`, `GoForward`, `Reload` and `StopLoading` API

 #### Supported on iOS and not supported on Android
 - AutoZSO

#### Supported on Android and not supported on iOS
 - File download

#### Not supported on iOS and Android
 - New architecture (fabric)
 - HTTP authentication (Basic, Digest, NTLM, Kerberos, Client Cert)
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
  // ...
  webView = {
    canGoBack: false,
    canGoForward: false,
    ref: null
  }

  // ...

  render() {
    return <WebView source={{ uri: 'https://reactnative.dev/' }} />;
  }
}
```

#### Secure file download on Android 

```javascript
// ...
import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';
// ...

// add this handler on button click
async openDownloadsFolder() {
  // programatically open Downloads screen
  this.webView.ref.openDownloadsFolder();

  // get path to secure Download folder within secure container
  const bbDownloadsFolderPath = await this.webView.ref.getDownloadsDirectoryPath();
  // read downloaded files using FS module
  const bbDownloadsFolder = await FS.readDir(bbDownloadsFolderPath);
  bbDownloadsFolder.map(item => {
    console.log('Downloaded file:\n');
    console.log(item);
    console.log('\n');
  });
}
```

For more, read the [API Reference](https://github.com/react-native-community/react-native-webview/blob/v13.3.1/docs/Reference.md) and [Guide](https://github.com/react-native-community/react-native-webview/blob/v13.3.1/docs/Guide.md) of original `WebView` component.

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-WebView

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
