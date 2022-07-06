/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { WebSocket, Blob, FileReader, Response, Headers, fetch, XMLHttpRequest } from 'BlackBerry-Dynamics-for-React-Native-Networking';

import { Platform } from 'react-native';

export default function() {
  describe('WebSocket API', function() {
    let originalTimeout;

    beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    const CONNECTING = 0;
    const OPEN = 1;
    const CLOSING = 2;
    const CLOSED = 3;
    // DEVNOTE: maximum message length is 50 on 'wss://javascript.info/article/websocket/chat/ws'
    const MAXMESSAGELENGTH = 50;

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const DataConverter = {
      readBlobAsText: function(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = function() {
            resolve(reader.result);
          }

          reader.onerror = function() {
            reject(reader.error);
          }

          reader.readAsText(blob);
        });
      },
      convertStringToArrayBuffer(string) {
        const stringLength = string.length;
        let buffer = new ArrayBuffer(stringLength * 2);
        let bufferView = new Uint16Array(buffer);

        for (let i = 0; i < stringLength; i++) {
          bufferView[i] = string.charCodeAt(i);
        }
        return buffer;
      },
      convertArrayBufferToString(buffer) {
        let convertedString = '';
        try {
          convertedString = String.fromCharCode.apply(null, new Uint16Array(buffer));
        } catch (error) {
          console.error('Failed to convert ArrayBuffer to text!');
        }
        return convertedString;
      }
    }

    it('Check WebSocket is available', function() {
      expect(WebSocket).toBeDefined();
    });

    it('Check WebSocket API is available', function() {
      const isAvailableWebSocketProps = true ;
      const webSocketPrototypeProps = [
        'binaryType',
        'close',
        'send',
        'ping'
      ];
      const webSocketAPI = Object.getOwnPropertyNames(WebSocket.prototype);

      for (let i = 0; i < webSocketPrototypeProps.length; i++) {
        if (!webSocketAPI.includes(webSocketPrototypeProps[i])) {
          isAvailableWebSocketProps = false;
          break;
        }
      }

      expect(isAvailableWebSocketProps).toBe(true);
    });

    describe('WebSocket callbacks: onopen, onmessage, onclose with ws:// scheme - DEVNOTE: as this test server is unavailable for "ws://" scheme, "wss://" instead of "ws://" is used here temporary.' , function() {
      // DEVNOTE: 'javascript.info' only accept 'wss:', not 'ws:'
      const url = 'wss://javascript.info/article/websocket/chat/ws';

      it('WebSocket: check onopen connection callback - ws:// scheme - positive case', function(done) {
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { type, isTrusted, timeStamp } = event;

          expect(type).toBeDefined();
          expect(type).toBe('open');
          expect(isTrusted).toBeDefined();
          expect(isTrusted).toBe(false);

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(event) {
          expect(isConditionChecked).toBe(true);
          done();
        }

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: check onopen connection callback - ws:// scheme - negative case', function(done) {
        const invalidUrl = 'ws://NoHost321.arg';
        let isConditionChecked = false;

        const webSocket = new WebSocket(invalidUrl);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect('"onopen" should not be triggered with invalid url').toBe(true);
          done();
        };

        webSocket.onmessage = function(event) {
          expect('"onmessage" should not be triggered with invalid url').toBe(true);
          done();
        };

        webSocket.onclose = function(event) {
          expect(webSocket.readyState).toBe(CLOSED);
          expect(isConditionChecked).toBe(true);
        }

        webSocket.onerror = function(error) {
          isConditionChecked = true;
          expect(error.message).toBeDefined();

          done();
        };
      });

      it('WebSocket: check onclose connection callback - ws:// scheme', function(done) {
        const expectedCloseCode = 1000;
        const expectedCloseReason = Platform.OS === 'ios' ? 'Socket was disconnected' : '';
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          isConditionChecked = true;
          webSocket.close();
          expect(webSocket.readyState).toBe(CLOSING);
        };

        webSocket.onclose = function(event) {
          expect(webSocket.readyState).toBe(CLOSED);
          expect(isConditionChecked).toBe(true);
          const { type, isTrusted, timeStamp, code, reason } = event;

          expect(type).toBeDefined();
          expect(type).toBe('close');
          expect(isTrusted).toBeDefined();
          expect(isTrusted).toBe(false);
          expect(code).toBe(expectedCloseCode);
          expect(reason).toBe(expectedCloseReason);

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: send / receive text message, check onmessage callback - ws:// scheme', function(done) {
        const message = 'Some test message';
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          webSocket.send(message);
        };

        webSocket.onmessage = function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { type, isTrusted, timeStamp, data } = event;

          expect(isTrusted).toBe(false);
          expect(isTrusted).toBe(false);
          expect(data).toBeDefined();
          expect(type).toBe('message');
          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(event) {
          expect(isConditionChecked).toBe(true);

          done();
        }

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
        };
      });

    });

    describe('WebSocket events: open, message, close with wss:// scheme' , function() {
      const url = 'wss://javascript.info/article/websocket/chat/ws';

      it('WebSocket: check open connection event - wss:// scheme', function(done) {
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.addEventListener('open', function (event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { type, isTrusted, timeStamp } = event;

          expect(typeof event).toBe('object');
          expect(type).toBeDefined();
          expect(type).toBe('open');
          expect(isTrusted).toBeDefined();
          expect(isTrusted).toBe(false);

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        });

        webSocket.addEventListener('close', function (event) {
          expect(isConditionChecked).toBe(true);
          done();
        });

        webSocket.addEventListener('error', function (event) {
          expect(error.message).toBe(true);
          done();
        });
      });

      it('WebSocket: check close connection event - wss:// scheme', function(done) {
        const expectedCloseCode = 1000;
        const expectedCloseReason = Platform.OS === 'ios' ? 'Socket was disconnected' : '';
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.addEventListener('open', function (event) {
          expect(webSocket.readyState).toBe(OPEN);
          isConditionChecked = true;
          webSocket.close();
          expect(webSocket.readyState).toBe(CLOSING);
        });

        webSocket.addEventListener('close', function (event) {
          expect(webSocket.readyState).toBe(CLOSED);
          expect(isConditionChecked).toBe(true);
          const { type, isTrusted, timeStamp, code, reason } = event;

          expect(typeof event).toBe('object');
          expect(type).toBeDefined();
          expect(type).toBe('close');
          expect(isTrusted).toBeDefined();
          expect(isTrusted).toBe(false);
          expect(code).toBe(expectedCloseCode);
          expect(reason).toBe(expectedCloseReason);

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          done();
        });

        webSocket.addEventListener('error', function (event) {
          expect(error.message).toBe(true);
          done();
        });
      });

      it('WebSocket: send / receive text message, check message event - wss:// scheme', function(done) {
        const message = 'Some test message with symbols !@#$%^&*()""';
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.addEventListener('open', function (event) {
          expect(webSocket.readyState).toBe(OPEN);
          webSocket.send(message);
        });

        webSocket.addEventListener('message', function (event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type, timeStamp } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data).toBe(message);

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        });

        webSocket.addEventListener('close', function (event) {
          expect(isConditionChecked).toBe(true);
          done();
        });

        webSocket.addEventListener('error', function (event) {
          expect(error.message).toBe(true);
          done();
        });
      });

    });

    describe('WebSocket send and receive different type of messages', function() {
      const url = 'wss://javascript.info/article/websocket/chat/ws';

      it('WebSocket: send, receive text message', function(done) {
        const message = 'Some test message with symbols !@#$%^&*()""';
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          webSocket.send(message);
        };

        webSocket.onmessage = function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type, timeStamp } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data).toBe(message);

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(error) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: send, receive Blob, binaryType = "blob", convert to text using Response', function(done) {
        const dataString = 'test string !@#$%^&*() йцукен';
        const blob = new Blob([dataString], {
          type: 'text/plain'
        });
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = 'blob';
          webSocket.send(blob);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type, timeStamp } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof Blob).toBe(true);
          const textMessage = await new Response(data).text();
          expect(textMessage).toBe(dataString);

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(error) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: send, receive Blob, binaryType = "blob", convert to text using FileReader API', function(done) {
        const dataString = 'test string !@#$%^&*() йцукен';
        const binaryType = 'blob';
        const blob = new Blob([dataString], {
          type: 'text/plain'
        });
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = binaryType;
          webSocket.send(blob);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type, timeStamp } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof Blob).toBe(true);
          const textMessage = await DataConverter.readBlobAsText(data);
          expect(textMessage).toBe(dataString);

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(error) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: send, receive ArrayBuffer, binaryType = "arraybuffer"', function(done) {
        const dataString = 'test string !@#$%^&*() йцукен';
        const binaryType = 'arraybuffer';
        const arrayBufferMessage = DataConverter.convertStringToArrayBuffer(dataString);
        let isConditionChecked = false;

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = binaryType;
          webSocket.send(arrayBufferMessage);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type, timeStamp } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof ArrayBuffer).toBe(true);
          const textMessage = await DataConverter.convertArrayBufferToString(data);
          if (arrayBufferMessage.byteLength > MAXMESSAGELENGTH) {
            expect(textMessage).toBe(dataString.slice(0, MAXMESSAGELENGTH / 2));
          }
          else {
            expect(textMessage).toBe(dataString);
          }

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(error) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: multiple sequential connections with sending, receiving text messages', function(done) {
        if (Platform.OS === 'ios') {
          done();
        }
        else {
          const message = 'Some test message with symbols !@#$%^&*()""';
          let opened = 0;
          let closed = 0;

          const onOpen = function(event) {
            expect(this.readyState).toBe(OPEN);
            opened++;
            this.send(message);
          };

          const onMessage = function(event) {
            expect(this.readyState).toBe(OPEN);
            const { data, type } = event;

            expect(type).toBe('message');
            expect(data).toBeDefined();
            expect(data).toBe(message);

            const self = this;
            setTimeout(function(){self.close()}, 500); // sometimes we get CLOSING readtState. Need a little delay
          };

          const onClose = function(event) {
            expect(this.readyState).toBe(CLOSED);
            const { type, code, reason } = event;

            expect(typeof event).toBe('object');
            expect(type).toBeDefined();
            expect(type).toBe('close');

            closed++;
            if (closed === 3 && opened === 3) {
              done();
            }
          };

          const onError = function(error) {
            expect(error.message).toBe(true);
            done();
          };

          const webSocket1 = new WebSocket(url);
          webSocket1.onopen = onOpen.bind(webSocket1);
          webSocket1.onmessage = onMessage.bind(webSocket1);
          webSocket1.onclose = onClose.bind(webSocket1);
          webSocket1.onerror = onError.bind(webSocket1);

          const webSocket2 = new WebSocket(url);
          webSocket2.onopen = onOpen.bind(webSocket2);
          webSocket2.onmessage = onMessage.bind(webSocket2);
          webSocket2.onclose = onClose.bind(webSocket2);
          webSocket2.onerror = onError.bind(webSocket2);

          const webSocket3 = new WebSocket(url);
          webSocket3.onopen = onOpen.bind(webSocket3);
          webSocket3.onmessage = onMessage.bind(webSocket3);
          webSocket3.onclose = onClose.bind(webSocket3);
          webSocket3.onerror = onError.bind(webSocket3);
        }
      });
    });

    describe('WebSocket integration tests with fetch / XMLHttpRequest using Blob messages',function() {
      beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
      });

      afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      });

      it('WebSocket: get image as Blob by fetch, send and receive it as Blob', async function(done) {
        const url = 'wss://javascript.info/article/websocket/chat/ws';
        const method = 'GET';
        const imageUrl = 'https://commons.wikimedia.org/wiki/File:Test_rillke2.jpg';
        let isConditionChecked = false;

        const response = await fetch(imageUrl, {
          method
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseBlob = await response.blob();
        const expectedSize = parseInt(response.headers.get('Content-Length'), 10);

        expect(responseBlob).toBeDefined();
        expect(responseBlob instanceof Blob).toBe(true);
        expect(responseBlob.size).toBe(expectedSize);

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = 'blob';
          webSocket.send(responseBlob);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type, timeStamp } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof Blob).toBe(true);
          if (expectedSize > MAXMESSAGELENGTH) {
            expect(data.size).toBe(MAXMESSAGELENGTH);
          } else {
            expect(data.size).toBe(expectedSize);
          }

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(event) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: get JSON as Blob by fetch, use it to send and receive Blob message, ' +
        'convert received Blob to text using Response', async function(done) {
        const url = 'wss://javascript.info/article/websocket/chat/ws';
        const method = 'GET';
        const jsonUrl = 'http://httpbin.org/get?test_prop=test_value12345';
        let isConditionChecked = false;

        const response = await fetch(jsonUrl, {
          method
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseBlob = await response.blob();

        expect(responseBlob).toBeDefined();
        expect(responseBlob instanceof Blob).toBe(true);
        const expectedBlobSize = responseBlob.size;
        const convertedBlobToText = await new Response(responseBlob).text();

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = 'blob';
          webSocket.send(responseBlob);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type, timeStamp } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof Blob).toBe(true);
          const textMessage = await new Response(data).text();
          if (convertedBlobToText.length > MAXMESSAGELENGTH) {
            expect(data.size).toBe(MAXMESSAGELENGTH);
            expect(textMessage).toBe(convertedBlobToText.slice(0, MAXMESSAGELENGTH));
          } else {
            expect(data.size).toBe(expectedBlobSize);
            expect(textMessage).toBe(convertedBlobToText);
          }

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(error) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: get HTML as Blob by fetch, use it to send and receive Blob message, ' +
        'convert received Blob to text using FileReader', async function(done) {
        const url = 'wss://javascript.info/article/websocket/chat/ws';
        const method = 'GET';
        const htmlUrl = 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API';

        const response = await fetch(htmlUrl, {
          method
        });
        expect(response.status).toBe(200);

        const responseBlob = await response.blob();

        expect(responseBlob).toBeDefined();
        expect(responseBlob instanceof Blob).toBe(true);
        const expectedBlobSize = responseBlob.size;
        const convertedBlobToText = await DataConverter.readBlobAsText(responseBlob);

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = 'blob';
          webSocket.send(responseBlob);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type, timeStamp } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof Blob).toBe(true);
          const textMessage = await DataConverter.readBlobAsText(data);
          if (convertedBlobToText.length > MAXMESSAGELENGTH) {
            expect(data.size).toBe(MAXMESSAGELENGTH);
            expect(textMessage).toBe(convertedBlobToText.slice(0, MAXMESSAGELENGTH));
          } else {
            expect(data.size).toBe(expectedBlobSize);
            expect(textMessage).toBe(convertedBlobToText);
          }

          expect(timeStamp).toBeDefined();
          expect(typeof timeStamp).toBe('number');
          const date = new Date(timeStamp);
          expect(date.getDate()).toBe(currentDay);
          expect(date.getMonth()).toBe(currentMonth);
          expect(date.getFullYear()).toBe(currentYear);

          webSocket.close();
        };

        webSocket.onclose = function(event) {
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

      it('WebSocket: get JSON as Blob by XMLHttpRequest, use it to send and receive Blob message, ' +
        'convert received Blob to text using FileReader', async function(done) {
        const url = 'wss://javascript.info/article/websocket/chat/ws';
        const method = 'GET';
        const responseType = 'blob';
        const jsonUrl = 'http://httpbin.org/get?test_prop=test_value12345';
        let isConditionChecked = false;

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, jsonUrl);
        expect(xhr.readyState).toBe(1);

        xhr.responseType = responseType;

        xhr.onreadystatechange = async function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {

            expect(xhr.response).toBeDefined();
            expect(xhr.response instanceof Blob).toBe(true);
            const responseBlob = xhr.response;
            const expectedBlobSize = responseBlob.size;
            const convertedBlobToText  = await DataConverter.readBlobAsText(responseBlob);

            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            const webSocket = new WebSocket(url);
            expect(webSocket.readyState).toBe(CONNECTING);

            webSocket.onopen = function(event) {
              expect(webSocket.readyState).toBe(OPEN);

              webSocket.binaryType = responseType;
              webSocket.send(responseBlob);
            };

            webSocket.onmessage = async function(event) {
              expect(webSocket.readyState).toBe(OPEN);
              const { data, type, timeStamp } = event;

              expect(type).toBe('message');
              expect(data).toBeDefined();
              expect(data instanceof Blob).toBe(true);
              const textMessage = await DataConverter.readBlobAsText(data);
              if (convertedBlobToText.length > MAXMESSAGELENGTH) {
                expect(data.size).toBe(MAXMESSAGELENGTH);
                expect(textMessage).toBe(convertedBlobToText.slice(0, MAXMESSAGELENGTH));
              } else {
                expect(data.size).toBe(expectedBlobSize);
                expect(textMessage).toBe(convertedBlobToText);
              }

              expect(timeStamp).toBeDefined();
              expect(typeof timeStamp).toBe('number');
              const date = new Date(timeStamp);
              expect(date.getDate()).toBe(currentDay);
              expect(date.getMonth()).toBe(currentMonth);
              expect(date.getFullYear()).toBe(currentYear);

              isConditionChecked = true;
              webSocket.close();
            };

            webSocket.onclose = function(error) {
              expect(isConditionChecked).toBe(true);
              done();
            };

            webSocket.onerror = function(error) {
              expect(error.message).toBe(true);
              done();
            };

          }
        };

        xhr.send();
      });

    });

  });
}
