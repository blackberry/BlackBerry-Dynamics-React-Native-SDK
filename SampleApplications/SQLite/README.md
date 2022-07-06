## SQLite sample application
> SQLite sample application shows example of using secure SQLite DB instance in React Native application.

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/SQLite`

Install dependencies:
`$ yarn`

> NOTE: SQLite sample is based on `0.66.4` version of React Native. There is a possibility to upgrade to `0.67.x` or `0.68.x` versions (`0.67.0` - `0.67.4`, `0.68.0` - `0.68.2`) by running one of following commands:
`$ react-native upgrade 0.6x.x`
for example:
`$ react-native upgrade 0.67.4`
or
`$ react-native upgrade 0.68.2`

Generate ios and android directories:
`$ react-native eject`

## Dynamics modules
#### Prerequisites
There are some dependencies that need to be installed before using `BlackBerry-Dynamics-for-React-Native-Base` module. More information can be found [here](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#Preconditions).
#### How to integrate Dynamics into application
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base

> Integrates Dynamics based on your current identifiers - iOS Bundle ID and Android Package Name.

	$ yarn set-bundle-id (Optional step, but required for sample applications)

> Allows to update an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

#### How to secure SQLite Storage
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-SQLite-Storage

#### How to secure FileSystem
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem

##### iOS
`$ cd ios`  
`$ pod install`  
`$ cd ..`

#### How to run application
##### iOS
`$ react-native run-ios`

##### Android
`$ react-native run-android`

#### Examples of usage
##### 0.66.4
`$ cd <path>/SampleApplications/SQLite`  
`$ yarn`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-SQLite-Storage`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ react-native run-ios`  
For Android:  
`$ react-native run-android`  
##### 0.68.2
`$ cd <path>/SampleApplications/SQLite`  
`$ yarn`  
`$ cd .. ; git init ; cd SQLite`  
`$ react-native upgrade 0.68.2`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-SQLite-Storage`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ react-native run-ios`  
For Android:  
`$ react-native run-android`
