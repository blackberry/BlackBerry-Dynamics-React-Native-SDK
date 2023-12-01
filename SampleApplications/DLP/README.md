## DLP sample application
> DLP sample application demonstrates usage of `<Text />` and `<TextInput />` UI components together with DLP policy option on UEM. If DLP is on, it will not be possible to do cut-copy-paste operations over data from "Dynamics" to "non-Dynamics" application and vice-versa.

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/DLP`

Install dependencies:
`$ yarn`

> NOTE: DLP sample is based on `0.70.0` version of React Native. There is a possibility to upgrade to `0.70.x`, `0.71.x`, `0.72.x` versions (`0.70.1` - `0.70.10`, `0.71.0` - `0.71.13`, `0.72.0` - `0.72.4`) by running one of following commands:
`$ npx react-native upgrade 0.70.x`
for example:
`$ npx react-native upgrade 0.70.10`
or
`$ npx react-native upgrade 0.71.13`
or
`$ npx react-native upgrade 0.72.4`

Generate ios and android directories:
`$ npx react-native eject`

> There is a known issue with loading Metro server on `0.72.0` and `0.72.1` versions when the error message is displayed during app load in Metro server: "Cannot read properties of undefined (reading 'addHelper')". The issue can be fixed by adding the following devDependency to the project:
`$ yarn add @babel/traverse@7.22.8 --dev`  

## Dynamics modules
#### Prerequisites
There are some dependencies that need to be installed before using `BlackBerry-Dynamics-for-React-Native-Base` module. More information can be found [here](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#Preconditions).
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
Different `ruby` versions might be install on the machine. Especially it is related to React Native v`0.70.x` projects.
Depending on your Mac configuration following error can occur when running `pod install` command:
```
Traceback (most recent call last):
	4: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/ruby_executable_hooks:22:in `<main>'
	3: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/ruby_executable_hooks:22:in `eval'
	2: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/pod:23:in `<main>'
	1: from /Users/vtaliar/.rvm/rubies/ruby-2.7.5/lib/ruby/2.7.0/rubygems.rb:296:in `activate_bin_path'
/Users/vtaliar/.rvm/rubies/ruby-2.7.5/lib/ruby/2.7.0/rubygems.rb:277:in `find_spec_for_exe': can't find gem cocoapods (>= 0.a) with executable pod (Gem::GemNotFoundException)
```
More details can be found [here](https://medium.com/@pk60905/bundle-install-and-bundle-update-80f3d6f52214).

`$ bundle install` - needed on some `0.70.x` versions to fix the issue above  
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
`$ npx react-native run-ios`

##### Android
`$ npx react-native run-android`

#### Examples of usage
##### 0.70.0
`$ cd <path>/SampleApplications/DLP`  
`$ yarn`  
`$ git init`  
`$ npx react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-Text`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-TextInput`  
`$ yarn set-text-config`  
For iOS:  
`$ bundle install`  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`  
##### 0.70.10
`$ cd <path>/SampleApplications/DLP`  
`$ yarn`  
`$ git init`  
`$ npx react-native upgrade 0.70.10`  
`$ npx react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-Text`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-TextInput`  
`$ yarn set-text-config`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`
##### 0.72.0
`$ cd <path>/SampleApplications/DLP`  
`$ yarn`  
`$ yarn add @babel/traverse@7.22.8 --dev` - OPTIONAL: needed on `0.72.0`, `0.72.1` versions to fix the error mentioned above in Metro server  
`$ git init`  
`$ npx react-native upgrade 0.72.0`  
`$ npx react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-Text`  
`$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-TextInput`  
`$ yarn set-text-config`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`

## Known issues
#### Unrecognized font family 'Material Icons'
When running the `DLP` sample on iOS following issue can occur: [Unrecognized font family 'Material Icons'](https://github.com/oblador/react-native-vector-icons/issues/965).
It can be resolved if to apply following fix: [Update Info.plist by setting UIAppFonts](https://github.com/oblador/react-native-vector-icons/issues/965#issuecomment-809106674).
