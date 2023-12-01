# BlackBerry-Dynamics-for-React-Native-Clipboard

`BlackBerry-Dynamics-for-React-Native-Clipboard` secures [Clipboard](https://github.com/react-native-clipboard/clipboard/) API `v1.11.1` in React Native.
Clipboard API works in combination with Data Leakage Prevention (DLP). More details about DLP on Android can be found [here](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/namespacecom_1_1good_1_1gd_1_1widget.html).
> NOTE: on iOS Clipboard API is secured by default by Dynamics runtime after `BlackBerry-Dynamics-for-React-Native-Base` module is installed and linked. More details about DLP on iOS can be found [here](https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/interface_g_di_o_s.html).

## Supportability
#### React Native
 - 0.66.x (deprecated)
 - 0.67.x (deprecated)
 - 0.68.x (deprecated)
 - 0.69.x (deprecated)
 - 0.70.x
 - 0.71.x
 - 0.72.x

## Preconditions
`BlackBerry-Dynamics-for-React-Native-Clipboard` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.
## Installation
    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Clipboard

##### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ npx react-native run-ios
##### Android
    $ npx react-native run-android

## Usage
```javascript
// ...
import Clipboard from 'BlackBerry-Dynamics-for-React-Native-Clipboard';
// ...
```
API reference can be found [here](https://github.com/react-native-clipboard/clipboard/tree/v1.11.1#reference).

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-Clipboard

##### iOS
    $ cd ios
    $ pod install
    $ cd ..
