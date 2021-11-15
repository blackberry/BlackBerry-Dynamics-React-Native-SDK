# BlackBerry-Dynamics-for-React-Native-Base

`BlackBerry-Dynamics-for-React-Native-Base` automatically integrates the BlackBerry Dynamics SDK for iOS and Android into a React Native application.

## Setup environment

Please setup your environment as described in the [React Native documentation](https://facebook.github.io/react-native/docs/getting-started).

## Supportability

#### React Native
 - 0.63.x (deprecated)
 - 0.64.x
 - 0.65.x
 - 0.66.x (0.66.1 is latest supported)

## Preconditions

#### Install required dependencies using RubyGems

    $ gem install xcodeproj
    $ gem install plist

#### Dynamics SDK Dependency

Dynamics SDK for iOS and Android are now installed as part of the Base plugin using CocoaPods & Gradle. The integration uses the iOS "Dynamic Framework" version of BlackBerry Dynamics as the static library is no longer supported.

## Installation

#### react-native

    $ react-native init <appFolder> --version 0.64.0
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

## Limitations
### Flipper is disabled on iOS
Flipper cannot be used together with BlackBerry Dynamics SDK for React Native on iOS in debug configuration as it disables some BlackBerry Dynamics functionality related to secure networking.
Flipper is disabled on iOS by default. If your Dynamics React Native application on iOS does not use Secure Connectivity feature (`BlackBerry-Dynamics-for-React-Native-Networking` module) you can enable Flipper by uncommenting `use_flipper!()` line in `Podfile` of your application.
