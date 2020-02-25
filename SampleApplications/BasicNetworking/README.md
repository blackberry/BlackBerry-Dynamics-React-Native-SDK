## BasicNetworking sample application
> BasicNetworking sample application shows example of using `fetch` and `XMLHttpRequest` in different ways, covers different HTTP request types (GET, POST, PUT, DELETE etc.), some authentication types (basic auth, Digest, NTLM), has a possibility to send data to the server of different types (text, JSON, FormData etc.) and receive response of different types if server supports it (ArrayBuffer, text, JSON, Blob, etc.).

#### How to prepare the app

Open the sample app directory in Terminal window:

`$ cd <path>/SampleApplications/BasicNetworking`

Install dependencies:
`$ npm i`

Generate ios and android directories:
`$ react-native upgrade --legacy true`

## Dynamics modules

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