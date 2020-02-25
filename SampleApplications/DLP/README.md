## DLP sample application
> DLP sample application demonstrates usage of `<Text />` and `<TextInput />` UI components together with DLP policy option on UEM. If DLP is on, it will not be possible to do cut-copy-paste operations over data from "Dynamics" to "non-Dynamics" application and vice-versa.

#### How to prepare the app

Open the sample app directory in Terminal window:

`$ cd <path>/SampleApplications/DLP`

Install dependencies:
`$ npm i`

Generate ios and android directories:
`$ react-native upgrade --legacy true`

## Dynamics modules

#### How to integrate Dynamics into application
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base
	
> You will be asked to choose an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

#### How to secure `<Text />` UI component
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Text

#### How to secure `<TextInput />` UI component
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-TextInput

#### How to link native dependencies

> IMPORTANT: React Native starting from 0.60 version supports auto-linking. This means that running `link` command is no longer required. No actions are needed on Android, but on iOS it is needed to run `pod install` command whilst in the ios folder of the application. 

###### 0.60+ on iOS
`$ cd ios`
`$ pod install`
`$ cd ..`

#### How to secure `react-native-elements`
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

#### How to run application

##### iOS

`$ react-native run-ios`

##### Android

`$ react-native run-android`

## Known limitations
#### `react-native-vector-icons` should be linked manually
DLP sample application uses `react-native-elements` to show that after some simple steps `react-native-elements` also work securely in terms of Data Leakage Prevention.
`react-native-elements` depends on `react-native-vector-icons` that cannot be auto-linked so it should be linked manually as stated here: https://github.com/oblador/react-native-vector-icons.
