## AppKinetics sample application
The AppKinetics sample application demonstrates:
 - Service discovery (using **`transfer-file`** service).
 - Sending files **to** other Dynamics applications (consumption of **`transfer-file`** service).
 - Receive files **from** other Dynamics applications (providing **`transfer-file`** service).
 - Compose secure emails with attachments and send them via **BlackBerry Work**.

## Required configuration on UEM
In order to be able to send files to other Dynamics application the appropriate app should be properly configured on UEM and act as a service provider of **`transfer-file`** service.
List of Dynamics application-based services can be found [here](https://marketplace.blackberry.com/services).

Some Dynamics apps are already configured on UEM and have functionality to show files contents, such as:
 - BlackBerry Work available on Apple App Store and Google Play Market
 - Dynamics AppKinetics for [iOS](https://get.good.com/samples/ios/com.good.gd.example.appkinetics.zip) and [Android](https://get.good.com/samples/android/AppKinetics.zip)
 - Dynamics Cordova AppKinetics Server - part of Dynamics SDK for Cordova that can be downloaded [here](https://developers.blackberry.com/us/en/resources/downloads)
 - Dynamics Ionic-Cordova Secure-ICC available on [BlackBerry GitHub](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Samples/tree/master/Secure-ICC)
 - Dynamics Ionic-Capacitor Secure-ICC available on [BlackBerry GitHub](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Samples/tree/master/Secure-ICC-Ionic-Capacitor-Angular)

Any app from the list can be added to your user's allowed apps list on UEM and activated.

#### Enable service discovery
Any other Dynamics application can be configured and be able to act as a service provider of **`transfer-file`** service and receive files:
1. Navigate to the "Apps" Tab
2. Select "+"
3. Select "Internal BlackBerry Dynamics App"
4. Input your `GDApplicationID` / `GDApplicationVersion` from `Info.plist`
5. Save
6. Under `version` select the "+" option
7. **Bind** the required services to the application
	Select the services that the app is going to use. Enabling these in UEM ensures that other Dynamics apps can discover this app as a service provider.
    **Examples of services:**
	- `Transfer Multiple Files Service`
	- `Email Message`
	- `Transfer File Service`
	**NOTE**: _If you do not enable **`transfer-file`** service in UEM for your Dynamics app, the AppKinetics sample will not fully function as it will not discover it as app that can receive files._
8. Go to the "Users" Tab
9. Assign your newly configured app to your user
10. Proceed with activation

## How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/AppKinetics`

Install dependencies:
`$ yarn`

NOTE: AppKinetics sample is based on `0.66.4` version of React Native. There is a possibility to upgrade to `0.67.x` or `0.68.x` versions (`0.67.0` - `0.67.4`, `0.68.0` - `0.68.2`) by running one of following commands:
`$ react-native upgrade 0.6x.x`
for example:
`$ react-native upgrade 0.67.4`
or
`$ react-native upgrade 0.68.2`

Generate ios and android directories:
`$ react-native eject`

Generate ios and android directories:
`$ react-native eject`

## Install Dynamics modules
#### Prerequisites
There are some dependencies that need to be installed before using `BlackBerry-Dynamics-for-React-Native-Base` module. More information can be found [here](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#Preconditions).

#### How to integrate Dynamics into application
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base

> Integrates Dynamics based on your current identifiers - iOS Bundle ID and Android Package Name.

	$ yarn set-bundle-id (Optional step, but required for sample applications)

> Allows to update an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

It is suggested to use **`com.blackberry.bbd.example.cdv.appkinetics.server`** here. An app with this ID (`Dynamics Cordova AppKinetics Server` sample app) is already configured on UEM as a service provider of **`transfer-file`** service, so it can receive files.

#### How to enable ICC communication
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

#### How to secure FileSystem
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem

`FileSystem` module is dependent on `Networking` module, so we need to install it as well:

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

## Prepare files that will be sent to other app
In order to send files to other Dynamics applications files need to be stored in appropriate location.
#### Android
_`BlackBerry_Dynamics_SDK_for_React_Native_vX.X.X.X/SampleApplications/AppKinetics/android/app/src/main/assets/data`_
#### iOS
_`BlackBerry_Dynamics_SDK_for_React_Native_vX.X.X.X/SampleApplications/AppKinetics/ios/AppKinetics/data`_
Also, open the app in Xcode and drag-n-drop **`data`** folder (from _`AppKinetics/ios/AppKinetics/data`_) to **`AppKinetics`** group so it is recognized as part of the project.

Files then will be copied to secure container using **`copyFilesToSecureStorage`** API from `AppKinetics` module and can be transfered to other Dynamics application that is a service provider of **`transfer-file`** service.

## Enable Keychain Sharing on iOS
Both Dynamics apps that participate in Inter-Container Communication (ICC) must share the same **`com.good.gd.data`** Keychain group and have **`com.good.gd.discovery.good`** URL scheme set.
#### Configure service consumer
Dynamics React Native AppKinetics sample can act as service consumer of **`transfer-file`** service, in other words, it can send files to other Dynamics apps. For this to be done let's enable **`com.good.gd.data`** Keychain group and set **`com.good.gd.discovery.good`** URL scheme:
1. Open `BlackBerry_Dynamics_SDK_for_React_Native_vX.X.X.X/SampleApplications/AppKinetics/ios/AppKinetics.xcworkspace` in Xcode
2. Go `Signing & Capabilities` to tab
3. Click `+` and search for `Keychain Sharing` capability
4. Add **`com.good.gd.data`** Keychain group
5. Go `Info` to tab
6. Expand `URL types` section
7. Add **`com.good.gd.discovery.good`** URL scheme

#### Configure service provider
Native Dynamics AppKinetics sample is a service provider of **`transfer-file`** service, in other words, it can receive files from other Dynamics apps. For this **`com.good.gd.data`** Keychain group and **`com.good.gd.discovery.good`** URL scheme should be configured as well:
1. Download and unzip [native AppKinetics sample for iOS](https://get.good.com/samples/ios/com.good.gd.example.appkinetics.zip).
2. Open `<path>/com.good.gd.example.appkinetics/AppKinetics.xcodeproj` in Xcode
3. Do steps **2. - 7.** from the section above
4. Install and activate

## Examples of usage
##### 0.66.4
`$ cd <path>/SampleApplications/AppKinetics`  
`$ yarn`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
It is suggested to use **`com.blackberry.bbd.example.cdv.appkinetics.client`** here. An app with this ID is already configured on UEM as a service provider of **`transfer-file`** service, so it can both send and receive files.
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
##### 0.68.2
`$ cd <path>/SampleApplications/AppKinetics`  
`$ yarn`  
`$ cd .. ; git init ; cd AppKinetics`  
`$ react-native upgrade 0.68.2`  
`$ react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`
It is suggested to use **`com.blackberry.bbd.example.cdv.appkinetics.client`** here. An app with this ID is already configured on UEM as a service provider of **`transfer-file`** service, so it can both send and receive files.
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
