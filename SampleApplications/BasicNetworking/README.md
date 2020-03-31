## BasicNetworking sample application
> BasicNetworking sample application shows example of using `fetch` and `XMLHttpRequest` in different ways, covers different HTTP request types (GET, POST, PUT, DELETE etc.), some authentication types (basic auth, Digest, NTLM), has a possibility to send data to the server of different types (text, JSON, FormData etc.) and receive response of different types if server supports it (ArrayBuffer, text, JSON, Blob, etc.).

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/BasicNetworking`

Install dependencies:
`$ yarn`

> NOTE: BasicNetworking sample is based on `0.60.6` version of React Native. There is a possibility to upgrade to `0.61.x` by running following command:
`$ react-native upgrade 0.61.x`
for example:
`$ react-native upgrade 0.61.5`

Generate ios and android directories:
`$ react-native eject`

## Dynamics modules
#### Prerequisites
There are some dependencies that need to installed before using `BlackBerry-Dynamics-for-React-Native-Base` module. More information can be found [here](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#Preconditions).
> NOTE: BasicNetworking sample provides ability to send files from device's external storage as `FormData` to the server. 

#### How to integrate Dynamics into application
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base
	
> You will be asked to choose an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

#### How to secure communication
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking

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
`$ cd <path>/SampleApplications/BasicNetworking`
`$ yarn`
`$ react-native eject`
`$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`
`$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`
`$ yarn`
For iOS:
`$ cd ios`
`$ pod install`
`$ cd ..`
`$ react-native run-ios`
For Android:
`$ react-native run-android`
##### 0.61.5
`$ cd <path>/SampleApplications/BasicNetworking`
`$ yarn`
`$ react-native upgrade 0.61.5`
`$ react-native eject`
`$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`
`$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`
`$ yarn`
For iOS:
`$ cd ios`
`$ pod install`
`$ cd ..`
`$ react-native run-ios`
For Android:
`$ react-native run-android`
