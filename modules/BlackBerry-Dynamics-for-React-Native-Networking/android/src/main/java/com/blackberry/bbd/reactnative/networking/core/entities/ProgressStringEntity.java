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

import com.good.gd.apache.http.entity.StringEntity;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

/**
 * Extension of {@link com.good.gd.apache.http.entity.StringEntity} that notifies about
 * upload progress.
 */
public class ProgressStringEntity extends StringEntity {

    private static final int COMPLETE_PROGRESS = 100;

    private final OnProgressEvent progressEvent;

    private long writtenLength;
    private OutputStreamProgress outputStreamProgress;

    public ProgressStringEntity(
        final String data,
        final String charset,
        final OnProgressEvent progressEvent) throws UnsupportedEncodingException {
        super(data, charset);
        this.progressEvent = progressEvent;
    }

    public ProgressStringEntity(
        final String data, 
        final OnProgressEvent progressEvent) throws UnsupportedEncodingException {
        super(data);
        this.progressEvent = progressEvent;
    }

    @Override
    public void writeTo(final OutputStream outputStream) throws IOException {
        if (outputStream == null) {
            throw new IllegalArgumentException("Output stream may not be null");
        }
        outputStreamProgress = new OutputStreamProgress(outputStream);
        final InputStream inputStream = getContent();

        try {

            final byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                outputStreamProgress.write(buffer, 0, length);
                progressEvent.publishProgress(getProgress(),
                        writtenLength, getContentLength());
            }
            outputStream.flush();
        } finally {
            inputStream.close();
        }
    }

    private int getProgress() {
        writtenLength = outputStreamProgress.getWrittenLength();
        final long contentLength = getContentLength();
        if (contentLength <= 0) { // Prevent division by zero and negative values
            return 0;
        }
        return (int) (COMPLETE_PROGRESS * writtenLength / contentLength);
    }
}
