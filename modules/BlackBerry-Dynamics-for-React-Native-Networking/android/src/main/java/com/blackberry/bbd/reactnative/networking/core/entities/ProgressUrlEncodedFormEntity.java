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

package com.blackberry.bbd.reactnative.networking.core.entities;

import com.good.gd.apache.http.NameValuePair;
import com.good.gd.apache.http.client.utils.URLEncodedUtils;
import com.good.gd.apache.http.protocol.HTTP;

import java.io.UnsupportedEncodingException;
import java.util.List;

/**
 * {@link com.good.gd.apache.http.client.entity.UrlEncodedFormEntity} that notifies about upload progress.
 */
public class ProgressUrlEncodedFormEntity extends ProgressStringEntity {

    public ProgressUrlEncodedFormEntity(
        final List<? extends NameValuePair> parameters,
        final String encoding,
        final OnProgressEvent progressEvent) throws UnsupportedEncodingException {

        super(URLEncodedUtils.format(parameters, encoding), encoding, progressEvent);
        setContentType(URLEncodedUtils.CONTENT_TYPE);
    }

    public ProgressUrlEncodedFormEntity(
        final List<? extends NameValuePair> parameters, 
        final OnProgressEvent progressEvent) throws UnsupportedEncodingException {

        super(URLEncodedUtils.format(parameters, HTTP.DEFAULT_CONTENT_CHARSET),
                HTTP.DEFAULT_CONTENT_CHARSET, progressEvent);
        setContentType(URLEncodedUtils.CONTENT_TYPE);
    }

    public ProgressUrlEncodedFormEntity(
        final String parameters,
        final OnProgressEvent progressEvent) throws UnsupportedEncodingException {

        super(parameters,
                HTTP.DEFAULT_CONTENT_CHARSET, progressEvent);
        setContentType(URLEncodedUtils.CONTENT_TYPE);
    }
}
