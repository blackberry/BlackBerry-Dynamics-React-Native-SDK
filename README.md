# BlackBerry Dynamics SDK for React Native
This page provides an overview on how to use the BlackBerry Dynamics SDK for React Native. For details on BlackBerry Dynamics please see https://docs.blackberry.com/en/endpoint-management/blackberry-dynamics

# Supportability
#### Development environment
 - Mac OS
 - Windows 10, 11 (Android only)
#### Node.js
 - 12.x (for React Native version < 0.68.0)
 - 18.x
#### Ruby
 - 2.7.5 (for React Native version >=0.70.x)
**React Native official [documenation](https://reactnative.dev/docs/0.70/environment-setup)**.
React Native uses a .ruby-version file to make sure that your version of Ruby is aligned with what is needed. Currently, macOS 13.2 is shipped with Ruby 2.6.10, which is not what is required by this version of React Native (2.7.5). Our suggestion is to install a Ruby version manager and to install the proper version of Ruby in your system.
#### Package manager
 - yarn
#### React Native
 - 0.66.x (deprecated)
 - 0.67.x (deprecated)
 - 0.68.x (deprecated)
 - 0.69.x (deprecated)
 - 0.70.x
 - 0.71.x
 - 0.72.x
#### iOS
 - Xcode 12+
 - iOS 14+ (for BlackBerry Dynamics SDK for iOS v11.1)
 - iOS 15+ (for BlackBerry Dynamics SDK for iOS v11.2, v12.0)
 - cocoapods 1.10.2+
#### Android
 - Java 8 (for React Native version < 0.68.0)
 - Java 11 (for React Native version >= 0.68.0)
 - Android 9+, API 28+ (for BlackBerry Dynamics SDK for Android v11.1)
 - Android 10+, API 29+ (for BlackBerry Dynamics SDK for Android v11.2, v12.0)
 - NDK 20.1.5948944 (for React Native version < 0.66.0)
 - NDK 21.4.7075529 (for React Native version >= 0.66.0)
#### BlackBerry Dynamics
Dynamics SDK for iOS and Android are now installed as part of the [Base](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base) module using CocoaPods & Gradle.  
By default, `BlackBerry-Dynamics-for-React-Native-Base` module will integrate **12.0** version of BlackBerry Dynamics SDK for Android (12.0.1.79) and iOS (12.0.1.79).  
Currently, the **other** supported versions are 11.1 and 11.2.  
To integrate **11.1** or **11.2** version see "Using other released version" [instructions](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#dynamics-sdk-dependency) for both iOS and Android platforms in [BlackBerry-Dynamics-for-React-Native-Base](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#dynamics-sdk-dependency).

BlackBerry Dynamics SDK for iOS
 - BlackBerry Dynamics SDK for iOS v11.1, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-ios/11_1).
 - BlackBerry Dynamics SDK for iOS v11.2, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-ios/11_2).
 - BlackBerry Dynamics SDK for iOS v12.0, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-ios/12_0).

 BlackBerry Dynamics SDK for Android
 - BlackBerry Dynamics SDK for Android v11.1, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_1).
 - BlackBerry Dynamics SDK for Android v11.2, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_2).
 - BlackBerry Dynamics SDK for Android v12.0, check environment requirements [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/12_0).
#### BlackBerry Dynamics Launcher
 - BlackBerry Dynamics Launcher library for iOS v12.0, check details [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-launcher-framework-for-ios/12_0).
 - BlackBerry Dynamics Launcher library for Android v12.0, check details [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-launcher-framework-for-android/12_0).

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

#### Android Play Integrity attestation
BlackBerry UEM version 12.18 and later supports Play Integrity attestation for BlackBerry Dynamics apps. BlackBerry UEM version 12.17 and earlier supports [SafetyNet](https://developers.google.com/android/reference/com/google/android/gms/safetynet/SafetyNet) attestation for BlackBerry Dynamics apps. For information on SafetyNet attestation, refer to previous versions of the [SDK documentation](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_1/blackberry-dynamics-sdk-android-devguide/Implementing-SafetyNet-attestation-for-BlackBerry-Dynamics-apps).

You can use Play Integrity to extend BlackBerry root and exploit detection and to enhance app security and integrity. For more information about Play Integrity attestation, implementation considerations, and instructions for enabling the feature, see the [BlackBerry UEM documentation](https://docs.blackberry.com/en/endpoint-management/blackberry-uem/12_17/administration/device-features-it-policies/managing-attestation). This chapter details considerations for developers who want to enable Play Integrity support for their BlackBerry Dynamics apps.

To support Play Integrity, you must complete the [Play Integrity prerequisites](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_2/blackberry-dynamics-sdk-android-devguide/Implementing-SafetyNet-attestation-for-BlackBerry-Dynamics-apps/prerequisites-for-play-integrity-attestation), add a [new library component to the app project](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_2/blackberry-dynamics-sdk-android-devguide/Implementing-SafetyNet-attestation-for-BlackBerry-Dynamics-apps/Adding-the-GDSafetyNet-library-to-the-app-project), and [update the BlackBerry Dynamics application policy file](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_2/blackberry-dynamics-sdk-android-devguide/Implementing-SafetyNet-attestation-for-BlackBerry-Dynamics-apps/Updating-the-BlackBerry-Dynamics-application-policy-file).
##### Prerequisites for Play Integrity attestation
Play Integrity attestation is dependent on configurations made within the [Google Play console](https://play.google.com/console/). Use the following steps to configure Play Integrity attestation for your apps:
 - In the Google Play console, select the app you want to configure for Play Integrity attestation, then click Setup > App Integrity.
 - On the Integrity API tab, in the Device Integrity section, ensure that the checkboxes for MEETS_BASIC_INTEGRITY and MEETS_STRONG_INTEGRITY are enabled.
 - On the App Signing tab, make note of the SHA-256 certificate fingerprint for the App signing key certificate and the Upload key certificate. These certificate fingerprints are used when you configure your [BlackBerry Dynamics application policy file](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_2/blackberry-dynamics-sdk-android-devguide/Implementing-SafetyNet-attestation-for-BlackBerry-Dynamics-apps/Updating-the-BlackBerry-Dynamics-application-policy-file).
> After completeing the task:
> - For more information on the Google Play Console, see the [Google Play console documentation](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en&ref_topic=3450769&sjid=349614303780083206-NA).
> - For more information on device integrity, see the [Android developer documentation](https://developer.android.com/google/play/integrity/verdict#device-integrity-field).
##### Adding the GDSafetyNet library to the app project
The BlackBerry Dynamics SDK for Android version 5.0 and later includes a GDSafetyNet library. To support Play Integrity, you must add this library to the app project dependencies along with the main GDLibrary.

The GDSafetyNet library includes all of the client-side source code that is required to support Play Integrity. No additional app code is required. The GDSafetyNet library requires Google Play Services 11.0 or later to use device Play Integrity APIs. Verify that your BlackBerry Dynamics app is dependent on only a single version of Google Play Services.

If your app does not use Google Play Services, you can add the following to the build.gradle file:
```
implementation ('com.blackberry.blackberrydynamics:android_handheld_gd_safetynet:$DYNAMICS_SDK_VERSION')
```
If your app uses the Google Play Services SDK, you can add the following to the build.gradle file (where xx.x.x is the specific play-services version):
```
implementation 'com.google.android.gms:play-services-safetynet:xx.x.x'
implementation("com.blackberry.blackberrydynamics:android_handheld_gd_safetynet:$DYNAMICS_SDK_VERSION") {
        transitive = false;
}
```
It can be added in `BlackBerry-Dynamics-for-React-Native-Base/android/gd.gradle` before Base module is added to the application.
##### Updating the BlackBerry Dynamics application policy file
During a Play Integrity attestation process, BlackBerry UEM uses the app response to verify that it is communicating with the official version of the app. You must provide this information in the application policy file.

In order to configure Play Integrity, you will need to provide a Play App signing key. You have two options for a Play app signing key: you can use the Google Play generated app signing key or upload your own private app signing key. For information on finding your app signing keys in your Google Play Console, see "Prerequisites for Play Integrity attestation". The digest hash in your application policy file must correspond to your Play app signing key in your Google Play Console.

Example:
```
<?xml version="1.0" encoding="utf-8"?>
<apd:AppPolicyDefinition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:apd="urn:AppPolicySchema1.good.com" 
    xsi:schemaLocation="urn:AppPolicySchema1.good.com AppPolicySchema.xsd" >
    <pview>
        <pview>
            <sendto client="None" />
            <desc>Play Integrity Attestation Supported</desc>
            <pe ref="apkCertificateDigestSha256"/>
            <pe ref="apkPackageName" />
            <pe ref="Description" />
        </pview>
    </pview>
    <setting name="apkCertificateDigestSha256">
        <hidden>
            <key>blackberry.appMetadata.android.apkCertificateDigestSha256</key>
            <value>DD:83:CA:47:09:FA:C5:33:75:FE:F4:A1:B5:FB:F4:A8:E8:C2:7A:DF:AF:24:
0D:7B:E3:BA:BD:FB:A9:2B:F9:D6</value>
    </hidden>
    </setting>
    <setting name="apkPackageName">
        <hidden>
            <key>blackberry.appMetadata.android.apkPackageName</key>
            <value>com.good.gd.example.services.greetings.client</value>
        </hidden>
    </setting>
    <setting name="Description" >
        <text>
            <key>snet</key>
            <label>Play Integrity</label>
            <value>Play Integrity</value>
        </text>
    </setting>
</apd:AppPolicyDefinition>
```
The app is uniquely identified by the combination of the official package name (in the example above, blackberry.appMetadata.android.apkPackageName) and the digest hash of the official signing key (in the example above, blackberry.appMetadata.android.apkCertificateDigestSha256).

After you update the application policy file, coordinate with the BlackBerry UEM administrator to upload the app to UEM (see [Deploying your BlackBerry Dynamics app](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_2/blackberry-dynamics-sdk-android-devguide/lqi1489679309982)) and to upload the application policy file in the management console (see [Manage settings for a BlackBerry Dynamics app](https://docs.blackberry.com/en/endpoint-management/blackberry-uem/12_14/administration/blackberry-dynamics/vvq1471962941016) in the UEM Administration Guide). Before the administrator uploads the application policy file, verify that the Android app package ID has been specified or that the [app source file has been uploaded](https://docs.blackberry.com/en/endpoint-management/blackberry-uem/12_14/administration/blackberry-dynamics/Adding-Dynamics-apps/zjx1471960344735/cfn1476451456557); both settings are configured in the app entitlement settings (Android tab) in the management console.

UEM validates the format of the input package name and digest hash. If you update the application policy file and upload the app again, it can take up to 24 hours for the change to synchronize to all UEM instances. When the app is uploaded again, it is removed from the current list of apps that are enabled for attestation and must be added again.

More details about testing the app can be found [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/11_2/blackberry-dynamics-sdk-android-devguide/Implementing-SafetyNet-attestation-for-BlackBerry-Dynamics-apps/Testing-the-app).

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
 - Check you are using `0.70.x` or higher version of React Native.

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

### Flipper is disabled on Android
Flipper cannot be used together with BlackBerry Dynamics SDK for React Native on Android in debug configuration as it disables some BlackBerry Dynamics functionality related to secure networking.
Flipper is disabled on Android by default. If your Dynamics React Native application on Android does not use Secure Connectivity feature (`BlackBerry-Dynamics-for-React-Native-Networking` module) you can enable Flipper by uncommenting `initializeFlipper(this, getReactNativeHost().getReactInstanceManager());` line in `MainApplication.java` for ReactNative less than 71 version or uncommenting `ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());` line in `MainApplication.java` for ReactNative greater than or equal to 71 version of your application.

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

## Known React-Native issues
###  React Native Build Failed for iOS for Xcode 14.3 (14E222b)
There is a known react-native [issue](https://github.com/facebook/react-native/issues/36739#issuecomment-1495818734) with XCode 14.3 (14E222b) which is fixed in 0.71.6, 0.70.8 and 0.69.9 
### Metro server error on `0.72.0`, `0.72.1` React Native versions
There is an issue with loading Metro server on `0.72.0` and `0.72.1` versions when the error message is displayed during app load in Metro server: "Cannot read properties of undefined (reading 'addHelper')". The issue can be fixed by adding the following devDependency to the project:
`$ yarn add @babel/traverse@7.22.8 --dev`

### Issue with `activesupport` CocoaPods dependency on React Native versions `< 0.72.6`
There is an issue with `activesupport` Ruby gem when creating new React Native project with version `< 0.72.6`:
```
✖ Installing CocoaPods dependencies (this may take a few minutes)
error /Users/uvarl/AwesomeProject/vendor/bundle/ruby/2.7.0/gems/activesupport-7.1.1/lib/active_support/core_ext/array/conversions.rb:108:in `<class:Array>': undefined method `deprecator' for ActiveSupport:Module (NoMethodError)
```
##### Workaround
Create/update Gemfile in the root of your project and add this dependency:
```
gem 'activesupport', '~> 7.0.8'
```
Run following commands:
```
$ bundle update activesupport
$ bundle exec pod install
```
> NOTE: Same issue can occur when running Dynamics React Native sample apps. Please make sure that version `7.0.8` of `activesupport` Ruby gem is installed locally:
```
gem uninstall activesupport --version 7.x.x
gem install activesupport --version 7.0.8
```
