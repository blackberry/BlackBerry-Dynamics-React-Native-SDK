# BlackBerry-Dynamics-for-React-Native-Application

`BlackBerry-Dynamics-for-React-Native-Application` provides access to information that is globally available to any BlackBerry Dynamics Application.

## Supportability
#### React Native
 - 0.64.x (deprecated)
 - 0.65.x (deprecated)
 - 0.66.x
 - 0.67.x
 - 0.68.x (0.68.2 is latest supported)

## Preconditions
`BlackBerry-Dynamics-for-React-Native-Application` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.
## Installation

    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Application

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ react-native run-ios
###### Android
    $ react-native run-android

## API

**`<ApplicationConfig>` definition**
```typescript
type ApplicationConfig = {
  appHost?: ?string,
  appPort?: ?number,
  appServers?: ?Array<{
    port: ?number,
    priority: ?number,
    server: ?string
  }>,
  communicationProtocols?: ?{[key: string]: boolean},
  containerId?: ?string,
  copyPasteOn?: ?boolean,
  detailedLogsOn?: ?boolean,
  enterpriseId?: ?string,
  enterpriseIdActivated?: ?boolean,
  enterpriseIdFeatures?: ?Array<string>,
  extraInfo?: ?{[key: string]: string},
  keyboardRestrictedMode?: ?boolean,
  preventAndroidDictation?: ?boolean,
  preventDictation?: ?boolean,
  preventKeyboardExtensions?: ?boolean,
  preventPasteFromNonGDApps?: ?boolean,
  preventScreenCapture?: ?boolean,
  preventUserDetailedLogs?: ?boolean,
  preventCustomKeyboards?: ?boolean,
  preventScreenRecording?: ?boolean,
  protectedByPassword?: ?boolean,
  upn?: ?string,
  userId?: ?string
};
```

###### _getApplicationConfig_() : Promise<`ApplicationConfig`>
`getApplicationConfig` method returns a collection of application configuration and other settings. The settings will have been made in the enterprise management console, retrieved by the BlackBerry Dynamics runtime and exposed to the application. Retrieval of configuration settings may happen during method call , or whenever settings are changed in the enterprise management console. When changed settings have been retrieved by the module's native code, a `onAppConfigUpdate` event will be dispatched to the application. Also, `onError` event will be dispatched to the application in case of unexpected issue.
More details can be found on API reference for [iOS](https://developer.blackberry.com/files/blackberry-dynamics/ios/interface_g_di_o_s.html#a3265c6148406a8850ba673b26e472ece) and [Android](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/classcom_1_1good_1_1gd_1_1_g_d_android.html#aedeeab3604d3316fee1fda12cda56b8f).

**Example of usage**
```typescript
import BbdApplication from 'BlackBerry-Dynamics-for-React-Native-Application';
import { NativeEventEmitter, NativeModules  } from 'react-native';

const { BbdRNApplication } = NativeModules;
const eventEmitter = new NativeEventEmitter(BbdRNApplication);

eventEmitter.addListener('onError', (error) => {
  console.log('error occured:', error);
});

eventEmitter.addListener('onAppConfigUpdate', (config) => {
  console.log('application config changed:', config);
});

async function getAppConfig() {
  try {
    const result = await BbdApplication.getApplicationConfig();
    console.log('application config:', result);
  } catch (error) {
    console.log('error:', error);
  }
}
getAppConfig();
```

###### _getApplicationPolicy_() : Promise<{ [key: `string`]: any }>
`getApplicationPolicy` method returns a collection of application-specific policy settings. The settings will have been made in the management console, and retrieved by the BlackBerry Dynamics runtime. Retrieval of policy settings may happen during method call, or whenever settings are changed. When changed settings have been retrieved by the module's native code, a `onAppPolicyUpdate` event will be dispatched to the application. Also, `onError` event will be dispatched to the application in case of unexpected issue.
More details can be found on API reference for [iOS](https://developer.blackberry.com/files/blackberry-dynamics/ios/interface_g_di_o_s.html#ab40707775bc35418b21f721652b11e75) and [Android](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/classcom_1_1good_1_1gd_1_1_g_d_android.html#a25c299a3e75e43f4021e029f563d2da6).
For more documentation of the feature and how application policies are defined, see the [Application Policies Definition](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/_app_policies.html) documentation.

**Example of usage**
```typescript
import BbdApplication from 'BlackBerry-Dynamics-for-React-Native-Application';
import { NativeEventEmitter, NativeModules  } from 'react-native';

const { BbdRNApplication } = NativeModules;
const eventEmitter = new NativeEventEmitter(BbdRNApplication);

eventEmitter.addListener('onAppPolicyUpdate', (config) => {
  console.log('app-specific policy changed:', config);
});

eventEmitter.addListener('onError', (error) => {
  console.log('error occured:', error);
});

async function getAppPolicy() {
  try {
    const result = await BbdApplication.getApplicationPolicy();
    console.log('app-specific policy:', result);
  } catch (error) {
    console.log('error:', error);
  }
}
getAppPolicy();
```

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-Application

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
