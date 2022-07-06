# Sample Applications

## Supportability
 - 0.64.x (deprecated)
 - 0.65.x (deprecated)
 - 0.66.x
 - 0.67.x
 - 0.68.x (0.68.2 is latest supported)

## General tips

#### How to prepare the app
Open the sample app directory in Terminal window:

`$ cd <path>/SampleApplications/<sample_app_name>`

Install dependencies:
`$ yarn`

Generate ios and android directories:
`$ react-native eject`

###### iOS
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
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base

> Integrates Dynamics based on your current identifiers - iOS Bundle ID and Android Package Name.

	$ yarn set-bundle-id (Optional step, but required for sample applications)

> Allows to update an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.
###### iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to add Application module
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Application
###### iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to secure Networking
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking
###### iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to secure AsyncStorage
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Async-Storage
###### iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to secure SQLite Storage
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-SQLite-Storage
###### iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to secure AppKinetics communication
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-AppKinetics
###### iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to secure FileSystem
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem
###### iOS
	$ cd ios
	$ pod install
	$ cd ..

#### How to integrate Launcher
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Launcher
###### iOS
	$ cd ios
	$ pod install
	$ cd ..
	$ yarn integrate-launcher

#### How to secure Clipboard API
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Clipboard

#### How to secure `<Text />` UI component
	$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-Text

#### How to secure `<TextInput />` UI component
	$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-TextInput

#### How to secure `<WebView />` UI component
	$ yarn add <path>/ui-components/BlackBerry-Dynamics-for-React-Native-WebView
