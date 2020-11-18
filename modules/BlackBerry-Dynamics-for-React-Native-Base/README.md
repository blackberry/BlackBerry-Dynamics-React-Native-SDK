# BlackBerry-Dynamics-for-React-Native-Base

`BlackBerry-Dynamics-for-React-Native-Base` automatically integrates the BlackBerry Dynamics SDK for iOS and Android into a React Native application.

## Setup environment
Please setup your environment as described in the [React Native documentation](https://facebook.github.io/react-native/docs/getting-started). 

## Supportability
#### React Native
 - 0.63.x

## Preconditions

#### Install required dependencies using RubyGems
	$ gem install xcodeproj
	$ gem install plist
#### Install BlackBerry Dynamics SDK
Download one of the supported versions of the BlackBerry Dynamics SDK for iOS / Android (for manual installation only) from [BlackBerry Developers](https://developers.blackberry.com/us/en/resources/downloads.html) and follow installation steps attached below.
> When you click the link, you are prompted to log in to the Developer site with your BlackBerry Online Account. If you don’t already have an account, you can register and create one.

To download appropriate version from [BlackBerry Developers](https://developers.blackberry.com/us/en/resources/downloads.html) use following steps:
1. Select "Prior Releases".
2. Select "Dynamics SDK for iOS" or "Dynamics SDK for Android" product from drop down menu.
3. Find appropriate product version and download it by link.

##### BlackBerry Dynamics SDK for iOS
Supported versions of the BlackBerry Dynamics SDK for iOS:
- `Static Framework v8.1`
> IMPORTANT: static framework is the only framework, that is supported by the BlackBerry Dynamics SDK for React Native right now.

BlackBerry Dynamics SDK for iOS can be installed via installer package downloaded from [BlackBerry Developers](https://developers.blackberry.com/us/en/resources/downloads.html) using the instructions above.

Steps to install BlackBerry Dynamics SDK for iOS from downloaded package:
1. In the macOS GUI (not a shell), uncompress the SDK package.
2. Double-click BlackBerry_Dynamics_SDK_for_iOS_<version>.pkg.
3. Follow the prompts to install the package.

##### BlackBerry Dynamics SDK for Android
Supported versions of the BlackBerry Dynamics SDK for Android:
- `BlackBerry Dynamics SDK for Android - v8.1`

There are 2 supported ways to install the BlackBerry Dynamics SDK for Android:
- Installation via the Android SDK manager: start the Android SDK Manager and follow the steps detailed in [Getting Started with the BlackBerry Dynamics SDK for Android](https://developers.blackberry.com/us/en/resources/get-started/blackberry-dynamics-getting-started.html?platform=android#step-2) from "Install the SDK using the Android SDK Manager" section on the BlackBerry Developers website.
Please note, it will be installed the latest available version of BlackBerry Dynamics SDK for Android from BlackBerry Developers website. If you need some older version, that is currently supported by BlackBerry Dynamics SDK for React Native, than use manual installation instead.
- Manual installation: download appropriate version from [BlackBerry Developers](https://developers.blackberry.com/us/en/resources/downloads.html) using the instructions above. For further installation follow the steps detailed in [Getting Started with the BlackBerry Dynamics SDK for Android](https://developers.blackberry.com/us/en/resources/get-started/blackberry-dynamics-getting-started.html?platform=android#step-2) from "Manually download & install the SDK" section on the BlackBerry Developers website.

> It is recommended to install the BlackBerry Dynamics SDK for Android via the Android SDK Manager. If you are unable to use the Android SDK Manager, you can install the SDK manually.

## Installation
#### react-native

	$ react-native init <appFolder> --version 0.63.0
	$ cd <appFolder>
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base
> Integrates Dynamics based on your current identifiers - iOS Bundle ID and Android Package Name.

	$ yarn set-bundle-id (OPTIONAL)
> Allows to update an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

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
	$ yarn remove BlackBerry-Dynamics-for-React-Native-Base

##### iOS
	$ cd ios
	$ pod install
	$ cd ..
