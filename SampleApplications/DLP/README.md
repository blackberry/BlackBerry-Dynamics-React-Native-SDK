## DLP sample application
> DLP sample application demonstrates usage of `<Text />` and `<TextInput />` UI components together with DLP policy option on UEM. If DLP is on, it will not be possible to do cut-copy-paste operations over data from "Dynamics" to "non-Dynamics" application and vice-versa.

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/DLP`

Install dependencies:
`$ yarn`

> NOTE: DLP sample is based on `0.63.2` version of React Native. There is a possibility to upgrade to `0.63.x` by running following command:
`$ react-native upgrade 0.63.x`
for example:
`$ react-native upgrade 0.63.3`

Generate ios and android directories:
`$ react-native eject`

## Dynamics modules
#### Prerequisites
There are some dependencies that need to installed before using `BlackBerry-Dynamics-for-React-Native-Base` module. More information can be found [here](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#Preconditions).
#### How to integrate Dynamics into application
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base

> Integrates Dynamics based on your current identifiers - iOS Bundle ID and Android Package Name.

	$ yarn set-bundle-id (Optional step, but required for sample applications)

> Allows to update an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

#### How to secure `<Text />` UI component
	$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-Text

> NOTE: `BlackBerry-Dynamics-for-React-Native-Text` should be the last package added to your project dependencies. Adding modules or UI components after `BlackBerry-Dynamics-for-React-Native-Text` can override some important configurations that may cause following exception during application launch: `"Text strings must be rendered within a <Text> component"`. If this is the case please run `yarn set-text-config` command to put needed configurations back. This action should be repeated when add/remove other packages.

#### How to secure `<TextInput />` UI component
	$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-TextInput

##### iOS
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

#### Examples of usage
##### 0.63.2
`$ cd <path>/SampleApplications/DLP`  
`$ yarn`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-Text`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-TextInput`  
`$ yarn set-text-config`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ react-native run-ios`  
For Android:  
`$ react-native run-android`  
##### 0.63.x
`$ cd <path>/SampleApplications/DLP`  
`$ yarn`  
`$ cd .. ; git init ; cd DLP`  
`$ react-native upgrade 0.63.3`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-Text`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-TextInput`  
`$ yarn set-text-config`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ react-native run-ios`  
For Android:  
`$ react-native run-android`
