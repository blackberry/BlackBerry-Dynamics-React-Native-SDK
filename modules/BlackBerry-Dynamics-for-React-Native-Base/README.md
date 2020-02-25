# BlackBerry-Dynamics-for-React-Native-Base

`BlackBerry-Dynamics-for-React-Native-Base` automatically integrates the BlackBerry Dynamics SDK for iOS and Android into a React Native application.

## Setup environment
Please setup your environment as described in the [React Native documentation](https://facebook.github.io/react-native/docs/getting-started). 

## Preconditions

#### Install required dependencies using RubyGems
	$ gem install xcodeproj
	$ gem install plist
#### Install BlackBerry Dynamics SDK
Download and install the BlackBerry Dynamics SDK for iOS or Android as described on [BlackBerry Developers](https://developers.blackberry.com/us/en/resources/downloads.html).


## Installation
#### react-native@0.60.5
> Starting from `0.60` react-native supports auto-linking, so running `$ react-native link ...` command is not required.
> Additionally, from `0.60` react-native supports `Cocoa Pods` for dependency management on iOS platform. So it is required to do `pod install` to install some native dependencies.

	$ react-native init <appFolder> --version 0.60.5
	$ cd <appFolder>
	$ npm i <path>/modules/BlackBerry-Dynamics-for-React-Native-Base
> You will be asked to choose an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

##### iOS
 	$ cd ios
	$ pod install
	$ cd ..
 	$ react-native run-ios

##### Android
	$ react-native run-android

## Activation

To activate your new BlackBerry Dynamics application with the BlackBerry UEM management console, please see the 'Deploy and Test' section of [Get Started with BlackBerry Dynamics SDK](https://developers.blackberry.com/us/en/resources/get-started/blackberry-dynamics-getting-started.html?platform=ios#step-1).


## Uninstallation
	$ cd <appFolder>
	$ react-native uninstall BlackBerry-Dynamics-for-React-Native-Base

##### iOS
    $ cd ios
    $ pod install
    $ cd ..
