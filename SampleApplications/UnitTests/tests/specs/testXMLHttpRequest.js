/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
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
 
import { XMLHttpRequest, Blob } from 'BlackBerry-Dynamics-for-React-Native-Networking';

import { Ntlm } from '../scripts/ntlmHelper';
import { Digest } from '../scripts/digestHelper';

export default function() {

  describe("XMLHttpRequest API", function() {
    // DEVNOTE: uncomment this, if default Jasmine timeout of 5 sec is not enough to receive server response
    let originalTimeout;

    beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('Check XMLHttpRequest is available', function() {
      expect(XMLHttpRequest).toBeDefined();

      const xhr = new XMLHttpRequest();
      expect(xhr instanceof XMLHttpRequest).toBe(true);
    });

    describe('XMLHttpRequest open', function() {

      it('XMLHttpRequest open: negative case - no parameters', function() {
        const expectedErrorMessage = 'Cannot load an empty url';
        const xhr = new XMLHttpRequest();

        expect(() => { xhr.open(); }).toThrowError(expectedErrorMessage);
      });

      it('XMLHttpRequest open: negative case - one parameter', function() {
        const method = 'GET';
        const expectedErrorMessage = 'Cannot load an empty url';
        const xhr = new XMLHttpRequest();

        expect(() => { xhr.open(method) }).toThrowError(expectedErrorMessage);
      });

      it('XMLHttpRequest open: positive case - two required parameters METHOD and URL', function() {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);
      });

      it('XMLHttpRequest open: positive case - two required parameters METHOD with different case name and URL', function() {
        const method = "gEt";
        const url = "http://echo.jsontest.com/key/value/one/two";
        const expectedMethod = 'GET';
        const expectedUrl = url;

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        expect(xhr._method).toBe(expectedMethod);
        expect(xhr._url).toBe(expectedUrl);
        expect(xhr._aborted).toBe(false);
      });

      it('XMLHttpRequest open: negative case - two required parameters METHOD and URL, one optional parameter ASYNC = false for synchronous request', function() {
        // DEVNOTE: synchronous XMLHttpRequest requests are not supported in React Native
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";
        const async = false;
        const expectedErrorMessage = 'Synchronous http requests are not supported';

        const xhr = new XMLHttpRequest();
        expect(() => { xhr.open(method, url, async); }).toThrowError(expectedErrorMessage);
      });

    });

    describe('XMLHttpRequest setRequestHeader', function() {

      it('XMLHttpRequest setRequestHeader: negative case - no parameters', function() {
        const method = 'GET';
        const url = 'http://echo.jsontest.com/key/value/one/two';

        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        // DEVNOTE: not expected specific error message, as React Native doesn't handle received func params here at all
        // Current error message: "Expected function not to throw, but it threw TypeError: Cannot read property 'toLowerCase' of undefined."
        expect(() => { xhr.setRequestHeader(); }).toThrow();
      });

      it('XMLHttpRequest setRequestHeader: positive case - only one parameter', function() {
        const method = 'GET';
        const url = 'http://echo.jsontest.com/key/value/one/two';
        const headerName = 'Connection';

        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        expect(() => { xhr.setRequestHeader(headerName) }).not.toThrow();

        const currentHeaderNames = Object.keys(xhr._headers);
        expect(currentHeaderNames.length).toBe(1);
        expect(currentHeaderNames.includes(headerName.toLowerCase())).toBe(true);
      });

      it('XMLHttpRequest setRequestHeader: negative case - set header for not opened request', function() {
        const headerName = 'Content-type';
        const headerValue = 'application/json; charset=utf-8';
        const expectedErrorMessage = 'Request has not been opened';

        const xhr = new XMLHttpRequest();

        expect(xhr.readyState).toBe(0);
        expect(() => { xhr.setRequestHeader(headerName, headerValue); }).toThrowError(expectedErrorMessage);
      });

      it('XMLHttpRequest setRequestHeader: positive case - add one request header', function() {
        const method = 'GET';
        const url = 'http://echo.jsontest.com/key/value/one/two';
        const headerName = 'Content-type';
        const expectedHeaderName = 'content-type';
        const headerValue = 'application/json; charset=utf-8';

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.setRequestHeader(headerName, headerValue);

        expect(xhr.readyState).toBe(1);
        expect(xhr._headers[expectedHeaderName]).toBeDefined();
        expect(xhr._headers[expectedHeaderName]).toBe(headerValue);
      });

      it('XMLHttpRequest setRequestHeader: positive case - add two request headers', function() {
        const method = 'GET';
        const url = 'http://echo.jsontest.com/key/value/one/two';
        const headerName1 = 'Content-type';
        const expectedHeaderName1 = 'content-type';
        const headerValue1 = 'application/json; charset=utf-8';
        const headerName2 = 'Connection';
        const expectedHeaderName2 = 'connection';
        const headerValue2 = 'close';

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);
        expect(Object.keys(xhr._headers).length).toBe(0);

        xhr.setRequestHeader(headerName1, headerValue1);
        xhr.setRequestHeader(headerName2, headerValue2);

        expect(xhr.readyState).toBe(1);
        expect(Object.keys(xhr._headers).length).toBe(2);
        expect(xhr._headers[expectedHeaderName1]).toBe(headerValue1);
        expect(xhr._headers[expectedHeaderName2]).toBe(headerValue2);
      });

      it('XMLHttpRequest setRequestHeader: positive case - check request headers and values', function() {
        const method = 'GET';
        const url = 'http://echo.jsontest.com/key/value/one/two';
        const headerName1 = 'Content-type';
        const expectedHeaderName1 = 'content-type';
        const headerValue1 = 'application/json; charset=utf-8';

        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader(headerName1, headerValue1);

        expect(xhr._headers).toBeDefined();
        expect(xhr._headers[headerName1]).toBeUndefined();
        expect(xhr._headers[expectedHeaderName1]).toBeDefined();
        expect(xhr._headers[expectedHeaderName1]).toBe(headerValue1);

        const headerName2 = 'someLowerAndUpperCaseHeaderName';
        const expectedHeaderName2 = 'someloweranduppercaseheadername';
        const headerValue2 = 'someValue';
        xhr.setRequestHeader(headerName2, headerValue2);

        expect(xhr._headers[headerName2]).toBeUndefined();
        expect(xhr._headers[expectedHeaderName2]).toBeDefined();
        expect(xhr._headers[expectedHeaderName2]).toBe(headerValue2);

        const headerName3 = 'header_with_int_value';
        const headerValue3 = 12345;
        const expectedHeaderValue3 = '12345';
        xhr.setRequestHeader(headerName3, headerValue3);

        expect(xhr._headers[headerName3]).toBeDefined();
        expect(xhr._headers[headerName3]).toBe(expectedHeaderValue3);
      });

      it('XMLHttpRequest setRequestHeader: negative case - add two request headers with same name and different values', function() {
        const method = 'GET';
        const url = 'http://echo.jsontest.com/key/value/one/two';
        const headerName1 = 'content-type';
        const headerValue1 = 'application/json';
        const headerName2 = 'content-type';
        const headerValue2 = 'charset=utf-8';
        const headerName3 = 'connection';
        const headerValue3 = 'close';

        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.setRequestHeader(headerName1, headerValue1);
        expect(xhr._headers[headerName1]).toBe(headerValue1);

        //DEVNOTE: not possible to add differrent values to same header by calling setRequestHeader multiple times
        xhr.setRequestHeader(headerName2, headerValue2);
        expect(xhr._headers[headerName2]).toBe(headerValue2);
        expect(xhr._headers[headerName1]).not.toBe(headerValue1 + '; ' + headerValue2);

        xhr.setRequestHeader(headerName3, headerValue3);
        expect(xhr._headers[headerName3]).toBe(headerValue3);
      });

      it('XMLHttpRequest setRequestHeader: positive case - add two request headers with same name and different values', function() {
        //DEVNOTE: possible way to add multiple values to the same header
        const method = 'GET';
        const url = 'http://echo.jsontest.com/key/value/one/two';
        const commonHeaderName = 'content-type';
        const headerValue1 = 'application/json';
        const headerValue2 = 'charset=utf-8';
        const expectedHeaderValue = 'application/json; charset=utf-8'

        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.setRequestHeader(commonHeaderName, `${headerValue1}; ${headerValue2}`);
        expect(xhr._headers[commonHeaderName]).toBe(expectedHeaderValue);
      });

    });

    describe('XMLHttpRequest send', function() {

      it('XMLHttpRequest send: negative case - call send method before open method', function() {
        const expectedErrorMessage = 'Request has not been opened';
        const xhr = new XMLHttpRequest();

        expect(xhr.readyState).toBe(0);
        expect(() => { xhr.send(); }).toThrowError(expectedErrorMessage);
      });

      it('XMLHttpRequest send: GET async, on default port', function(done) {
        const method = 'GET';
        const url = 'http://echo.jsontest.com:80';

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: GET async, on secured port', function(done) {
        const method = "GET";
        const url = "https://www.wikipedia.org:443/";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: POST async, on secured port', function(done) {
        const method = "POST";
        const url = "https://www.wikipedia.org:443/";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: GET async, without parameters', function(done) {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: GET async, with null as parameter', function(done) {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send(null);
      });

      it('XMLHttpRequest send: POST async', function(done) {
        const method = "POST";
        const url = "https://httpbin.org/post";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: PUT async', function(done) {
        const method = "PUT";
        const url = "https://httpbin.org/put";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: PATCH async', function(done) {
        const method = "PATCH";
        const url = "https://httpbin.org/patch";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: PATCH async with string data as parameter, Content-Type: text/plain and response type JSON', function(done) {
        const method = "PATCH";
        const url = "https://httpbin.org/patch";
        const contentTypeHeader = 'content-type';
        const contentTypeValue = 'text/plain';
        const dataString = "test string";
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);
            expect(typeof xhr.response).toBe("object");
            expect(xhr.response.data).toBe(dataString);

            done();
          }
        };

        xhr.setRequestHeader(contentTypeHeader, contentTypeValue);
        xhr.send(dataString);
      });

      it('XMLHttpRequest send: PATCH async with blob data as parameter and response type JSON', function(done) {
        const method = "PATCH";
        const url = "https://httpbin.org/patch";
        const dataString = "test string";
        const blob = new Blob([dataString], {
          type: 'text/plain'
        });
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);
            expect(typeof xhr.response).toBe("object");
            expect(xhr.responseType).toBe(responseType);

            done();
          }
        };

        xhr.send(blob);
      });

      it('XMLHttpRequest send: PATCH async with arraybuffer as parameter and response type JSON', function(done) {
        const method = "PATCH";
        const url = "https://httpbin.org/patch";
        const arrayBuffer = new ArrayBuffer(1024);
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);
            expect(typeof xhr.response).toBe("object");
            expect(xhr.responseType).toBe(responseType);

            done();
          }
        };

        xhr.send(arrayBuffer);
      });

      it('XMLHttpRequest send: DELETE async', function(done) {
        const method = "DELETE";
        const url = "http://httpbin.org/delete";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url, true);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: HEAD async', function(done) {
        const method = "HEAD";
        const url = "http://echo.jsontest.com/key/value/one/two";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.responseHeaders).toBeDefined();
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: OPTIONS async', function(done) {
        const method = "OPTIONS";
        const url = "http://httpbin.org/";
        const expectedAllowHeader = 'Allow';

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url, true);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.responseHeaders).toBeDefined();
            expect(xhr.responseHeaders[expectedAllowHeader]).toBeDefined();
            expect(xhr.responseHeaders).toBeDefined();
            expect(xhr.response).toBeDefined();
            expect(xhr.responseText).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: GET async, with domstring as parameter', function(done) {
        const method = "GET";
        const url = "https://httpbin.org/get";
        const param1 = 'somevariable';
        const value1 = 'someValue';
        const param2 = 'anothervariable';
        const value2 = 'anotherValue';
        const domstring = `${param1}=${value1}&${param2}=${value2}`;
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, `${url}?${domstring}`);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.response.args).toBeDefined();
            expect(xhr.response.args[param1]).toBe(value1);
            expect(xhr.response.args[param2]).toBe(value2);
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest send: POST async, with domstring as body parameter, Content-Type: application/x-www-form-urlencoded', function(done) {
        const method = "POST";
        const url = "https://httpbin.org/post";
        const param1 = 'somevariable';
        const value1 = 'someValue';
        const param2 = 'anothervariable';
        const value2 = 'anotherValue';
        const params = `${param1}=${value1}&${param2}=${value2}`;
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.response.form).toBeDefined();
            expect(xhr.response.form[param1]).toBe(value1);
            expect(xhr.response.form[param2]).toBe(value2);
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
      });

      it('XMLHttpRequest send: POST async, with domstring as parameter, Content-Type: text/plain', function(done) {
        const method = "POST";
        const url = "https://httpbin.org/post";
        const params = `somevariable=someValue\nanothervariable=anotherValue`;
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.response.data).toBeDefined();
            expect(xhr.response.data).toBe(params);
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(params);
      });

      it('XMLHttpRequest send: POST async, with FormData, Content-Type: multipart/form-data', function(done) {
        const method = "POST";
        const url = "https://httpbin.org/post";
        const param1 = 'somevariable';
        const value1 = 'someValue';
        const param2 = 'anothervariable';
        const value2 = 'anotherValue';
        const responseType = "json";

        const formData = new FormData();
        formData.append(param1, value1);
        formData.append(param2, value2);

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.response.headers['Content-Type']).toContain('multipart/form-data');
            expect(xhr.response.form[param1]).toBe(value1);
            expect(xhr.response.form[param2]).toBe(value2);
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(formData);
      });

    });

    describe('XMLHttpRequest authentification types', function() {

      it('XMLHttpRequest Basic auth: GET, positive case - valid credentials, withCredentials=true', function(done) {
        const method = "GET";
        const username = 'user';
        const password = 'password';
        const base64BasicCredentials = 'dXNlcjpwYXNzd29yZA==';
        const url = `https://httpbin.org/basic-auth/${username}/${password}`;
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.setRequestHeader('Authorization', `Basic ${base64BasicCredentials}`);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.withCredentials).toBe(true);
            expect(xhr.response).toBeDefined();
            expect(xhr.response.authenticated).toBe(true);
            expect(xhr.response.user).toBe(username);
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest Basic auth: GET, negative case - invalid credentials, withCredentials=true', function(done) {
        const method = "GET";
        const username = 'user';
        const password = 'password';
        const url = `https://httpbin.org/basic-auth/${username}/${password}`;
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.setRequestHeader('Authorization', `Basic ${username}:${password}`);

        xhr.onreadystatechange = function() {
          const expectedStatus = 401;

          if (xhr.readyState === 4) {
            expect(xhr.withCredentials).toBe(true);
            expect(xhr.response).toBeDefined();
            expect(xhr.response).toBeNull();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('MLHttpRequest Basic auth: GET, negative case - valid credentials set in open method, withCredentials=true', function(done) {
        const method = "GET";
        const username = 'user';
        const password = 'password';
        const url = `https://httpbin.org/basic-auth/${username}/${password}`;
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url, true, username, password);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          // DEVNOTE: It is expected to receive 401 (Not Authorized) with valid credentials, as currently
          // method open() doesn't support username and password arguments in React Native
          const expectedStatus = 401;

          if (xhr.readyState === 4) {
            expect(xhr.withCredentials).toBe(true);
            expect(xhr.response).toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest Digest auth: GET, positive case - valid credentials', function(done) {
        const method = 'GET';
        const url = 'http://gmaiis01.gma.sw.rim.net:8003/';
        const username = 'goodadmin';
        const password = 'password';

        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            const digestResponseHeader = xhr.getResponseHeader('Www-Authenticate');

            expect(xhr.status).toBe(401);
            expect(digestResponseHeader).toContain('Digest');

            const digest = new Digest(username, password, method);
            const digestRequestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

            xhr = new XMLHttpRequest();
            xhr.open(method, url);

            xhr.setRequestHeader('Authorization', digestRequestHeader);

            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                expect(xhr.status).toBe(200);

                done();
              }
            };

            xhr.send(null);
          }
        }

        xhr.send(null);
      });

      it('XMLHttpRequest Digest auth: GET, negative case - invalid credentials', function(done) {
        const method = 'GET';
        const url = 'http://gmaiis01.gma.sw.rim.net:8003/';
        const username = 'wrong_username';
        const password = 'wrong_password';

        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            const digestResponseHeader = xhr.getResponseHeader('Www-Authenticate');

            expect(xhr.status).toBe(401);
            expect(digestResponseHeader).toContain('Digest');

            const digest = new Digest(username, password, method);
            const digestRequestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

            xhr = new XMLHttpRequest();
            xhr.open(method, url);

            xhr.setRequestHeader('Authorization', digestRequestHeader);

            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                expect(xhr.status).toBe(401);

                done();
              }
            };

            xhr.send(null);
          }
        }

        xhr.send(null);
      });

      xit('XMLHttpRequest NTLM auth: GET, positive case - valid credentials', function(done) {
        const url = 'http://gmaiis01.gma.sw.rim.net:8005';
        const host = 'gmaiis01.gma.sw.rim.net:8005';
        const username = 'goodadmin';
        const password = 'password';
        const domain = 'gma';
        const method = 'GET';

        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('pragma', 'no-cache');
        xhr.setRequestHeader('cache-control', 'no-cache');

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            const ntlmResponseHeader = xhr.getResponseHeader('Www-Authenticate');

            expect(xhr.status).toBe(401);
            expect(ntlmResponseHeader).toContain('NTLM');

            // Send NTLM message 1
            Ntlm.setCredentials(domain, username, password);
            let msg1 = Ntlm.createMessage1(host);

            xhr = new XMLHttpRequest();

            xhr.open(method, url);
            xhr.setRequestHeader('Authorization', 'NTLM ' + msg1.toBase64());
            xhr.setRequestHeader('pragma', 'no-cache');
            xhr.setRequestHeader('cache-control', 'no-cache');

            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                // Handle NTLM message 2 (received response from NTLM server)
                const authResponseHeader = xhr.getResponseHeader('Www-Authenticate');
                const challenge = Ntlm.getChallenge(authResponseHeader);

                expect(xhr.status).toBe(401);
                expect(authResponseHeader).toContain('NTLM');

                // Send NTLM message 3
                const msg3 = Ntlm.createMessage3(challenge, host);

                xhr = new XMLHttpRequest();

                xhr.open(method, url);
                xhr.setRequestHeader('Authorization', 'NTLM ' + msg3.toBase64());
                xhr.setRequestHeader('pragma', 'no-cache');
                xhr.setRequestHeader('cache-control', 'no-cache');

                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    expect(xhr.status).toBe(200);

                    done();
                  }
                };

                xhr.send(null);
              }
            };

            xhr.send(null);
          }
        }

        // Auth request
        xhr.send(null);
      });

    });

    describe('XMLHttpRequest responseURL attribute', function() {

      it('Should be present on the XMLHttpRequest object', function(done) {
        const method = "GET";
        const url = "https://www.httpbin.org/get";
        const expectedStatus = 200;

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            expect(xhr.status).toBe(expectedStatus);
            expect(xhr.responseURL).toBeDefined();
            expect(xhr.responseURL).toBe(url);

            done();
          }
        };

        xhr.send();
      });

      xit('Should be equal to the redirection url', function(done) {
        const method = "GET";
        const url = "https://www.httpbin.org/redirect-to?url=";
        const redirectionUrl = "https://www.example.com/";
        const expectedStatus = 200;
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, `${url}${redirectionUrl}`);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            expect(xhr.status).toBe(expectedStatus);
            expect(xhr.responseURL).toBe(redirectionUrl);

            done();
          }
        };

        xhr.send();
      });

      xit('Should be equal to the last server URL in the redirection chain', function(done) {
        const method = "GET";
        const url = "https://www.httpbin.org/redirect/4";
        const redirectionUrl = "https://www.httpbin.org/get";
        const expectedStatus = 200;
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            expect(xhr.status).toBe(expectedStatus);
            expect(xhr.responseURL).toBe(redirectionUrl);

            done();
          }
        };

        xhr.send();
      });

    });

    describe('XMLHttpRequest getResponseHeader', function() {

      it('XMLHttpRequest getResponseHeader: negative case - no parameter', function(done) {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            // DEVNOTE: not expected specific error message, as React Native doesn't handle received func params here at all
            // Message: Expected function not to throw, but it threw TypeError: Cannot read property 'toLowerCase' of undefined."
            expect(() => { xhr.getResponseHeader(); }).toThrow();

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest getResponseHeader: positive case', function(done) {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";
        const headerName = "Content-Type";
        const expectedHeaderValue = "application/json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            const headerValue = xhr.getResponseHeader(headerName);

            expect(headerValue).toBeDefined();
            expect(headerValue.includes(expectedHeaderValue)).toBe(true);

            done();
          }
        };

        xhr.send();
      });

    });

    describe('XMLHttpRequest getAllResponseHeaders', function() {

      it('XMLHttpRequest getAllResponseHeaders: positive case', function(done) {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";
        const expectedDefaultHeaderName1 = "Content-Type";
        const expectedDefaultHeaderName2 = "Content-Length";
        const responseType = 'text';

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        xhr.responseType = responseType;
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            const headersValue = xhr.getAllResponseHeaders();

            expect(headersValue).toBeDefined();
            expect(headersValue.includes(expectedDefaultHeaderName1)).toBe(true);
            expect(headersValue.includes(expectedDefaultHeaderName2)).toBe(true);

            done();
          }
        };

        xhr.send();
      });

    });

    describe('XMLHttpRequest responseType', function() {

      it('XMLHttpRequest responseType: empty string, responseXML', function(done) {
        const method = "GET";
        const url = "https://www.w3schools.com/xml/note.xml";
        const contentTypeHeaderName = "Content-Type";
        const expectedContentTypeHeaderValue = "text/xml";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(typeof xhr.response).toBe("string");
            expect(xhr.responseText).toBeDefined();
            // DEVNOTE: currently responseXML property is not supported in React Native
            expect(xhr.responseXML).not.toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);
            expect(xhr.getResponseHeader(contentTypeHeaderName)).toBe(expectedContentTypeHeaderValue);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest responseType: text, responseXML', function(done) {
        const method = "GET";
        const url = "https://www.w3schools.com/xml/note.xml";
        const responseType = "text";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.responseType = responseType;

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(typeof xhr.response).toBe("string");
            expect(xhr.responseText).toBeDefined();
            // DEVNOTE: currently responseXML property is not supported in React Native
            expect(xhr.responseXML).not.toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest responseType: json', function(done) {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";
        const responseResultHeader1 = "key";
        const responseResultValue1 = "value";
        const responseResultHeader2 = "one";
        const responseResultValue2 = "two";
        const responseType = "json";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.responseType = responseType;

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(typeof xhr.response).toBe("object");
            expect(xhr.response[responseResultHeader1]).toBe(responseResultValue1);
            expect(xhr.response[responseResultHeader2]).toBe(responseResultValue2);
            // DEVNOTE: currently the 'responseText' property is only available if 'responseType' is set to '' or 'text' in React Native
            expect(() => { xhr.responseText; }).toThrow();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest responseType: document', function(done) {
        const method = "GET";
        const url = "https://www.w3schools.com/xml/note.xml";
        const responseType = "document";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.responseType = responseType;

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.response).toBeNull();
            // DEVNOTE: currently response of type 'document' is not handling in React Native, but we can get response text by _response
            expect(xhr._response.includes('<?xml')).toBe(true);
            expect(xhr.responseXML).not.toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest responseType: document: html', function(done) {
        const method = "GET";
        const url = "https://httpbin.org/html";
        const responseType = "document";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.responseType = responseType;

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            expect(xhr.response).toBeDefined();
            expect(xhr.response).toBeNull();
            // DEVNOTE: currently response of type 'document' is not handling in React Native, but we can get response text by _response
            expect(xhr._response.includes('<html>')).toBe(true);
            expect(xhr.responseXML).not.toBeDefined();
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest responseType: blob', function(done) {
        const method = "GET";
        const url = "https://via.placeholder.com/720";
        const responseType = "blob";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.responseType = responseType;

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            const expectedSize = parseInt(xhr.getResponseHeader('Content-Length'), 10);
            const expectedType = xhr.getResponseHeader('Content-Type');

            expect(xhr.response).toBeDefined();
            expect(xhr.response instanceof Blob).toBe(true);
            expect(xhr.response.size).toBe(expectedSize);
            expect(xhr.response.type).toBe(expectedType);
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

      it('XMLHttpRequest responseType: arraybuffer', function(done) {
        const method = "GET";
        const url = "https://via.placeholder.com/720";
        const responseType = "arraybuffer";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(0);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(1);

        xhr.responseType = responseType;

        xhr.onreadystatechange = function() {
          const expectedStatus = 200;

          if (xhr.readyState === 4) {
            const expectedSize = parseInt(xhr.getResponseHeader('Content-Length'), 10);

            expect(xhr.response).toBeDefined();
            expect(xhr.response instanceof ArrayBuffer).toBe(true);
            expect(xhr.response.byteLength).toBe(expectedSize);
            expect(xhr.status).toBeDefined();
            expect(xhr.status).toBe(expectedStatus);

            done();
          }
        };

        xhr.send();
      });

    });

    describe('XMLHttpRequest abort', function() {
      const UNSENT = 0;
      const OPENED = 1;
      const HEADERS_RECEIVED = 2;
      const LOADING = 3;
      const DONE = 4;

      it('XMLHttpRequest abort: before calling SEND method', function() {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(UNSENT);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(OPENED);
        expect(xhr.abort).toBeDefined();
        expect(xhr._aborted).toBe(false);

        xhr.abort();
        expect(xhr.readyState).toBe(UNSENT);
        expect(xhr._aborted).toBe(true);
      });

      it('XMLHttpRequest abort: after calling SEND method', function(done) {
        const method = "GET";
        const url = "http://echo.jsontest.com/key/value/one/two";

        const xhr = new XMLHttpRequest();
        expect(xhr.readyState).toBe(UNSENT);

        xhr.open(method, url);
        expect(xhr.readyState).toBe(OPENED);
        expect(xhr.abort).toBeDefined();
        expect(xhr.responseHeaders).not.toBeDefined();

        xhr.onreadystatechange = function() {
          if (xhr.readyState === HEADERS_RECEIVED) {
            expect(xhr.responseHeaders).toBeDefined();
            expect(typeof xhr.responseHeaders).toBe('object');

            xhr.abort();

            expect(xhr.responseHeaders).not.toBeDefined();
            expect(xhr.readyState).toBe(UNSENT);
            expect(xhr._aborted).toBe(true);

            done();
          }
        }

        xhr.send();
      });

    });

  });

  describe('FormData API', function() {

    it('Check FormData is available', function() {
      const window = global || window;
      const formData = new FormData();

      expect(FormData).toBeDefined();
      expect(formData instanceof FormData).toBe(true);
    });

    it('FormData append: positive case - no parameters', function() {
      const formData = new FormData();

      expect(formData).toBeDefined();
      expect(formData.append).toBeDefined();
      expect(() => { formData.append() }).not.toThrow();
    });

    it('FormData append: positive case - first parameter, second undefined', function() {
      const formData = new FormData();
      const formDataKey = 'key';

      expect(() => { formData.append(formDataKey) }).not.toThrow();
      expect(formData._parts[0][0]).toBe(formDataKey);
      expect(formData._parts[0][1]).toBeUndefined();
    });

    it('FormData append: positive case - first parameter, second null', function() {
      const formData = new FormData();
      const formDataKey = 'key';
      const formDataValue = null;

      expect(() => { formData.append(formDataKey, formDataValue) }).not.toThrow();
      expect(formData._parts[0][0]).toBe(formDataKey);
      expect(formData._parts[0][1]).toBeNull();
    });

    it('FormData append: positive case - first parameter, second parameter', function() {
      const formData = new FormData();
      const formDataKey = 'key';
      const formDataValue = 'value';

      expect(() => { formData.append(formDataKey, formDataValue) }).not.toThrow();
      expect(formData._parts[0][0]).toBe(formDataKey);
      expect(formData._parts[0][1]).toBe(formDataValue);
    });

    it('FormData append: positive case - two duplicating keys', function() {
      const formData = new FormData();
      const formDataDublikateKeyValue = 'key';
      const formDataValue1 = 'value1';
      const formDataValue2 = 'value2';

      expect(() => {
        formData.append(formDataDublikateKeyValue, formDataValue1);
        formData.append(formDataDublikateKeyValue, formDataValue2);
      }).not.toThrow();

      expect(formData._parts.length).toBe(2);
      expect(formData._parts[0][0]).toBe(formDataDublikateKeyValue);
      expect(formData._parts[0][1]).toBe(formDataValue1);
      expect(formData._parts[1][0]).toBe(formDataDublikateKeyValue);
      expect(formData._parts[1][1]).toBe(formDataValue2);
    });

    it('FormData getParts: positive case - get appended key/value', function() {
      const formData = new FormData();
      const formDataKey = 'key';
      const formDataValue = 'value';

      formData.append(formDataKey, formDataValue);

      const formDataParts = formData.getParts();
      const filteredFormData = formDataParts.filter(item => {
        return item.fieldName === formDataKey && item.string === formDataValue;
      })

      expect(formDataParts.length).toBe(1);
      expect(filteredFormData.length).toBe(1);
    });

  });

  // ToDo's:
  // - XMLHttpRequest addEventListener method
  // - sending file, FormData combinations parameters key/value with file
}
