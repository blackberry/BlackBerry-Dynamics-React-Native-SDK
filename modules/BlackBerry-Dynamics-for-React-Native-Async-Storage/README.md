# BlackBerry-Dynamics-for-React-Native-Async-Storage

`BlackBerry-Dynamics-for-React-Native-Async-Storage` secures built-in [AsyncStorage Version 1.18.0](https://facebook.github.io/react-native/docs/asyncstorage#docsNav)  API.
The JavaScript API of this module remains the same but file(s) that contain AsyncStorage key-value pairs are stored and managed within Dynamics secure container.

## Supportability
#### React Native
 - 0.66.x (deprecated)
 - 0.67.x (deprecated)
 - 0.68.x (deprecated)
 - 0.69.x (deprecated)
 - 0.70.x
 - 0.71.x
 - 0.72.x

## Preconditions
`BlackBerry-Dynamics-for-React-Native-Async-Storage` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.

## Installation

    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Async-Storage

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ npx react-native run-ios
###### Android
    $ npx react-native run-android


## Usage
```javascript
import AsyncStorage from 'BlackBerry-Dynamics-for-React-Native-Async-Storage';

// ...

_storeData = async () => {
  try {
    await AsyncStorage.setItem('MySuperKey', 'My Super Value');
  } catch (error) {
    // Error saving data
  }
};

// ... 

_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('MySuperKey');
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};
```
## Uninstallation

    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-Async-Storage

###### iOS
    $ cd ios
    $ pod install
    $ cd ..

## Known issues
### Next Storage Feature on Android not supported
[Next Storage](https://react-native-async-storage.github.io/async-storage/docs/advanced/next) feature is not supported by BlackBerry-Dynamics-for-React-Native-Async-Storage Module.
