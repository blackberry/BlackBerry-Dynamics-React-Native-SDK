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

package com.blackberry.bbd.reactnative.networking.core;

import com.good.gd.apache.http.protocol.HTTP;
import com.good.gd.net.GDHttpClient;

import com.good.gd.apache.http.HttpEntity;
import com.good.gd.apache.http.HttpHost;
import com.good.gd.apache.http.HttpResponse;
import com.good.gd.apache.http.client.methods.HttpUriRequest;
import com.good.gd.apache.http.protocol.HttpContext;
import com.good.gd.apache.http.util.EntityUtils;

import java.io.IOException;

public class GDHttpRequestDelegate {

    public GDHttpClient getHttpClient() {
        return new GDHttpClient();
    }

    public void httpClientClearCredentialsforScheme(final int scheme,
                                                    final GDHttpClient httpClient) {
        httpClient.clearCredentialsForScheme(scheme);
    }

    public void httpClientKerberosAllowDelegation(final boolean isAllowed,
                                                  final GDHttpClient httpClient) {
        httpClient.kerberosAllowDelegation(isAllowed);
    }

    public void httpClientDisableHostVerification(final GDHttpClient httpClient) {
        httpClient.disableHostVerification();
    }

    public void httpClientDisablePeerVerification(final GDHttpClient httpClient) {
        httpClient.disablePeerVerification();
    }

    public HttpResponse httpClientExecute(final GDHttpClient httpClient, HttpUriRequest request, HttpContext httpContext)
            throws IOException {
        return httpClient.execute(request, httpContext);
    }

    public HttpResponse httpClientExecute(final GDHttpClient httpClient, HttpHost host, HttpUriRequest request, HttpContext httpContext)
            throws IOException {
        return httpClient.execute(host, request, httpContext);
    }

    public String getHttpEntityAsString(final HttpEntity httpEntity) throws IOException {
        return escapeSpecialCharacters(EntityUtils.toString(httpEntity, HTTP.UTF_8));
    }

    private String escapeSpecialCharacters(final String stringEntity) {
        return stringEntity.replaceAll("\\x{2028}", "\\\\u2028")
                .replaceAll("\\x{2029}", "\\\\u2029");
    }
}

