## Clipboard sample application
> Clipboard sample application demonstrates usage of [Clipboard](https://facebook.github.io/react-native/docs/clipboard) API in terms of Data Leakage Prevention. It is possible to change DLP policy on UEM and see how it affects the clipboard within the application. If DLP is on, it will not be possible to paste data from clipboard to "non-Dynamics" application.

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/ClipboardTestApp`

Install dependencies:
`$ yarn`

> NOTE: ClipboardTestApp sample is based on `0.60.6` version of React Native. There is a possibility to upgrade to `0.61.x` by running following command:
`$ react-native upgrade 0.61.x`
for example:
`$ react-native upgrade 0.61.5`

Generate ios and android directories:
`$ react-native eject`

## Dynamics modules
#### Prerequisites
There are some dependencies that need to installed before using `BlackBerry-Dynamics-for-React-Native-Base` module. More information can be found [here](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#Preconditions).
#### How to integrate Dynamics into application
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base
	
> You will be asked to choose an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

#### How to secure Clipboard API
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Clipboard

#### How to link native dependencies
> IMPORTANT: React Native starting from 0.60 version supports auto-linking. This means that running `link` command is no longer required. 
> No actions are needed on Android, but on iOS it is needed to run `pod install` command whilst in the ios folder of the application. 

##### 0.60+ on iOS
`$ cd ios`
`$ pod install`
`$ cd ..`

#### How to run application
##### iOS
`$ react-native run-ios`

##### Android
`$ react-native run-android`

#### Examples of usage
##### 0.60.6
`$ cd <path>/SampleApplications/ClipboardTestApp`
`$ yarn`
`$ react-native eject`
`$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`
`$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Clipboard`
`$ yarn`
For iOS:
`$ cd ios`
`$ pod install`
`$ cd ..`
`$ react-native run-ios`
For Android:
`$ react-native run-android`
##### 0.61.5
`$ cd <path>/SampleApplications/ClipboardTestApp`
`$ yarn`
`$ react-native upgrade 0.61.5`
`$ react-native eject`
`$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`
`$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Clipboard`
`$ yarn`
For iOS:
`$ cd ios`
`$ pod install`
`$ cd ..`
`$ react-native run-ios`
For Android:
`$ react-native run-android`
