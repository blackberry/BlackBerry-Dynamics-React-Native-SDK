# BlackBerry-Dynamics-for-React-Native-AppKinetics

`BlackBerry-Dynamics-for-React-Native-AppKinetics` provides ability to use [Dynamics application-based services](https://marketplace.blackberry.com/services) within Dynamics React Native application to securely communicate with other Dynamics applications which is called Inter-Container Communication (ICC). Also, it provides service discovery, service consumption and service providing abilities for Dynamics React Native application.

For more details please refer to [com.good.gd.icc](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/namespacecom_1_1good_1_1gd_1_1icc.html) package on Android and [GDService](https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/interface_g_d_service.html) && [GDServiceClient](https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/interface_g_d_service_client.html) Dynamics runtime features on iOS.

## Supportability
#### React Native
 - 0.63.x (deprecated)
 - 0.64.x
 - 0.65.x
 - 0.66.x (0.66.1 is latest supported)

## Preconditions
`BlackBerry-Dynamics-for-React-Native-AppKinetics` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.
## Installation

    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-AppKinetics

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ react-native run-ios
###### Android
    $ react-native run-android

## API
#### Service discovery
> Service discovery feature allows to find a list of the available service providers of a specified service.
In other words, the API will return an information about Dynamics applications currently installed and activated on the device that provide specific Dynamics application-based service like [Transfer File Service](https://marketplace.blackberry.com/services/273065) or [Send Email Service](https://marketplace.blackberry.com/services/855115).
Full list of Dynamics application-based services can be found [here](https://marketplace.blackberry.com/services).

###### _getServiceProvidersFor_(serviceId: `string`, version: `string`) : Promise<Array<{address: `string`, applicationId: `string`, name: `string`, version: `string`}>>
`getServiceProvidersFor` API returns a promise that resolves to the list of the available service providers of a specified service or rejects to error message in case the promise was rejected.

**`<ServiceProvider>` definition**
```typescript
type ServiceProvider = {
  address: string;     // Native application identifier of the service provider
  applicationId: string;     // BlackBerry Dynamics entitlement identifier of the service provider
  name: string;     // Display name of the service provider
  version: string;     // BlackBerry Dynamics entitlement version of the service provider
};
```

**Parameters**
| Parameter | Type | Required? | Description |
| ------ | ------ | ------ | ------ |
| **serviceId** | `<String>` | yes | identifier of the required service |
| **version** | `<String>` | yes | version of the required service |

**Example of usage**
```typescript
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';
 
async function testAppKinetics() {
    try {
      const result = await BbdAppKinetics.getServiceProvidersFor('com.good.gdservice.transfer-file', '1.0.0.0');
      console.log('getServiceProvidersFor success result:', result);
    } catch (error) {
      console.log('getServiceProvidersFor error result:', error);
    }
}
testAppKinetics();
```

#### Service consumption
> Dynamics React Native application can send messages to other Dynamics applications using Dynamics application-based services having information about what Dynamics applications provide these services.

###### _bringAppToFront_(applicationId: `string`) : Promise<`string`>
`bringAppToFront` API brings other Dynamics application to front by specifying its BlackBerry Dynamics entitlement identifier.
It returns a promise that resolves to a message string "**_`<applicationId>` was successfully brought to front_**" in case of success and rejects to error message otherwise.

**Parameters**
| Parameter | Type | Required? | Description |
| ------ | ------ | ------ | ------ |
| **applicationId** | `<string>` | yes | BlackBerry Dynamics entitlement identifier of the Dynamics application that should be brought to front |

**Example of usage**
```typescript
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';

async function testAppKinetics() {
    try {
      const result = await BbdAppKinetics.bringAppToFront('com.blackberry.bbd.example.cdv.appkinetics.server')
      console.log('bringAppToFront success result:', result);
    } catch (error) {
      console.log('bringAppToFront error result:', error);
    }
}
testAppKinetics();
```

------

###### _callAppKineticsService_(`applicationId`: string, `serviceId`: string, `version`: string, `method`: string, `parameters?`: {}, `attachments?`: Array<string>) : Promise<`string`>
`_callAppKineticsService_` API is designed to call specific Dynamics application-based service passing required set of parameters.
It returns a promise that resolves to a message string "**_Send completed_**" in case of success and rejects to error message otherwise.

**Parameters**
| Parameter | Type | Required? | Description |
| ------ | ------ | ------ | ------ |
| **applicationId** | `string` | yes | BlackBerry Dynamics entitlement identifier of the Dynamics application that is service provider for **serviceId** service |
| **serviceId** | `string` | yes | identifier of the required service |
| **version** | `string` | yes | version of the required service |
| **method** | `string` | yes | method supported by required service |
| **parameters** | `object` | no | service parameters object for the request with key-value pairs where value might be of following types: `string`, `number`, `boolean`, `array`, `object`, `null` |
| **attachments** | `Array<string>` | no | array of strings containing the paths of files in the BlackBerry Dynamics secure file system that are to be attached to the request |

**Example of usage**
```typescript
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';

async function testAppKinetics() {
    try {
      const result = await BbdAppKinetics.callAppKineticsService(
        'com.blackberry.bbd.example.cdv.appkinetics.server',
        'com.good.gdservice.transfer-file',
        '1.0.0.0',
        'transferFile',
        {},
        ['/data/file.txt']
      );
      console.log('callAppKineticsService success result:', result);
    } catch (error) {
      console.log('callAppKineticsService error result:', error);
    }
}
testAppKinetics();
```

------
 
###### _sendFileToApp_(`applicationId`: string, `filePath`: string) : Promise<`string`>
`sendFileToApp` API is a helper method that allows to send file to other Dynamics application that is service provider for [Transfer File Service](https://marketplace.blackberry.com/services/273065) service. It calls `callAppKineticsService` method with pre-defined parameters - `com.good.gdservice.transfer-file` serviceId, `1.0.0.0` version and `transferFile` method.
It returns a promise that resolves to a message string "**_Send completed_**" in case of success and rejects to error message otherwise.

**Parameters**
| Parameter | Type | Required? | Description |
| ------ | ------ | ------ | ------ |
| **applicationId** | `string` | yes | BlackBerry Dynamics entitlement identifier of the Dynamics application that is service provider for [Transfer File Service](https://marketplace.blackberry.com/services/273065) service |
| **filePath** | `string` | yes | string containing the path of file in the BlackBerry Dynamics secure file system that is to be attached to the request |

**Example of usage**
```typescript
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';

async function testAppKinetics() {
    try {
      const result = await BbdAppKinetics.sendFileToApp(
        'com.blackberry.bbd.example.cdv.appkinetics.server',
        '/data/file.txt'
      );
      console.log('sendFileToApp success result:', result);
    } catch (error) {
      console.log('sendFileToApp error result:', error);
    }
}
testAppKinetics();
```

------

###### _sendEmailViaBBWork_(`toRecipients?`: Array<string>, `ccRecipients?`: Array<string>, `bccRecipients?`: Array<string>, `subject?`: string, `body?`: string, `attachments?`: Array<string>) : Promise<`string`>
`sendEmailViaBBWork` API is a helper method that allows to securely compose email via **BlackBerry Work** that is service provider for [Send Email Service](https://marketplace.blackberry.com/services/855115) service. It calls `callAppKineticsService` method with pre-defined parameters - `com.good.gfeservice.send-email` serviceId, `1.0.0.0` version and `sendEmail` method.
It returns a promise that resolves to a message string "**_Send completed_**" in case of success and rejects to error message otherwise.

**Parameters**
| Parameter | Type | Required? | Description |
| ------ | ------ | ------ | ------ |
| **toRecipients** | `Array<string>` | no | array of strings representing email addresses that will go into `TO` field of the email in BlackBerry Work |
| **ccRecipients** | `Array<string>` | no | array of strings representing email addresses that will go into `CC` field of the email in BlackBerry Work |
| **bccRecipients** | `Array<string>` | no | array of strings representing email addresses that will go into `BCC` field of the email in BlackBerry Work |
| **subject** | `string` | no | string representing `Subject` field of the email in BlackBerry Work |
| **body** | `string` | no | string representing `Body` of the email in BlackBerry Work |
| **attachments** | `Array<string>` | no | array of strings containing the paths of files in the BlackBerry Dynamics secure file system that will be added to `Attachments` field of the email in BlackBerry Work |

**Example of usage**
```typescript
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';

async function testAppKinetics() {
    try {
      const result = await BbdAppKinetics.sendEmailViaBBWork(
        ['to@example.com'],
        ['cc1@example.com', 'cc2@example.com'],
        [],
        'Test subject',
        'Test body'
      );
      console.log('sendEmailViaBBWork success result:', result);
    } catch (error) {
      console.log('sendEmailViaBBWork error result:', error);
    }
}
testAppKinetics();
```

#### Service providing
> Dynamics React Native application can also act as service provider of some Dynamics application-based service and receive some messages from other Dynamics application.

###### _readyToProvideService_(`serviceId`: string, `version`: string) : Promise<`string`>
`readyToProvideService` API allows to be service provider for some Dynamics application-based and respond to a consumer application from which an AppKinetics service request has been received. The response from service provider to consumer application will include a results object (see `ServiceMessage` interface below). `ServiceMessage` will notify the consumer of the success or failure of the request (see `onReceivedFile` , `onReceivedMessage` and  `onError` events handling below).
It returns a promise that resolves to a message string "**_Providing service `<serviceId>` with version `<version>`_**" in case of success and rejects to error message otherwise.

**Parameters**
| Parameter | Type | Required? | Description |
| ------ | ------ | ------ | ------ |
| **serviceId** | `string` | yes | identifier of the required service |
| **version** | `string` | yes | version of the required service |

**`onReceivedFile` event**
Dynamics React Native application should be subscribed on `onReceivedFile` event in order to be able to receive file sent using [Transfer File Service](https://marketplace.blackberry.com/services/273065). When file is received, event handler will be called with string representing file path passed to it. 

**`onReceivedMessage` event**
Dynamics React Native application should be subscribed on `onReceivedMessage` event in order to be able to receive message sent by consumer application via some Dynamics application-based service (other than "Transfer File Service"). When message is received, event handler will be called with following object passed to it:
```typescript
type ServiceMessage = {
    applicationId: <String>; // BlackBerry Dynamics entitlement identifier of the consumer application
    serviceId: <String>; // Service ID of the Dynamics application-based service that was used during request
    serviceVersion: <String>; // Service version of the Dynamics application-based service that was used during request
    serviceMethod: <String>; // Service method of the Dynamics application-based service that was used during request
    attachments: <String[]>; // array of strings representing paths to files within secure container
    parameters: <Object>; // object representing parameters that were send during request
};
```

**`onError` event**
Dynamics React Native application should be subscribed on `onError` event in order to be able to handle error message when error is occurred.

**Example of usage**
```typescript
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';
import { NativeEventEmitter } from 'react-native';

async function testAppKinetics() {
    try {
      const result = await BbdAppKinetics.readyToProvideService('com.good.gdservice.transfer-file', '1.0.0.0');
      console.log('readyToProvideService success result:', result);
    } catch (error) {
      console.log('readyToProvideService error result:', error);
    }
}

const eventEmitter = new NativeEventEmitter(BbdAppKinetics);

// subscribe on onReceivedFile
// event is fired when you receive file sent by 'com.good.gdservice.transfer-file' service
eventEmitter.addListener('onReceivedFile', (file) => {
  console.log(file); // path to file within secure container
});
 
// subscribe on onReceivedMessage
// event is fired when you receive ServiceMessage object sent by any Dynamics application-based service other than 'com.good.gdservice.transfer-file' service
eventEmitter.addListener('onReceivedMessage', (message) => {
  console.log(message);
});

// subscribe on onError
// event is fired when you receive an error
eventEmitter.addListener('onError', (message) => {
  console.log(message);
});
 
testAppKinetics();
```

#### Secure storage helper

###### _copyFilesToSecureStorage_() : Promise<{copiedInThisCall: `Array<string>`, securedDataDirEntries: `Array<string>`}>
`copyFilesToSecureStorage` API recursively copies files and directories from public `data` folder that is located in application bunlde to `/data` in secure container:
 - On Android it copies from `<app>/android/app/src/main/assets/data` folder
 - On iOS it copies from `<app>/ios/<app_name>/data` folder

`copyFilesToSecureStorage` returns object with following structure:
```typescript
{
    copiedInThisCall: Array<string>; // array of strings representing paths to files in secure container for "/data" directory that were copied during last call
    securedDataDirEntries: Array<string>; // array of strings representing paths to files in secure container for "/data" directory
}
```

**Example of usage**
```typescript
import BbdAppKinetics from 'BlackBerry-Dynamics-for-React-Native-AppKinetics';

async function testAppKinetics() {
    try {
      const result = await BbdAppKinetics.copyFilesToSecureStorage();
      console.log('copyFilesToSecureStorage success result:', result);
    } catch (error) {
      console.log('copyFilesToSecureStorage error result:', error);
    }
}

testAppKinetics();
```

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-AppKinetics

###### iOS
    $ cd ios
    $ pod install
    $ cd ..
