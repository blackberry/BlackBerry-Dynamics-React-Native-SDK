## AppKinetics sample application
> AppKinetics sample application shows example of using AppKinetics functionality.

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/AppKinetics`

Install dependencies:
`$ yarn`

> NOTE: AppKinetics sample is based on `0.63.2` version of React Native. There is a possibility to upgrade to `0.63.x` or `0.64.0` versions by running following command:
`$ react-native upgrade 0.63.x`
for example:
`$ react-native upgrade 0.63.3`
or
`$ react-native upgrade 0.64.0`

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

#### How to secure AppKinetics communication
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-AppKinetics

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
##### 0.63.2
`$ cd <path>/SampleApplications/AppKinetics`  
`$ yarn`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-AppKinetics`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
For iOS:
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ react-native run-ios`  
For Android:  
`$ react-native run-android`
##### 0.64.0
`$ cd <path>/SampleApplications/AppKinetics`  
`$ yarn`  
`$ cd .. ; git init ; cd AppKinetics`  
`$ react-native upgrade 0.64.0`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-AppKinetics`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ react-native run-ios`  
For Android:  
`$ react-native run-android`
