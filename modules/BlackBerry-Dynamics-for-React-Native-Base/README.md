# BlackBerry-Dynamics-for-React-Native-Base

`BlackBerry-Dynamics-for-React-Native-Base` automatically integrates the BlackBerry Dynamics SDK for iOS and Android into a React Native application.

## Setup environment

Please setup your environment as described in the [React Native documentation](https://facebook.github.io/react-native/docs/getting-started).

## Supportability

#### React Native
 - 0.64.x (deprecated)
 - 0.65.x (deprecated)
 - 0.66.x
 - 0.67.x
 - 0.68.x (0.68.2 is latest supported)

## Preconditions

#### Install required dependencies using RubyGems

    $ gem install xcodeproj
    $ gem install plist

#### Dynamics SDK Dependency

Dynamics SDK for iOS and Android are now installed as part of the Base module using CocoaPods & Gradle. The integration uses the iOS "Dynamic Framework" version of BlackBerry Dynamics as the static library is no longer supported.

##### BlackBerry Dynamics SDK for iOS integration
###### Using latest released version - default
By default, `BlackBerry-Dynamics-for-React-Native-Base` module will integrate **latest** available BlackBerry Dynamics SDK for iOS using following podspec: `https://software.download.blackberry.com/repository/framework/dynamics/ios/11.0.1.137/BlackBerryDynamics-11.0.1.137.podspec`.
> NOTE: If one of the below integration methods was used there is an option to reset **default** configuration by running following command:
`$ yarn set-dynamics-podspec --default`
`$ cd ios && pod install && cd ..`

###### Using other released version
There is possibility to integrate other released build of BlackBerry Dynamics SDK for iOS.
Following command should be run:
```
$ yarn set-dynamics-podspec --url "https://software.download.blackberry.com/repository/framework/dynamics/ios/10.2.0.83/BlackBerryDynamics-10.2.0.83.podspec"
$ cd ios && pod install && cd ..
```
###### Using locally downloaded version
Also, it is possible to integrate manually downloaded BlackBerry Dynamics SDK for iOS from local place.
Following command should be run:
```
$ yarn set-dynamics-podspec --path "/Users/<user>/Downloads/gdsdk-release-dylib-X.X.X.X/BlackBerry_Dynamics_SDK_for_iOS_vX.X.X.X_dylib"
$ cd ios && pod install && cd ..
```

## Installation

#### react-native

    $ react-native init <appFolder> --version 0.66.0
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

### Android 12+ support for React Native version less than `0.68`
Apps targeting Android 12 and higher are required to specify an explicit value for `android:exported` when the corresponding component has an intent filter defined. More details can be found [here](https://developer.android.com/guide/topics/manifest/activity-element#exported).
React Native `0.68` and higher supports Android 12+ by default by setting appropriate setting in AndroidManifest.xml.
For React Native versions `<= 0.67` setting `android:exported` should be set manually.
