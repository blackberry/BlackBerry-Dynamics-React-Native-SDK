# BlackBerry-Dynamics-for-React-Native-Text

`BlackBerry-Dynamics-for-React-Native-Text` enables Data Leakage Prevention (DLP) within `<Text />` UI component for Android platform. More details about DLP on Android can be found [here](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/namespacecom_1_1good_1_1gd_1_1widget.html).
> NOTE: on iOS platform DLP is supported by default via Dynamics runtime after `BlackBerry-Dynamics-for-React-Native-Base` module is installed and linked. More details about DLP on iOS can be found [here](https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/interface_g_di_o_s.html).

# Supportability
#### React Native
 - 0.60.x
 - 0.61.x

## Preconditions
`BlackBerry-Dynamics-for-React-Native-Text` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.
## Installation
> Starting from `0.60` react-native supports auto-linking, so running `$ react-native link ...` command is not required.

    $ npm i <path>/ui-components/BlackBerry-Dynamics-for-React-Native-Text
    $ yarn

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ react-native run-ios
###### Android
    $ react-native run-android

## react-native-elements support

> [`react-native-elements`](https://github.com/react-native-elements/react-native-elements) is cross-platform React Native UI toolkit.
There are many ready-to-use UI components that can extend React Native application.

`react-native-elements` are implemented using original `Text` and `TextInput` components which means DLP is not supported by default.
In order to enable DLP within `react-native-elements` it is required to update imports in `<app_name>/node_modules/react-native-elements/src/*` according to following principle:
```javascript
import {Text, TextInput} from 'react-native'; 
```
should be replaced with
```javascript
import Text from 'BlackBerry-Dynamics-for-React-Native-Text';
import TextInput from 'BlackBerry-Dynamics-for-React-Native-TextInput';
```

## Usage
#### vanilla <Text />
> IMPORTANT: please apply the changes described above to enable DLP within `react-native-elements`
```javascript
// ...
import Text from 'BlackBerry-Dynamics-for-React-Native-Text';

// ...

export default class App extends Component {
    // ...
    render() {
        <Text selectable={true}>Content from this component cannot be copied to non-GD apps if DLP is on ...</Text>
    }
}
```
#### <Text /> from react-native-elements
```javascript
// ...
import { Text } from 'react-native-elements';

// ...

export default class App extends Component {
    // ...
    render() {
        <Text h1>Content from this component cannot be copied to non-GD apps if DLP is on ...</Text>
    }
}
```

## Uninstallation
    $ cd <appFolder>
    $ npm uninstall BlackBerry-Dynamics-for-React-Native-Text

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
