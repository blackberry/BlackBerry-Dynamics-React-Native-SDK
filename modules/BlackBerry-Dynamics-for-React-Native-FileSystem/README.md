# BlackBerry-Dynamics-for-React-Native-FileSystem

`BlackBerry-Dynamics-for-React-Native-FileSystem` secures API for [react-native-fs](https://github.com/itinance/react-native-fs) 3rd party module for React Native.
The JavaScript API of this module remains the same but files/directories are stored and managed within Dynamics secure container.

## Supportability
#### React Native
 - 0.63.x (deprecated)
 - 0.64.x
 - 0.65.x
 - 0.66.x (0.66.1 is latest supported)

## Preconditions

`BlackBerry-Dynamics-for-React-Native-FileSystem` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` and `BlackBerry-Dynamics-for-React-Native-Networking` modules, so please install required modules first.

## Installation

    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem

###### iOS
    $ cd ios  
    $ pod install  
    $ cd ..  
    $ react-native run-ios
###### Android
    $ react-native run-android

## Usage

Please take a look at examples of usage in [original module](https://github.com/itinance/react-native-fs#Examples) and [FileSystem](../../SampleApplications/FileSystem) sample application.

## Uninstallation

    $ cd <appFolder>  
    $ yarn remove BlackBerry-Dynamics-for-React-Native-FileSystem

###### iOS
    $ cd ios  
    $ pod install  
    $ cd ..
