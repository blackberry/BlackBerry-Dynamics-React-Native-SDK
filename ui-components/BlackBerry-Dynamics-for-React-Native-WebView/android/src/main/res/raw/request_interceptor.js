/*
 * Copyright (c) 2021 BlackBerry Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
const INTERCEPT_REQUEST_MARKER = 'gdinterceptrequest';

function randowmStr() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}


function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
    });
}


async function serializeForm(requestID, form) {

    var serialized = [];

    if (form.enctype === 'multipart/form-data') {

        let boundary = "--WebKitBoundary" + randowmStr();
        for (var i = 0; i < form.elements.length; i++) {

            var field = form.elements[i];

            if (!field.name || field.disabled || field.type === 'reset' || field.type === 'button') continue;

            if (filed.type === 'file') {
                var files = field.files;
                for (var i = 0; i < files.length; i++) {
                    var file = files.item(i);
                    if (file instanceof File) { /* for File (Blob) */
                        RequestInterceptor.addRequestFormData(requestID, field.name, 'File', file.name);

                        var filedata = await readFileAsDataURL(file);
                        RequestInterceptor.addRequestFileData(file.name, file.type, filedata);

                    }
                }

            } else if (field.type === 'select-multiple') {
                for (var n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) continue;
                    serialized.push(field.name + "=" + field.options[n].value);
                    RequestInterceptor.addRequestFormData(requestID, field.name, 'String', field.options[n].value);
                }
            } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                RequestInterceptor.addRequestFormData(requestID, field.name, 'String', field.options[n].value);
            }
        }

        serialized.push(boundary);
        return serialized.join('');

    } else if (form.enctype === 'text/plain') {
        for (var i = 0; i < form.elements.length; i++) {

            var field = form.elements[i];

            if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'button') continue;

            if (field.type === 'select-multiple') {
                for (var n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) continue;
                    serialized.push(field.name + "=" + field.options[n].value);
                }
            } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized.push(field.name + "=" + field.value);
            }
        }

        return serialized.join('\r\n');
    } else {
        /* application/x-www-form-urlencoded */
        for (var i = 0; i < form.elements.length; i++) {

            var field = form.elements[i];

            if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'button') continue;

            if (field.type === 'select-multiple') {
                for (var n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) continue;
                    serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
                }
            } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
            }
        }

        return serialized.join('&');
    }

}


async function serializeMultipart(requestID, formData) {
    let elements = [];
    let boundary = "--WebKitBoundary" + randowmStr();

    for (var pair of formData.entries()) {
        let name = pair[0];
        let value = pair[1];

        if (value instanceof File) { /* for File (Blob) */
            RequestInterceptor.addRequestFormData(requestID, name, 'File', value.name);
            var filedata = await readFileAsDataURL(value);
            RequestInterceptor.addRequestFileData(value.name, value.type, filedata);

        } else { /* or String */
            RequestInterceptor.addRequestFormData(requestID, name, 'String', value);
        }

    }

    elements.push(boundary);
    return elements.join('');
}


async function serializeBlob(requestID, blob) {
    let name = "Blob" + requestID;
    let file = new File([blob], name, { type: blob.type });

    filedata = await readFileAsDataURL(file);
    RequestInterceptor.addRequestFileData(file.name, file.type, filedata);

    return file.name;
}


function generateRandom() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}


document.addEventListener('submit', function(e) {
    let form = e.srcElement;

    if (form._submit === undefined) {
        form._submit = form.submit;

        form.submit = async function() {
            if (form.action && form.method != "get") {
                if (!form.action.includes(INTERCEPT_REQUEST_MARKER)) {
                    let requestId = generateRandom();
                    let body = await serializeForm(requestId, this);
                    this.action = this.action + INTERCEPT_REQUEST_MARKER + requestId;
                    RequestInterceptor.addRequestBody(requestId, body, form.action + '', '{"context": "document.submit", "enctype": "' + this.enctype + '"}');
                } else {
                    RequestInterceptor.addRequestBody(requestId, "", (form && form.action) || "", '{"context": "document.submit"}');
                }
            } else {
                console.log('submit previous form url = ' + form.action);
            }
            this._submit();
        };
    }

    form.submit();
    /* Prevent the default form submit */
    e.preventDefault();

}, false);


(function() {

    for (var i = 0; i < document.forms.length; i++) {
        let form = document.forms[i];

        form._submit = form.submit;

        form.submit = async function() {
            if (form.action && form.method != "get") {
                if (!form.action.includes(INTERCEPT_REQUEST_MARKER)) {
                    let requestId = generateRandom();
                    let body = await serializeForm(requestId, this);
                    this.action = this.action + INTERCEPT_REQUEST_MARKER + requestId;
                    RequestInterceptor.addRequestBody(requestId, body, form.action + '', '{"context": "document.submit", "enctype": "' + this.enctype + '"}');
                } else {
                    RequestInterceptor.addRequestBody(requestId, "", (form && form.action) || "", '{"context": "document.submit"}');
                }
            } else {
                console.log('submit previous form url = ' + form.action);
            }
            this._submit();
        };
    }

})();


(function(XHR) {

    if (!XHR.prototype.xRequest) {
        console.log('xRequest define property');
        Object.defineProperty(XHR.prototype, 'xRequest', {
            value: {
                url: "",
                requestId: null
            }
        });
    } else {
        console.log('xRequest defined');
    }

    let open = XHR.prototype.open;
    let send = XHR.prototype.send;
    let setHeader = XHR.prototype.setRequestHeader;

    XHR.prototype.setRequestHeader = function(name, value) {
        console.log('XHR.prototype.setRequestHeader ' + name + ' ' + value);
        setHeader.call(this, name, value);
        this.headers = this.headers || [];
        this.headers.push({
            'name': name,
            'value': value
        });

        console.log('XHR.prototype.setRequestHeader url = ' + this.xRequest.url);
    };

    XHR.prototype.open = function(method, url, async, user, pass) {

        console.log('XHR.prototype.open ' + method + ' ' + url + ' ' + async + ' ' + user + ' ' + pass);
        this.xRequest.requestId = generateRandom();
        url += INTERCEPT_REQUEST_MARKER + this.xRequest.requestId;

        this.xRequest.url = url;

        console.log('XHR.prototype.open url = ' + this.xRequest.url);

        if (typeof async !== undefined && !async) {
            async = true;
            console.warn('Synchronous requests are not supported in XMLHttpRequest.prototype.open and are treated as asynchronous');
        }

        open.call(this, method, url, async, user, pass);
    };

    XHR.prototype.send = async function(data) {
        var postbody = data;
        console.log('XHR.prototype.send reqID : ' + this.xRequest.requestId + ' body ' + postbody);
        if (this.xRequest.requestId != null) {
            let body = postbody;
            if (body) {
                if (body instanceof FormData) {
                    body = await serializeMultipart(this.xRequest.requestId, body);
                    this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + body);
                    RequestInterceptor.addRequestBody(this.xRequest.requestId, body, this.xRequest.url || "", '{"this": "XHR.prototype.send", "bodyType":"FormData"}');
                } else if (body instanceof ArrayBuffer) {
                    body = arrayBufferToBase64(body);
                    RequestInterceptor.addRequestBody(this.xRequest.requestId, body, this.xRequest.url || "", '{"this": "XHR.prototype.send", "bodyType":"ArrayBuffer"}');
                } else if (body instanceof Blob) {
                    body = await serializeBlob(this.xRequest.requestId, body);
                    this.setRequestHeader('Content-Type', data.type);
                    RequestInterceptor.addRequestBody(this.xRequest.requestId, body, this.xRequest.url || "", '{"this": "XHR.prototype.send", "bodyType":"Blob"}');
                } else {
                    RequestInterceptor.addRequestBody(this.xRequest.requestId, body, this.xRequest.url || "", '{"this": "XHR.prototype.send", "bodyType": "string"}');
                }
                console.log('XHR.prototype.send body ' + body);
            } else {
                console.log('XHR.prototype.send body is empty ');
                RequestInterceptor.addRequestBody(this.xRequest.requestId, "", this.xRequest.url || "", '{"this": "XHR.prototype.send"}');
            }
        }

        console.log('XHR.prototype.send url = ' + this.xRequest.url);

        send.call(this, postbody);
    }


})(XMLHttpRequest);


(function() {

    const originalRequest = Request;

    function RequestReplacement() {
        var init = arguments[1];

        if (!arguments[0]) {
            return new originalRequest();
        }

        if (arguments[0] instanceof Request) {
            return arguments.length > 1 ? new originalRequest(arguments[0], arguments[1]) : new originalRequest(arguments[0]);
        }

        var initPassed = init instanceof Object,
            method = initPassed ? init['method'] : false,
            body = method && init['body'] ? init['body'] : false;

        var originUrl = arguments[0],
            requestId = generateRandom(),
            maskedUrl = originUrl + INTERCEPT_REQUEST_MARKER + requestId,
            origin = new originalRequest(maskedUrl, arguments[1]),
            options = {},
            init = arguments[1];

        Object.defineProperty(origin, '_shadowOptions', {
            get: function() {
                return options;
            }
        });

        options.method = init['method'] ? init['method'].toUpperCase() : 'GET';
        options.mode = init['mode'];
        options.body = init['body'];
        options.url = maskedUrl;
        options.requestId = requestId;

        return origin;
    };

    if (!Request._patched) {
        Request = RequestReplacement;

        Object.defineProperty(Request, 'toString', {
            value: function() {
                return 'function Request() {\n\t[native code]\n}';
            }
        });

        Object.defineProperty(Request, '_patched', {
            value: true
        });
    }

    const originalFetch = window.fetch;

    window.fetch = async function() {
        var firstArgument = arguments[0];
        if (!firstArgument) {
            return originalFetch();
        }
        var request;
        if (typeof firstArgument == 'string') {
            request = arguments.length > 1 ? new Request(arguments[0], arguments[1]) : new Request(arguments[0]);
        } else {
            request = firstArgument.constructor == originalRequest ? firstArgument : '/';
        }

        if (!request._shadowOptions) {
            return originalFetch(request);
        }

        var requestOptions = request._shadowOptions,
            body = requestOptions.body,
            method = requestOptions.method,
            mode = requestOptions.mode,
            url = requestOptions.url,
            requestId = requestOptions.requestId;

        console.log('GD fetch, requestId = ' + requestId);

        if (requestOptions != undefined) {

            console.log('GD fetch, method = ' + method);
            console.log('GD fetch, mode = ' + mode);

            let fetchMode = ' "mode" : "' + mode + '"';

            if (method && method != 'GET' && method != 'HEAD' && method != 'OPTIONS') {

                if (body instanceof FormData) {

                    body = await serializeMultipart(requestId, body);

                    console.log('GD fetch, addBody 1 requestId = ' + requestId);

                    RequestInterceptor.addRequestBody(requestId, body, url + "", '{"this": "window.fetch", "bodyType":"FormData",' + fetchMode + '}');

                } else if (body instanceof ArrayBuffer) {

                    body = arrayBufferToBase64(body);

                    console.log('GD fetch, addBody 2 requestId = ' + requestId);

                    RequestInterceptor.addRequestBody(requestId, body, url + "", '{"this": "window.fetch", "bodyType":"ArrayBuffer",' + fetchMode + '}');

                } else if (body instanceof Blob) {

                    body = await serializeBlob(requestId, body);

                    console.log('GD fetch, addBody 3 requestId = ' + requestId);

                    RequestInterceptor.addRequestBody(requestId, body, url + "", '{"this": "window.fetch", "bodyType":"Blob",' + fetchMode + '}');

                } else {
                    console.log('GD fetch, addBody 4 requestId = ' + requestId);

                    RequestInterceptor.addRequestBody(requestId, body, url + "", '{"this":"window.fetch","bodyType": "string",' + fetchMode + '}');
                }
            } else {
                console.log('GD fetch addBody, 5 requestId = ' + requestId);

                RequestInterceptor.addRequestBody(requestId, "", url + "", '{"this":"window.fetch", "method": "' + method + '",' + fetchMode + '}');
            }
        } else {
            RequestInterceptor.addRequestBody(requestId, "", url + "", '{"this":"window.fetch"}');
        }

        return originalFetch(request);
    }
})();