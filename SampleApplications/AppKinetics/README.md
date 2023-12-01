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

> NOTE: AppKinetics sample is based on `0.70.0` version of React Native. There is a possibility to upgrade to `0.70.x`, `0.71.x`, `0.72.x`  versions (`0.70.1` - `0.70.10`, `0.71.0` - `0.71.13`, `0.72.0` - `0.72.4`) by running one of following commands:
`$ npx react-native upgrade 0.70.x`
for example:
`$ npx react-native upgrade 0.70.10`
or
`$ npx react-native upgrade 0.71.13`
or
`$ npx react-native upgrade 0.72.4`

Generate ios and android directories:
`$ npx react-native eject`

Generate ios and android directories:
`$ npx react-native eject`

> There is a known issue with loading Metro server on `0.72.0` and `0.72.1` versions when the error message is displayed during app load in Metro server: "Cannot read properties of undefined (reading 'addHelper')". The issue can be fixed by adding the following devDependency to the project:
`$ yarn add @babel/traverse@7.22.8 --dev`  

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
Different `ruby` versions might be install on the machine. Especially it is related to React Native v`0.70.x` projects.
Depending on your Mac configuration following error can occur when running `pod install` command:
```
Traceback (most recent call last):
	4: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/ruby_executable_hooks:22:in `<main>'
	3: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/ruby_executable_hooks:22:in `eval'
	2: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/pod:23:in `<main>'
	1: from /Users/vtaliar/.rvm/rubies/ruby-2.7.5/lib/ruby/2.7.0/rubygems.rb:296:in `activate_bin_path'
/Users/vtaliar/.rvm/rubies/ruby-2.7.5/lib/ruby/2.7.0/rubygems.rb:277:in `find_spec_for_exe': can't find gem cocoapods (>= 0.a) with executable pod (Gem::GemNotFoundException)
```
More details can be found [here](https://medium.com/@pk60905/bundle-install-and-bundle-update-80f3d6f52214).

`$ bundle install` - needed on some `0.70.x` versions to fix the issue above  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  

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
`$ npx react-native run-ios`

##### Android
`$ npx react-native run-android`

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
##### 0.70.0
`$ cd <path>/SampleApplications/AppKinetics`  
`$ yarn`  
`$ git init`  
`$ npx react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
It is suggested to use **`com.blackberry.bbd.example.cdv.appkinetics.client`** here. An app with this ID is already configured on UEM as a service provider of **`transfer-file`** service, so it can both send and receive files.
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-AppKinetics`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
For iOS:  
`$ bundle install`  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`
##### 0.70.10
`$ cd <path>/SampleApplications/AppKinetics`  
`$ yarn`  
`$ git init`  
`$ npx react-native upgrade 0.70.10`  
`$ npx react-native eject`  
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
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`
##### 0.72.0
`$ cd <path>/SampleApplications/AppKinetics`  
`$ yarn`  
`$ yarn add @babel/traverse@7.22.8 --dev` - OPTIONAL: needed on `0.72.0`, `0.72.1` versions to fix the error mentioned above in Metro server  
`$ git init`  
`$ npx react-native upgrade 0.72.0`  
`$ npx react-native eject`  
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
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`
