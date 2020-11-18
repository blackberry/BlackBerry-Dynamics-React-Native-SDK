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
 
import { fetch, Blob } from 'BlackBerry-Dynamics-for-React-Native-Networking';

import { Ntlm } from '../scripts/ntlmHelper';
import { Digest } from '../scripts/digestHelper';

export default function() {
  describe('Fetch API', function() {
    // DEVNOTE: uncomment this, if default Jasmine timeout of 5 sec is not enough to receive server response
    let originalTimeout;

    beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('Check fetch is available', function() {
      expect(fetch).toBeDefined();
    });

    describe('Fetch headers', function() {

      it('Fetch: GET, set custom header in Headers', async function() {
        const url = 'https://httpbin.org/headers';
        const customHeaderName = 'Custom-Header';
        const customHeaderValue = 'headerValue';

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            [customHeaderName]: customHeaderValue
          }
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson.headers[customHeaderName]).toBe(customHeaderValue);
      });

      it('Fetch: GET, set ordinary header in Headers', async function() {
        const url = 'https://httpbin.org/headers';
        const headerName = 'Content-Type';
        const headerValue = 'application/json; charset=utf-8';

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            [headerName]: headerValue
          }
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson.headers[headerName]).toBe(headerValue);
      });

      it('Fetch: GET, set ordinary and custom headers directly in fetch', async function() {
        const url = 'https://httpbin.org/headers';
        const headerName = 'Content-Type';
        const headerValue = 'application/json; charset=utf-8';
        const customHeaderName = 'Custom-Header';
        const customHeaderValue = 'headerValue';

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            [headerName]: headerValue,
            [customHeaderName]: customHeaderValue
          }
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson.headers[headerName]).toBe(headerValue);
        expect(responseJson.headers[customHeaderName]).toBe(customHeaderValue);
      });

      it('Fetch: GET, get headers', async function() {
        const url = 'https://httpbin.org/headers';
        const expectedHeaderName = 'Content-Type';
        const expectedHeaderValue = 'application/json';

        const response = await fetch(url, {
          method: 'GET',
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.headers.get(expectedHeaderName)).toBe(expectedHeaderValue);
        expect(parseInt(response.headers.get('Content-Length'), 10)).toBeGreaterThan(0);
      });

    });

    describe('Fetch response status codes', function() {
      const url = 'https://httpbin.org';

      it('Fetch: GET, code 200: OK', async function() {
        const response = await fetch(url + '/status/200', {
          method: 'GET'
        });

        expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
      });

      it('Fetch: GET, code 201: Created', async function() {
        const response = await fetch(url + '/status/201', {
          method: 'GET',
        });

        expect(response.status).toBe(201);
        expect(response.ok).toBe(true);
      });

      it('Fetch: POST, code 201: Created', async function() {
        const response = await fetch(url + '/status/201', {
          method: 'POST',
          body: null
        });

        expect(response.status).toBe(201);
        expect(response.ok).toBe(true);
      });

      it('Fetch: DELETE, code 202: Accepted', async function() {
        const response = await fetch(url + '/status/202', {
          method: 'DELETE',
        });

        expect(response.status).toBe(202);
        expect(response.ok).toBe(true);
      });

      it('Fetch: DELETE, code 204: No Content', async function() {
        const response = await fetch(url + '/status/204', {
          method: 'DELETE',
        });

        expect(response.status).toBe(204);
        expect(response.ok).toBe(true);
      });

      xit('Fetch: DELETE, should redirect to the redirection url, code 301: Moved Permanently', async function() {
        const redirectionUrl = 'https://httpbin.org/get';

        const response = await fetch(url + '/status/301', {
          method: 'GET',
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.url).toBe(redirectionUrl);
      });

      it('Fetch: GET, code 401: Unauthorized', async function() {
        const response = await fetch(url + '/status/401', {
          method: 'GET',
        });

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);
      });

      it('Fetch: GET, code 403: Forbidden', async function() {
        const response = await fetch(url + '/status/403', {
          method: 'GET',
        });

        expect(response.status).toBe(403);
        expect(response.ok).toBe(false);
      });

      it('Fetch: GET, code 404: Not Found', async function() {
        const response = await fetch(url + '/status/404', {
          method: 'GET',
        });

        expect(response.status).toBe(404);
        expect(response.ok).toBe(false);
      });

      it('Fetch: DELETE, code 404: Not Found', async function() {
        const response = await fetch(url + '/status/404', {
          method: 'DELETE',
        });

        expect(response.status).toBe(404);
        expect(response.ok).toBe(false);
      });

      it('Fetch: GET, code 407: Proxy Authentication Required', async function() {
        const response = await fetch(url + '/status/407', {
          method: 'GET',
        });

        expect(response.status).toBe(407);
        expect(response.ok).toBe(false);
      });

      it('Fetch: GET, code 500: Internal Server Error', async function() {
        const response = await fetch(url + '/status/500', {
          method: 'GET'
        });

        expect(response.status).toBe(500);
        expect(response.ok).toBe(false);
      });

      it('Fetch: GET, code 501: Not Implemented', async function() {
        const response = await fetch(url + '/status/501', {
          method: 'GET',
        });

        expect(response.status).toBe(501);
        expect(response.ok).toBe(false);
      });

      it('Fetch: GET, code 503: Service Unavailable', async function() {
        const response = await fetch(url + '/status/503', {
          method: 'GET',
        });

        expect(response.status).toBe(503);
        expect(response.ok).toBe(false);
      });

    });

    describe('Fetch send request', function() {

      it('Fetch: GET, with domstring as parameter', async function() {
        const method = 'GET';
        const url = 'https://httpbin.org/get';
        const param1 = 'somevariable';
        const value1 = 'someValue';
        const param2 = 'anothervariable';
        const value2 = 'anotherValue';
        const domstring = `${param1}=${value1}&${param2}=${value2}`;

        const response = await fetch(`${url}?${domstring}`, {
          method,
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson).toBeDefined();
        expect(responseJson.args).toBeDefined();
        expect(responseJson.args[param1]).toBe(value1);
        expect(responseJson.args[param2]).toBe(value2);
      });

      it('Fetch: POST, with domstring as body parameter, Content-Type: application/x-www-form-urlencoded', async function() {
        const method = 'POST';
        const url = 'https://httpbin.org/post';
        const param1 = 'somevariable';
        const value1 = 'someValue';
        const param2 = 'anothervariable';
        const value2 = 'anotherValue';
        const params = `${param1}=${value1}&${param2}=${value2}`;

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson).toBeDefined();
        expect(responseJson.form).toBeDefined();
        expect(responseJson.form[param1]).toBe(value1);
        expect(responseJson.form[param2]).toBe(value2);
      });

      it('Fetch: POST, with domstring as parameter, Content-Type: text/plain', async function() {
        const method = 'POST';
        const url = 'https://httpbin.org/post';
        const params = `somevariable=someValue\nanothervariable=anotherValue`;

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'text/plain'
          },
          body: params
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson).toBeDefined();
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data).toBe(params);
      });

      it('Fetch: POST, with JSON as parameter, Content-Type: application/json', async function() {
        const method = 'POST';
        const url = 'https://httpbin.org/post';
        const jsonObject = {
          param1: 'somevariable',
          value1: 'someValue',
          param2: 'anothervariable',
          value2: 'anotherValue'
        };

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(jsonObject)
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();
        const responseDataJsonObject = JSON.parse(responseJson.data);

        expect(responseJson).toBeDefined();
        expect(responseJson.headers['Content-Type']).toBeDefined();
        expect(responseJson.headers['Content-Type']).toContain('application/json');
        expect(responseJson.data).toBeDefined();
        expect(jsonObject).toEqual(responseDataJsonObject);
      });

      it('Fetch: POST, with FormData, Content-Type: multipart/form-data', async function() {
        const method = 'POST';
        const url = 'https://httpbin.org/post';
        const param1 = 'somevariable';
        const value1 = 'someValue';
        const param2 = 'anothervariable';
        const value2 = 'anotherValue';

        const formData = new FormData();
        formData.append(param1, value1);
        formData.append(param2, value2);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          body: formData
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson).toBeDefined();
        expect(responseJson.headers['Content-Type']).toBeDefined();
        expect(responseJson.headers['Content-Type']).toContain('multipart/form-data');
        expect(responseJson.form).toBeDefined();
        expect(responseJson.form[param1]).toBe(value1);
        expect(responseJson.form[param2]).toBe(value2);
      });

      it('Fetch: GET, with blob data, Accept: image/jpeg', async function() {
        const url = 'https://httpbin.org';
        const acceptHeaderValue = 'image/jpeg';

        const response = await fetch(url + '/image', {
          method: 'GET',
          headers: {
            'Accept': acceptHeaderValue
          }
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseContentLength = parseInt(response.headers.get('content-length'), 10);
        const responseContentType = response.headers.get('content-type');

        expect(responseContentLength).toBeGreaterThan(0);
        expect(responseContentType).toBe(acceptHeaderValue);
        expect(response.headers.get('connection')).toBe('keep-alive');

        const imageBlob = await response.blob();

        expect(imageBlob.size).toBe(responseContentLength);
        expect(imageBlob.type).toBe(responseContentType);
      });

      it('Fetch: GET, with blob data, Accept: image/svg+xml', async function() {
        const acceptHeaderValue = 'image/svg+xml';
        const url = 'https://httpbin.org';

        const response = await fetch(url + '/image', {
          method: 'GET',
          headers: {
            'Accept': acceptHeaderValue
          }
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseContentLength = parseInt(response.headers.get('content-length'), 10);
        const responseContentType = response.headers.get('content-type');

        expect(responseContentLength).toBeGreaterThan(0);
        expect(responseContentType).toBe(acceptHeaderValue);
        expect(response.headers.get('connection')).toBe('keep-alive');

        const imageBlob = await response.blob();

        expect(imageBlob.size).toBe(responseContentLength);
        expect(imageBlob.type).toBe(responseContentType);
      });

      it('Fetch: GET, with blob data, Accept: image/webp', async function() {
        const acceptHeaderValue = 'image/webp';
        const url = 'https://httpbin.org';

        const response = await fetch(url + '/image', {
          method: 'GET',
          headers: {
            'Accept': acceptHeaderValue
          }
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseContentLength = parseInt(response.headers.get('content-length'), 10);
        const responseContentType = response.headers.get('content-type');

        expect(responseContentLength).toBeGreaterThan(0);
        expect(responseContentType).toBe(acceptHeaderValue);
        expect(response.headers.get('connection')).toBe('keep-alive');

        const imageBlob = await response.blob();

        expect(imageBlob.size).toBe(responseContentLength);
        expect(imageBlob.type).toBe(responseContentType);
      });

      it('Fetch: PATCH, with blob data, Content-Type: application/octet-stream', async function() {
        const method = 'PATCH';
        const url = 'https://httpbin.org/patch';
        const dataString = 'test string';
        const blob = new Blob([dataString], {
          type: 'text/plain'
        });

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          body: blob
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson.headers['Content-Type']).toBeDefined();
        expect(responseJson.headers['Content-Type']).toContain('application/octet-stream');
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data).toBe(dataString);
      });

      it('Fetch: PUT, with arraybuffer', async function() {
        const method = 'PUT';
        const url = 'https://httpbin.org/put';
        const arrayBuffer = new ArrayBuffer(16);
        let view = new Uint32Array(arrayBuffer);
        view[0] = 123456;

        const response = await fetch(url, {
          method,
          body: arrayBuffer
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson).toBeDefined();
        expect(responseJson.data.length).toBeGreaterThan(0);
      });

    });

    describe('Fetch response type', function() {

      it('Fetch: response type: json', async function() {
        const method = 'GET';
        const url = 'http://echo.jsontest.com/key/value/one/two';
        const responseResultHeader1 = 'key';
        const responseResultValue1 = 'value';
        const responseResultHeader2 = 'one';
        const responseResultValue2 = 'two';

        const response = await fetch(url, {
          method
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson).toBeDefined();
        expect(typeof responseJson).toBe('object');
        expect(responseJson[responseResultHeader1]).toBe(responseResultValue1);
        expect(responseJson[responseResultHeader2]).toBe(responseResultValue2);
      });

      it('Fetch: response type: text', async function() {
        const method = 'GET';
        const url = 'https://www.w3schools.com/xml/note.xml';

        const response = await fetch(url, {
          method
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseText = await response.text();

        expect(responseText).toBeDefined();
        expect(typeof responseText).toBe('string');
        expect(responseText).toContain('<?xml');
      });

      it('Fetch: response type: blob', async function() {
        const method = 'GET';
        const url = 'https://via.placeholder.com/720';

        const response = await fetch(url, {
          method
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseBlob = await response.blob();

        const expectedSize = parseInt(response.headers.get('Content-Length'), 10);
        const expectedType = response.headers.get('Content-Type');

        expect(responseBlob).toBeDefined();
        expect(responseBlob instanceof Blob).toBe(true);
        expect(responseBlob.size).toBe(expectedSize);
        expect(responseBlob.type).toBe(expectedType);
      });

      it('Fetch: response type: arraybuffer - negative case', async function(done) {
        const method = 'GET';
        const url = 'https://via.placeholder.com/720';

        const response = await fetch(url, {
          method
        });

        try {
          await response.arrayBuffer();
        } catch (e) {
          // DEVNOTE: ArrayBuffer doesn't work due to React Native issue
          expect(e.message).toBe('FileReader.readAsArrayBuffer is not implemented');
          done();
        }
      });

    });

    describe('Fetch authentification types', function() {

      it('Fetch Basic auth: GET, positive case - valid credentials', async function() {
        const username = 'user';
        const password = 'password';
        const base64BasicCredentials = 'dXNlcjpwYXNzd29yZA==';
        const url = `https://httpbin.org/basic-auth/${username}/${password}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${base64BasicCredentials}`
          }
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseJson = await response.json();

        expect(responseJson.authenticated).toBe(true);
        expect(responseJson.user).toBe(username);
      });

      it('Fetch Basic auth: GET, negative case - invalid credentials', async function() {
        const username = 'user';
        const password = 'password';
        const url = `https://httpbin.org/basic-auth/${username}/${password}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${username}:${password}`
          }
        });

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);

        const responseText = await response.text();

        expect(responseText).toBe('');
      });

      it('Fetch Digest auth: GET, positive case - valid credentials', async function() {
        const requestMethod = 'GET';
        const url = 'http://gmaiis01.gma.sw.rim.net:8003/';
        const username = 'goodadmin';
        const password = 'password';

        const responseNotAuthorized = await fetch(url, { method: requestMethod });
        const digestResponseHeader = responseNotAuthorized.headers.get('Www-Authenticate');

        expect(responseNotAuthorized.status).toBe(401);
        expect(responseNotAuthorized.ok).toBe(false);
        expect(digestResponseHeader).toContain('Digest');

        const digest = new Digest(username, password, requestMethod);
        const digestRequestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

        const response = await fetch(url, {
          method: requestMethod,
          headers: {
            'Authorization': digestRequestHeader
          }
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
      });

      it('Fetch Digest auth: GET, negative case - invalid credentials', async function() {
        const requestMethod = 'GET';
        const url = 'http://gmaiis01.gma.sw.rim.net:8003/';
        const username = 'wrong_username';
        const password = 'wrong_password';

        const responseNotAuthorized = await fetch(url, { method: requestMethod });
        const digestResponseHeader = responseNotAuthorized.headers.get('Www-Authenticate');

        expect(responseNotAuthorized.status).toBe(401);
        expect(responseNotAuthorized.ok).toBe(false);
        expect(digestResponseHeader).toContain('Digest');

        const digest = new Digest(username, password, requestMethod);
        const digestRequestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

        const response = await fetch(url, {
          method: requestMethod,
          headers: {
            'Authorization': digestRequestHeader
          }
        });

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);
      });

      it('Fetch NTLM auth: GET, positive case - valid credentials', async function() {
        const url = 'http://gd-lviv04.gd.sw.rim.net:8085/';
        const host = 'gd-lviv04.gd.sw.rim.net:8085';
        const username = 'gdadmin';
        const password = 'gdadmin';
        const domain = 'gd';
        const requestMethod = 'GET';
        const requestHeaders = {
          'pragma': 'no-cache',
          'cache-control': 'no-cache',
        };

        const responseNotAuthorized = await fetch(url, { method: requestMethod });
        const headerNotAuthorized = responseNotAuthorized.headers.get('Www-Authenticate');

        expect(responseNotAuthorized.status).toBe(401);
        expect(responseNotAuthorized.ok).toBe(false);
        expect(headerNotAuthorized).toContain('NTLM');

        // Send NTLM message 1
        Ntlm.setCredentials(domain, username, password);
        let msg1 = Ntlm.createMessage1(host);
        const ntlmResponseMessage1 = await fetch(url, {
          method: requestMethod,
          headers: {
            'Authorization': 'NTLM ' + msg1.toBase64(),
            ...requestHeaders
          }
        });
        const ntlmResponseHeader = ntlmResponseMessage1.headers.get('Www-Authenticate');

        expect(ntlmResponseMessage1.status).toBe(401);
        expect(ntlmResponseMessage1.ok).toBe(false);
        expect(ntlmResponseHeader).toContain('NTLM');

        // Handle NTLM message 2 (received response from NTLM server)
        const challenge = Ntlm.getChallenge(ntlmResponseHeader);

        // Send NTLM message 3
        const msg3 = Ntlm.createMessage3(challenge, host);
        const ntlmResponseMessage3 = await fetch(url, {
          method: requestMethod,
          headers: {
            'Authorization': 'NTLM ' + msg3.toBase64(),
            ...requestHeaders
          }
        });

        expect(ntlmResponseMessage3.status).toBe(200);
        expect(ntlmResponseMessage3.ok).toBe(true);
      });

    });

  });
}
