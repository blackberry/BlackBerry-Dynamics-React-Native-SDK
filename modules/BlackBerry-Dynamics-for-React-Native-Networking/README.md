# BlackBerry-Dynamics-for-React-Native-Networking

#### XHR and Fetch Support

Overrides the `XMLHttpRequest` and `fetch` APIs from React Native [Networking module](https://facebook.github.io/react-native/docs/network) on Android platform to work securely when using the [GDHpptClient](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/classcom_1_1good_1_1gd_1_1net_1_1_g_d_http_client.html) from BlackBerry Dynamics SDK for Android. 

The JavaScript API remains unchanged.

> IMPORTANT: `XMLHttpRequest` and `fetch` APIs work securely on iOS by default when `BlackBerry-Dynamics-for-React-Native-Base` module is added and linked to the application.

#### WebSocket Support

- Overrides and secures `WebSocket` API.
- Supports both `ws://` and `wss://` protocols.
- Supports text or binary (`Blob`, `ArrayBuffer`) data types for sending and receiving messages.

iOS platform uses [Jetfire + GDSocket](https://github.com/blackberry/BlackBerry-Dynamics-iOS-Samples/tree/master/WebSocket) Obj-C WebSocket library.
Android platform uses [Java WebSocket + GDSocket](https://github.com/blackberry/BlackBerry-Dynamics-Android-WebSocket.git) Java WebSocket library.

The JavaScript API remains unchanged.

## Supportability
#### React Native
 - 0.63.x (deprecated)
 - 0.64.x
 - 0.65.x
 - 0.66.x (0.66.1 is latest supported)

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
#### XMLHttpRequest
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
```

#### fetch
```javascript
import {fetch, XMLHttpRequest} from 'BlackBerry-Dynamics-for-React-Native-Networking';

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
            ) ? {Authorization: `Basic ${Base64.encode(`${authUsername}:${authPassword}`)}`} : null
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

#### WebSocket
```javascript
import { WebSocket, Blob, FileReader, Response, Headers } from 'BlackBerry-Dynamics-for-React-Native-Networking';

const webSocketClient = new WebSocket('ws://echo.wss-websocket.net'); // can be 'wss://echo.wss-websocket.net' as well

webSocketClient.onopen = () => {
    console.log('WS connection is opened!');
    webSocketClient.send('message'); // can be ArrayBuffer or Blob as well
};

webSocketClient.onmessage = async(e) => {
    const data = e.data;
    let text = data;
    console.log('Event message:', e);
    console.log('isBlob:', data instanceof Blob);
    console.log('isArrayBuffer', data instanceof ArrayBuffer);

    const now = new Date()
    let messageTemplate = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} `;

    if (data instanceof Blob) {
        messageTemplate += 'Received binary Blob: ';
        try {
            text = await new Response(data).text();
        } catch (error) {
            text = 'failed to convert Blob to text message. Please, check response binary type...';
        }
    } else if (data instanceof ArrayBuffer) {
        messageTemplate += 'Received binary ArrayBuffer: ';
        text = this.convertArrayBufferToString(data);
        if (!text) {
            text = 'failed to convert ArrayBuffer to text message. Please, check response binary type...'
        }
    }
};

webSocketClient.onerror = (e) => {
    alert(`WS error: ${e.message}`);
};

webSocketClient.onclose = (e) => {
    console.log('WS connection is closed!');
};

convertArrayBufferToString(buffer) {
    let convertedString = '';
    try {
        convertedString = String.fromCharCode.apply(null, new Uint16Array(buffer));
    } catch (error) {
        console.error('Failed to convert ArrayBuffer to text!');
    }
    return convertedString;
}
```

## Uninstallation
    $ cd <appFolder>
    $ yarn remove BlackBerry-Dynamics-for-React-Native-Networking

##### iOS
    $ cd ios
    $ pod install
    $ cd ..
