## FileSystem sample application
> FileSystem sample application shows example of using secure FileSystem instance in React Native application. It demonstrates how to manage files/directories and how to upload/download files.

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/FileSystem`

Install dependencies:
`$ yarn`

> NOTE: FileSystem sample is based on `0.64.2` version of React Native. There is a possibility to upgrade to `0.65.0`, `0.65.1` or `0.66.0`, `0.66.1` versions by running following command:
`$ react-native upgrade 0.6x.x`
for example:
`$ react-native upgrade 0.65.1`
or
`$ react-native upgrade 0.66.1`

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

#### How to secure FileSystem
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem

##### Android

> NOTE: for Android, `BlackBerry-Dynamics-for-React-Native-FileSystem` is dependent on `BlackBerry-Dynamics-for-React-Native-Networking` module and you need to install `BlackBerry-Dynamics-for-React-Native-Networking` first.

	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking

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
##### 0.64.2
`$ cd <path>/SampleApplications/FileSystem`
`$ yarn`
`$ react-native eject`
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`
`$ yarn set-bundle-id`
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`
For iOS:
`$ cd ios`
`$ pod install`
`$ cd ..`
`$ react-native run-ios`
For Android:
`$ react-native run-android`
##### 0.65.1
`$ cd <path>/SampleApplications/FileSystem`
`$ yarn`
`$ cd .. ; git init ; cd FileSystem`
`$ react-native upgrade 0.65.1`
`$ react-native eject`
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`
`$ yarn set-bundle-id`
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`
For iOS:
`$ cd ios`
`$ pod install`
`$ cd ..`
`$ react-native run-ios`
For Android:
`$ react-native run-android`
