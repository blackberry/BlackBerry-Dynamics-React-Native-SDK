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

package com.blackberry.bbd.reactnative.networking.core.content;

import com.blackberry.bbd.reactnative.networking.core.entities.OnProgressEvent;
import com.blackberry.bbd.reactnative.networking.core.entities.OutputStreamProgress;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.blackberry.bbd.apache.core.util.Args;
import com.blackberry.bbd.apache.core.http.ContentType;

/**
 * Delegate FileBody class, to override writeTo method.
 */
public class FileBody extends com.blackberry.bbd.apache.http.entity.mime.content.FileBody {

    private static final int COMPLETE_PROGRESS = 100;

    private long contentLength;
    private final OnProgressEvent progressEvent;

    private long writtenLength;
    private OutputStreamProgress outputStreamProgress;

    public FileBody(final File file, OnProgressEvent progressEvent) {
        super(file);
        this.progressEvent = progressEvent;
        this.contentLength = file.length();
    }

    public FileBody(final File file, final ContentType contentType, final String filename, OnProgressEvent progressEvent) {
        super(file, contentType, filename);
        this.progressEvent = progressEvent;
        this.contentLength = file.length();
    }

    public FileBody(final File file, final ContentType contentType, OnProgressEvent progressEvent) {
        super(file, contentType);
        this.progressEvent = progressEvent;
        this.contentLength = file.length();
    }


    @Override
    public void writeTo(final OutputStream out) throws IOException {
        Args.notNull(out, "Output stream");

        outputStreamProgress = new OutputStreamProgress(out);
        InputStream in = null;

        try {
            if (getFile() instanceof com.good.gd.file.File) {
                in = new com.good.gd.file.FileInputStream(getFile());
            }
            else {
                in = new FileInputStream(getFile());
            }

            final byte[] tmp = new byte[4096];
            int l;

            while ((l = in.read(tmp)) != -1) {
                outputStreamProgress.write(tmp, 0, l);
                progressEvent.publishProgress(getProgress(),
                    writtenLength, getContentLength());
            }
            outputStreamProgress.flush();
        } finally {
            in.close();
        }
    }

    @Override
    public long getContentLength() {
        return this.contentLength;
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
