## BasicNetworking sample application
> BasicNetworking sample application shows example of using `fetch` and `XMLHttpRequest` in different ways, covers different HTTP request types (GET, POST, PUT, DELETE etc.), some authentication types (basic auth, Digest, NTLM), has a possibility to send data to the server of different types (text, JSON, FormData etc.) and receive response of different types if server supports it (ArrayBuffer, text, JSON, Blob, etc.).

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/BasicNetworking`

Install dependencies:
`$ yarn`

> NOTE: BasicNetworking sample is based on `0.66.4` version of React Native. There is a possibility to upgrade to `0.67.x` or `0.68.x` versions (`0.67.0` - `0.67.4`, `0.68.0` - `0.68.2`) by running one of following commands:
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
> NOTE: BasicNetworking sample provides ability to send files from device's external storage as `FormData` to the server.

#### How to integrate Dynamics into application
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base

> Integrates Dynamics based on your current identifiers - iOS Bundle ID and Android Package Name.

	$ yarn set-bundle-id (Optional step, but required for sample applications)

> Allows to update an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

#### How to secure communication
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
##### 0.66.4
`$ cd <path>/SampleApplications/BasicNetworking`  
`$ yarn`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ react-native run-ios`  
For Android:  
`$ react-native run-android`
##### 0.68.2
`$ cd <path>/SampleApplications/BasicNetworking`  
`$ yarn`  
`$ cd .. ; git init ; cd BasicNetworking`  
`$ react-native upgrade 0.68.2`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ react-native run-ios`  
For Android:  
`$ react-native run-android`
