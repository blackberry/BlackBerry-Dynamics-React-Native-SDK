# BlackBerry-Dynamics-for-React-Native-Async-Storage

`BlackBerry-Dynamics-for-React-Native-Async-Storage` secures built-in [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage#docsNav) API.
The JavaScript API of this module remains the same but file(s) that contain AsyncStorage key-value pairs are stored and managed within Dynamics secure container.

## Supportability
#### React Native
 - 0.63.x (deprecated)
 - 0.64.x
 - 0.65.x
 - 0.66.x (0.66.1 is latest supported)

## Preconditions
`BlackBerry-Dynamics-for-React-Native-Async-Storage` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.

## Installation

    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Async-Storage

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ react-native run-ios
###### Android
    $ react-native run-android


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
