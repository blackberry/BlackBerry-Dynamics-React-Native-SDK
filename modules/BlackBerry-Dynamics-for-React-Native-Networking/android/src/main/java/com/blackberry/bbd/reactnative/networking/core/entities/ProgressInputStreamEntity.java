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

import com.good.gd.apache.http.entity.InputStreamEntity;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Extension of {@link com.good.gd.apache.http.entity.InputStreamEntity} that notifies about
 * upload progress.
 */

public class ProgressInputStreamEntity extends InputStreamEntity {

    private static final int COMPLETE_PROGRESS = 100;

    private final OnProgressEvent progressEvent;

    private long writtenLength;
    private OutputStreamProgress outputStreamProgress;

    public ProgressInputStreamEntity(
        final InputStream instream, 
        final OnProgressEvent progressEvent) {

        super(instream, -1);
        this.progressEvent = progressEvent;
    }

    public ProgressInputStreamEntity(
        final InputStream instream, 
        long length, 
        final OnProgressEvent progressEvent) {

        super(instream, length);
        this.progressEvent = progressEvent;
    }

    @Override
    public void writeTo(
        final OutputStream outputStream) 
        throws IOException {

        if (outputStream == null) {
            throw new IllegalArgumentException("Output stream may not be null");
        }
        outputStreamProgress = new OutputStreamProgress(outputStream);
        final InputStream inputStream = getContent();

        try {

            final byte[] buffer = new byte[1024];
            int l;
            if (getContentLength() < 0) {
                // consume until EOF
                while ((l = inputStream.read(buffer)) != -1) {
                    outputStreamProgress.write(buffer, 0, l);
                    progressEvent.publishProgress(getProgress(),
                        writtenLength, getContentLength());
                }
            }
            else {
                // consume no more than length
                long remaining = getContentLength();
                while (remaining > 0) {
                    l = inputStream.read(buffer, 0, (int)Math.min(1024, remaining));
                    if (l == -1) {
                        break;
                    }
                    outputStreamProgress.write(buffer, 0, l);
                    progressEvent.publishProgress(getProgress(),
                        writtenLength, getContentLength());
                    remaining -= l;
                }
               
            }
            outputStream.flush();

        } finally {
            consumeContent();
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
    
} // class InputStreamEntity
