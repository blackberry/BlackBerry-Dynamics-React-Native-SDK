# BlackBerry-Dynamics-for-React-Native-Networking

Overrides the `XMLHttpRequest` and `fetch` APIs from React Native [Networking module](https://facebook.github.io/react-native/docs/network) on Android platform to work securely when using the [GDHpptClient](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/classcom_1_1good_1_1gd_1_1net_1_1_g_d_http_client.html) from BlackBerry Dynamics SDK for Android. The JavaScript API remains unchanged.

> IMPORTANT: `XMLHttpRequest` and `fetch` APIs work securely on iOS by default when `BlackBerry-Dynamics-for-React-Native-Base` module is added and linked to the application.

## Supportability
#### React Native
 - 0.63.x

## Preconditions
`BlackBerry-Dynamics-for-React-Native-Networking` is dependent on `BlackBerry-Dynamics-for-React-Native-Base` module.

Please install `BlackBerry-Dynamics-for-React-Native-Base` first.

## Installation
    $ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking

##### iOS
    $ cd ios
    $ pod install
    $ cd ..
    $ react-native run-ios
##### Android
    $ react-native run-android

## Usage
```javascript
import {fetch, XMLHttpRequest} from 'BlackBerry-Dynamics-for-React-Native-Networking';

// ...

handleXmlHttpRequest(requestInfo) {
    const request = new XMLHttpRequest(),
        requestUrl = requestInfo.url.trim(),
        requestMethod = requestInfo.methodName,
        authUsername = requestInfo.username.trim(),
        authPassword = requestInfo.password.trim();

    if (requestUrl) {
        request.onreadystatechange = e => {
            if (request.readyState !== 4) {
                return;
            }
            
            this.setState({ responseStatus: request.status });
        };

        request.open(requestMethod, requestUrl, true);
        if (
            this.state.responseStatus === 401 &&
            this.validateUserCredentials(authUsername, authPassword)
        ) {
            request.setRequestHeader('Authorization', `Basic ${Base64.encode(`${authUsername}:${authPassword}`)}`)
        }
        
        request.send();
    }
}

// ...

handleFetch(requestInfo) {
    const requestUrl = requestInfo.url.trim(),
        requestMethod = requestInfo.methodName,
        authUsername = requestInfo.username.trim(),
        authPassword = requestInfo.password.trim();

    if (requestUrl) {
      fetch(requestUrl, {
        method: requestMethod,
        headers: (
            this.state.responseStatus === 401 &&
            this.validateUserCredentials(authUsername, authPassword)
        ) ?
            {
            Authorization: `Basic ${Base64.encode(`${authUsername}:${authPassword}`)}`
            }
            :
            null
      })
        .then(response => {
            this.setState({ responseStatus: response.status });
        })
        .catch(error => {
            this.setState({ responseStatus: '0' });
        })
    }
}
```
## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-Networking

##### iOS
    $ cd ios
    $ pod install
    $ cd ..
