# BlackBerry Dynamics SDK for React Native
This page provides an overview on how to use the BlackBerry Dynamics SDK for React Native. For details on BlackBerry Dynamics please see https://docs.blackberry.com/en/endpoint-management/blackberry-dynamics

# Supportability
#### Development environment
 - Mac OS
 - Windows 10 (Android only)
#### Node.js
 - 12.x (for React Native version < 0.68.0)
 - 14.x (for React Native version >= 0.68.0)
#### Package manager
 - yarn
#### React Native
 - 0.64.x (deprecated)
 - 0.65.x (deprecated)
 - 0.66.x
 - 0.67.x
 - 0.68.x (0.68.2 is latest supported)
#### iOS
 - Xcode 12+
 - iOS 14+ (for BlackBerry Dynamics SDK for iOS v11.1)
 - iOS 15+ (for BlackBerry Dynamics SDK for iOS v11.2)
 - cocoapods 1.10.2+
#### Android
 - Java 8 (for React Native version < 0.68.0)
 - Java 11 (for React Native version >= 0.68.0)
 - Android 9+, API 28+ (for BlackBerry Dynamics SDK for Android v11.1)
 - Android 10+, API 29+ (for BlackBerry Dynamics SDK for Android v11.2)
 - NDK 20.1.5948944 (for React Native version < 0.66.0)
 - NDK 21.4.7075529 (for React Native version >= 0.66.0)
#### BlackBerry Dynamics
Dynamics SDK for iOS and Android are now installed as part of the [Base](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base) module using CocoaPods & Gradle.  
By default, `BlackBerry-Dynamics-for-React-Native-Base` module will integrate **11.1** (11.1.0.62) version of BlackBerry Dynamics SDK for Android and iOS.  
To integrate **11.2** version see "Using other released version" [instructions](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#dynamics-sdk-dependency) for both iOS and Android platforms in [BlackBerry-Dynamics-for-React-Native-Base](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#dynamics-sdk-dependency).

BlackBerry Dynamics SDK for iOS
 - BlackBerry Dynamics SDK for iOS v11.1, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-ios/11_1).
 - BlackBerry Dynamics SDK for iOS v11.2, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-ios/11_2).

 BlackBerry Dynamics SDK for Android
 - BlackBerry Dynamics SDK for Android v11.1, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_1).
 - BlackBerry Dynamics SDK for Android v11.2, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_2).
#### BlackBerry Dynamics Launcher
 - BlackBerry Dynamics Launcher library for iOS v3.5, check details [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-launcher-framework-for-ios/3_5).
 - BlackBerry Dynamics Launcher library for Android v3.5, check details [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-launcher-framework-for-android/3_5).

# Features
#### Integration with BlackBerry Dynamics
Integration of BlackBerry Dynamics SDK for iOS and Android into React Native application is supported by addition of the `BlackBerry-Dynamics-for-React-Native-Base` module.
###### "Dynamic Framework" integration on iOS
Dynamics SDK for React Native v9.0 and above integrates with the iOS "Dynamic Framework" version of BlackBerry Dynamics. The static library integration is no longer supported.
#### Application configuration and app-specific policy
`BlackBerry-Dynamics-for-React-Native-Application` module provides access to information that is globally available to any BlackBerry Dynamics Application. The module provides API to read Dynamcis application configuration and app-specific policy.
#### Secure connectivity
- Both `XMLHttpRequest` and `fetch` are secured in scope of `BlackBerry-Dynamics-for-React-Native-Networking` module.
- `<WebView />` is secured in scope of `BlackBerry-Dynamics-for-React-Native-WebView` UI component.
    - On iOS `UIWebView` has been DEPRECATED by Apple for a long time and removed from [react-native-webview](https://github.com/react-native-community/react-native-webview) since version 7.0.1.
    - `UIWebView` support was removed from BlackBerry Dynamics SDK for iOS since v8.0.
- Secure communication via [WebSockets](https://facebook.github.io/react-native/docs/network#websocket-support) is secured in scope of `BlackBerry-Dynamics-for-React-Native-Networking` module.
#### Secure storage
 - `AsyncStorage` is secured in scope of `BlackBerry-Dynamics-for-React-Native-Async-Storage` module
 - `SQLite` is secured in scope of `BlackBerry-Dynamics-for-React-Native-SQLite-Storage` module
 - `FileSystem` is secured in scope of `BlackBerry-Dynamics-for-React-Native-FileSystem` module
#### Data Leakage Prevention (DLP)
On iOS `<Text />` component, `<TextInput />` component and `Clipboard` API are secured simply by integrating BlackBerry Dynamics.

On Android the following items are required:

 - `<Text />` component is secured in scope of `BlackBerry-Dynamics-for-React-Native-Text` UI component
 - `<TextInput />` component is secured in scope of `BlackBerry-Dynamics-for-React-Native-TextInput` UI component
 - `BlackBerry-Dynamics-for-React-Native-Clipboard` module secures [Clipboard](https://facebook.github.io/react-native/docs/clipboard) API on Android.
#### Inter-Container Communication (ICC)
ICC provides service discovery, service consumption and service providing abilities for Dynamics React Native applications and allows to securely communicate with other Dynamics applications.

To implement some ICC capabilities in a Dynamics React Native application `BlackBerry-Dynamics-for-React-Native-AppKinetics` should be used.

#### Launcher integration
`BlackBerry-Dynamics-for-React-Native-Launcher` provides Launcher integration in Dynamics React Native application.

#### Android SafetyNet
BlackBerry UEM version 12.10 and later supports [SafetyNet](https://developers.google.com/android/reference/com/google/android/gms/safetynet/SafetyNet) attestation for BlackBerry Dynamics apps. You can use SafetyNet to extend BlackBerry's root and exploit detection by adding checks for device tampering and application integrity. For more information about SafetyNet attestation, implementation considerations, and instructions for enabling the feature, see the [BlackBerry UEM Configuration Guide](https://docs.blackberry.com/en/endpoint-management/blackberry-uem/current/installation-configuration/configuration). This chapter details considerations for developers who want to enable SafetyNet support for their BlackBerry Dynamics apps.
###### Adding the GDSafetyNet library to the app project
The BlackBerry Dynamics SDK for Android version 5.0 and later includes a GDSafetyNet library. To support SafetyNet, add this library to the app project dependencies along with the main GDLibrary.

The GDSafetyNet library includes all of the client-side source code that is required to support SafetyNet. No additional app code is required. The GDSafetyNet library requires Google Play Services 11.0 or later to use device SafetyNet APIs. Verify that your BlackBerry Dynamics app is dependent on only a single version of Google Play Services.
```
implementation 'com.google.android.gms:play-services-safetynet:xx.x.x'
implementation 'com.blackberry.blackberrydynamics:android_handheld_gd_safetynet:+'
```
It can be added in `BlackBerry-Dynamics-for-React-Native-Base/android/gd.gradle` before Base module is added to the application.
###### Completing SafetyNet registration
You must [obtain an API key from Google](https://developer.android.com/training/safetynet/attestation#add-api-key) and add it to the app’s AndroidManifest.xml file in the <application> element:
```
<meta-data android:name="com.blackberry.attestation.ApiKey" android:value="YOUR_API_KEY" />
```
More details can be found [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/10_0/blackberry-dynamics-sdk-android-devguide/Implementing-SafetyNet-attestation-for-BlackBerry-Dynamics-apps).

# Package contents
#### Modules
- `BlackBerry-Dynamics-for-React-Native-Base` - automatically integrates BlackBerry Dynamics SDK for iOS and Android into React Native application
- `BlackBerry-Dynamics-for-React-Native-Application` - provides API to read Dynamcis application configuration and app-specific policy
- `BlackBerry-Dynamics-for-React-Native-Networking` - secures `XMLHttpRequest`, `fetch` and `WebSocket` APIs. For more details please refer to [networking](https://facebook.github.io/react-native/docs/network) topic in React Native.
- `BlackBerry-Dynamics-for-React-Native-SQLite-Storage` - secures SQLite DB usage. It is based on [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage) 3rd party module.
- `BlackBerry-Dynamics-for-React-Native-Async-Storage` - secures built-in [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage#docsNav).
- `BlackBerry-Dynamics-for-React-Native-Clipboard` - secures built-in [Clipboard](https://facebook.github.io/react-native/docs/clipboard) API.
- `BlackBerry-Dynamics-for-React-Native-AppKinetics` - provides Inter-Container Communication capabilities.
- `BlackBerry-Dynamics-for-React-Native-FileSystem` - secures FileSystem usage. It is based on [react-native-fs](https://github.com/itinance/react-native-fs) 3rd party module.
- `BlackBerry-Dynamics-for-React-Native-Launcher` provides Launcher integration.

#### UI components
- `BlackBerry-Dynamics-for-React-Native-Text` - enables DLP within [<Text />](https://facebook.github.io/react-native/docs/text#docsNav) UI component on Android
- `BlackBerry-Dynamics-for-React-Native-TextInput` - enables DLP within [<TextInput />](https://facebook.github.io/react-native/docs/textinput#docsNav) UI component on Android
- `BlackBerry-Dynamics-for-React-Native-WebView` - secures [<WebView />](https://github.com/react-native-community/react-native-webview/blob/v10.8.3/) UI component

#### Sample Applications
- `BasicNetworking` - shows example of using `fetch` and `XMLHttpRequest` in different ways, covers different HTTP request types (GET, POST, PUT, DELETE etc.), some authentication types (basic auth, Digest, NTLM), has a possibility to send data to the server of different types (text, JSON, FormData etc.) and receive response of different types if server supports it (ArrayBuffer, text, JSON, Blob, etc.).
- `ClipboardTestApp` - demonstrates usage of [Clipboard](https://facebook.github.io/react-native/docs/clipboard) API in terms of Data Leakage Prevention. It is possible to change DLP policy on UEM and see how it affects the clipboard within the application. If DLP is on, it will not be possible to copy clipboard data from "Dynamics" application to "non-Dynamics" application and vice-versa.
- `DLP` - demonstrates usage of `<Text />` and `<TextInput />` UI components together with DLP policy option on UEM. If DLP is on, it will not be possible to do cut-copy-paste operations over data from "Dynamics" to "non-Dynamics" application and vice-versa.
- `SQLite` - shows example of using secure SQLite DB instance in React Native application.
- `UnitTests` - runs Jasmine unit tests for `fetch`, `XMLHttpRequest`, `WebSocket`, `Clipboard`, `AsyncStorage`, `AppKinetics`, `Application`, `Launcher`, `FileSystem` and `SQLite` in React Native application.
- `WebViewBrowser` - demonstrates usage of `<WebView />` UI component in React Native application.
- `FileSystem` - shows example of using secure FileSystem instance in React Native application. It demonstrates how to manage files/directories and how to upload/download files.
- `AppKinetics` - shows example of using AppKinetics functionality.
- `WebSockets` - contains `WebSocketClient` and `WebSocketServer` sample apps. It demonstrates usage of secure `WebSocket` API - how to establish connection to WebSocket server using `ws://` or `wss://` protocols, how to send or receive text or binary data over WebSocket connection, how to close WebSocket connection.
- `Policy` - shows example of using Application module functionality, reads Dynamcis application configuration and app-specific policy.

## Preconditions
Make sure you first setup your environment and install BlackBerry Dynamics.
 - [Setup React Native environment](./modules/BlackBerry-Dynamics-for-React-Native-Base/README.md#setup-environment)
 - [Install BlackBerry Dynamics SDK for iOS and Android](./modules/BlackBerry-Dynamics-for-React-Native-Base/README.md#preconditions)

## How To Guides

### Sample applications

To setup, build and run the sample applications please refer to the README for each sample.

- [BasicNetworking](./SampleApplications/BasicNetworking/README.md)
- [ClipboardTestApp](./SampleApplications/ClipboardTestApp/README.md)
- [DLP](./SampleApplications/DLP/README.md)
- [SQLite](./SampleApplications/SQLite/README.md)
- [UnitTests](./SampleApplications/UnitTests/README.md)
- [WebViewBrowser](./SampleApplications/WebViewBrowser/README.md)
- [FileSystem](./SampleApplications/FileSystem/README.md)
- [AppKinetics](./SampleApplications/AppKinetics/README.md)
- [WebSockets](./SampleApplications/WebSockets/README.md)
- [Policy](./SampleApplications/Policy/README.md)

### Integrate into new React Native application
To integrate BlackBerry Dynamics into a new React Native application please follow these [steps](./modules/BlackBerry-Dynamics-for-React-Native-Base/README.md#installation).

### Integrate into existing React Native application
To integrate BlackBerry Dynamics into existing React Native application:
 - Check you are using `0.66.x` or higher version of React Native.

      - [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) may be used to upgrade your application prior to integrating BlackBerry Dynamics. Confirm the application builds and works correctly after upgrade.

 - Integrate BlackBerry Dynamics by adding `BlackBerry-Dynamics-for-React-Native-Base` module
    `$ cd <appFolder>`
    `$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`

    > Integrates Dynamics based on your current identifiers - iOS Bundle ID and Android Package Name.

    `$ yarn set-bundle-id (OPTIONAL)`

    > Allows an identifier (required) and name (optional) to be updated within your application. This identifier is your iOS Bundle ID or Android Package Name and will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.
 - Analyze your application functionality and decide what parts should be secured:
     - If `fetch` API, `XMLHttpRequest` or `WebSocket` is used in your code to do communication between your app and backend server this communication can be secured by adding `BlackBerry-Dynamics-for-React-Native-Networking` module. See [Networking Module](./modules/BlackBerry-Dynamics-for-React-Native-Networking/README.md).
     - If you use `AsyncStorage` capabilities it can be secured by adding `BlackBerry-Dynamics-for-React-Native-Async-Storage` module. See [Async-Storage Module](./modules/BlackBerry-Dynamics-for-React-Native-Async-Storage/README.md).
     - If SQLite DB is used in the application it can be secured by adding `BlackBerry-Dynamics-for-React-Native-SQLite-Storage` module. See [SQLite-Storage Module](./modules/BlackBerry-Dynamics-for-React-Native-SQLite-Storage/README.md).
     - If in your application `Clipboard` API is used it can be secured by adding `BlackBerry-Dynamics-for-React-Native-Clipboard` module. See [Clipboard module](./modules/BlackBerry-Dynamics-for-React-Native-Clipboard/README.md).
     - If `<Text />` UI component is used you can secure cut/copy/paste operations by adding `BlackBerry-Dynamics-for-React-Native-Text` UI component. See [Text UI component](./ui-components/BlackBerry-Dynamics-for-React-Native-Text/README.md).
     - If `<TextInput />` UI component is used you can secure cut/copy/paste operations by adding `BlackBerry-Dynamics-for-React-Native-TextInput` UI component. See [TextInput UI component](./ui-components/BlackBerry-Dynamics-for-React-Native-TextInput/README.md).
     - If `<WebView />` UI component is used you can secure resource loading within WebView by adding `BlackBerry-Dynamics-for-React-Native-WebView` UI component. See [WebView UI component](./ui-components/BlackBerry-Dynamics-for-React-Native-WebView/README.md).

 - Use other Dynamics React Native modules.
 - Lastly, do not forget to update the imports in your code.
 
## Limitations
### Flipper is disabled on iOS
Flipper cannot be used together with BlackBerry Dynamics SDK for React Native on iOS in debug configuration as it disables some BlackBerry Dynamics functionality related to secure networking.
Flipper is disabled on iOS by default. If your Dynamics React Native application on iOS does not use Secure Connectivity feature (`BlackBerry-Dynamics-for-React-Native-Networking` module) you can enable Flipper by uncommenting `use_flipper!()` line in `Podfile` of your application.

## Known issues
### Conflict between default and secure SQLite library on iOS
BlackBerry Dynamcis SDK for iOS uses secure *SQLite* library to provide secure DB connection and management.
Many standard and 3rd party modules use default *SQLite* library.
When both default and secure *SQLite* libraries are linked to the project it causes conflict with unpredictable behavior.
##### Example: react-native-webrtc
Let's consider a concrete example:
**`BlackBerry-Dynamics-for-React-Native-Base`** - is main module from **BlackBerry Dynamics SDK for React Native** that integrates BlackBerry Dymamics into React Native application. BlackBerry Dymamics, in turn, provides secure *SQLite* dependency to the project.
**`BlackBerry-Dynamics-for-React-Native-SQLite-Storage`** - module from **BlackBerry Dynamics SDK for React Native** that provides secure DB connection and management.
**`react-native-webrtc`** links default *SQLite* library in the project. This is an extract of its podspec:
```
s.libraries           = 'c', 'sqlite3', 'stdc++'
```
When the project is compiled and run DB functionality works incorrectly.
> NOTE: There can be more of such cases when to use **BlackBerry Dynamics SDK for React Native** module and some other module that links default SQLite library in Pods. The workaround below can be used to fix the issue.

##### Workaround
To resolve the conflict **`sqlite3`** dependency should be removed in *<app>/node_modules/react-native-webrtc/react-native-webrtc.podspec*. Then, do **"pod install"** again. This should not break anything as secured **`sqlite3`** dependency will remain linked to the project.

### Android 12+ support for React Native version less than `0.68`
Apps targeting Android 12 and higher are required to specify an explicit value for `android:exported` when the corresponding component has an intent filter defined. More details can be found [here](https://developer.android.com/guide/topics/manifest/activity-element#exported).
React Native `0.68` and higher supports Android 12+ by default by setting appropriate setting in AndroidManifest.xml.
For React Native versions `<= 0.67` setting `android:exported` should be set manually.
