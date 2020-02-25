# Sample Applications

## Supportability
#### React Native
 - 0.60.x
 - 0.61.x

## General tips

#### How to prepare the app
Open the sample app directory in Terminal window:

`$ cd <path>/SampleApplications/<sample_app_name>`

Install dependencies:
`$ npm i`

Generate ios and android directories:
`$ react-native upgrade --legacy true`

#### How to re-use samples code?
> NOTE: neither `$ react-native eject` nor `$ react-native upgrade --legacy true` is supported by React Native 0.61.x
There is no any command defined in 0.61 React Native CLI to generate ios and android folders for existing application.

In order to run `<path>/SampleApplications/<sample_app_name>` on 0.61 version of React Native new application should be created with `$ react-native init` command, then copy `*.js` files and dependencies from `package.json`.

#### How to link native dependencies

> IMPORTANT: React Native starting from 0.60 version supports auto-linking. This means that running `link` command is no longer required. No actions are needed on Android, but on iOS it is needed to run `pod install` command whilst in the ios folder of the application. 

###### 0.60+ on iOS
`$ cd ios`
`$ pod install`
`$ cd ..`

#### How to run application

##### iOS

`$ react-native run-ios`

##### Android

`$ react-native run-android`

## Dynamics modules

#### How to integrate Dynamics into application
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base
	
> You will be asked to choose an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.
###### 0.60+ on iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to secure communication
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking

#### How to secure AsyncStorage
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Async-Storage
###### 0.60+ on iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to secure SQLite Storage
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-SQLite-Storage
###### 0.60+ on iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to secure Clipboard API
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Clipboard

#### How to secure `<Text />` UI component
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Text

#### How to secure `<TextInput />` UI component
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-TextInput
