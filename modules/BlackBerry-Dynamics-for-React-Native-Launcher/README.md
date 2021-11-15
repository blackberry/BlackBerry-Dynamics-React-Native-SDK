# BlackBerry-Dynamics-for-React-Native-Launcher

`BlackBerry-Dynamics-for-React-Native-Launcher` is used to show the BlackBerry Dynamics Launcher in your application. 
For more details please refer to [Dynamics Launcher library on Android](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-launcher-framework-for-android/) and [Dynamics Launcher framework on iOS](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-launcher-framework-for-ios/).

## Supportability
#### React Native
 - 0.63.x (deprecated)
 - 0.64.x
 - 0.65.x
 - 0.66.x (0.66.1 is latest supported)
#### BlackBerry Dynamics Launcher library for iOS
 - 3.3.0.303
#### BlackBerry Dynamics Launcher library for Android
 - 3.3.0.215

## Preconditions
#### Install Base module
`BlackBerry-Dynamics-for-React-Native-Launcher` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.
#### Download Launcher libraries
`BlackBerry-Dynamics-for-React-Native-Launcher` module uses BlackBerry Dynamics Launcher library for iOS and Android as dependency that should be downloaded and copied to appropriate location.
###### BlackBerry Dynamics Launcher library for iOS
 - Download "Dynamic Framework" for BlackBerry Dynamics Launcher library for iOS from [this page](https://developers.blackberry.com/us/en/resources/downloads.html).
 - Unzip `/Users/<user>/Downloads/BlackBerryLauncher_iOS_v<version>.zip`
 - Copy `/Users/<user>/Downloads/BlackBerryLauncher_iOS_v<version>/Launcher_dylib/BlackBerryLauncher.xcframework` to `<path>/BlackBerry-Dynamics-React-Native-SDK/modules/BlackBerry-Dynamics-for-React-Native-Launcher/ios/frameworks` with the same name
###### BlackBerry Dynamics Launcher library for Android
 - Download BlackBerry Dynamics Launcher library for Android from [this page](https://developers.blackberry.com/us/en/resources/downloads.html).
 - Unzip `/Users/<user>/Downloads/BlackBerryLauncher_Android-v<version>.zip`
 - Copy `/Users/<user>/Downloads/BlackBerryLauncher_Android-v<version>/launcherlib.aar` to `<path>/BlackBerry-Dynamics-React-Native-SDK/modules/BlackBerry-Dynamics-for-React-Native-Launcher/android/libs` with the same name

## Installation

    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Launcher

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ yarn integrate-launcher
    $ react-native run-ios
###### Android
    $ react-native run-android

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-Launcher

###### iOS
    $ cd ios
    $ pod install
    $ cd ..

## API
#### Integrate Launcher
BlackBerry Dynamics Launcher can be integrated by just importing `BlackBerry-Dynamics-for-React-Native-Launcher` module.
**Example of usage**
```typescript
import Launcher from 'BlackBerry-Dynamics-for-React-Native-Launcher'; // Launcher icon will appear on the screen
```
#### show(): Promise<void>
Shows Launcher icon.

**Example of usage**
```typescript
import Launcher from 'BlackBerry-Dynamics-for-React-Native-Launcher'; 

await Launcher.show();
```

#### hide(): Promise<void>
Hides Launcher icon.

**Example of usage**
```typescript
import Launcher from 'BlackBerry-Dynamics-for-React-Native-Launcher'; 

await Launcher.hide();
```
