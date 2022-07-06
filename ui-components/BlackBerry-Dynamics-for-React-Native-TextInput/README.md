# BlackBerry-Dynamics-for-React-Native-TextInput
`BlackBerry-Dynamics-for-React-Native-TextInput` enables Data Leakage Prevention (DLP) within `<TextInput />` UI component for Android platform. More details about DLP on Android can be found [here](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/namespacecom_1_1good_1_1gd_1_1widget.html).
> NOTE: on iOS platform DLP is supported by default via Dynamics runtime after `BlackBerry-Dynamics-for-React-Native-Base` module is installed and linked. More details about DLP on iOS can be found [here](https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/interface_g_di_o_s.html).

# Supportability
 - 0.64.x (deprecated)
 - 0.65.x (deprecated)
 - 0.66.x
 - 0.67.x
 - 0.68.x (0.68.2 is latest supported)

## Preconditions
`BlackBerry-Dynamics-for-React-Native-TextInput` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.
## Installation

    $ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-TextInput

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
#### vanilla <TextInput />
```javascript
// ...
import TextInput from 'BlackBerry-Dynamics-for-React-Native-TextInput';

// ...

export default class App extends Component {
    // ...
    render() {
        <TextInput
            style={styles.input}
            placeholder='Content from this component cannot be copied to non-GD apps if DLP is on ...'
            value={this.state.singleLineInputValue}
            onChangeText={this.updateSingleLineInput}
        />
    }
}
```
#### <Input /> from react-native-elements
> IMPORTANT: please apply the changes described above to enable DLP within `react-native-elements`
```javascript
// ...
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';

// ...

export default class App extends Component {
    // ...
    render() {
        <Input
          placeholder='BASIC INPUT'
        />
        
        <Input
          placeholder='INPUT WITH ICON'
          leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}
        />
        
        <Input
          placeholder='INPUT WITH CUSTOM ICON'
          leftIcon={
            <Icon
              name='user'
              size={24}
              color='black'
            />
          }
        />
        
        <Input
          placeholder='INPUT WITH ERROR MESSAGE'
          errorStyle={{ color: 'red' }}
          errorMessage='ENTER A VALID ERROR HERE'
        />
    }
}
```

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-TextInput

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
