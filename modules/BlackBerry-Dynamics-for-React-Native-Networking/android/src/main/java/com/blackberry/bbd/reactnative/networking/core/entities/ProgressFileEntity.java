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

import com.good.gd.apache.http.entity.FileEntity;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Extension of {@link com.good.gd.apache.http.entity.FileEntity} that notifies about
 * upload progress.
 */
public class ProgressFileEntity extends FileEntity {

    private static final int COMPLETE_PROGRESS = 100;

    private final OnProgressEvent progressEvent;

    private File file;
    private long writtenLength;
    private OutputStreamProgress outputStreamProgress;

    public ProgressFileEntity(
        final File file, 
        final String contentType, 
        final OnProgressEvent progressEvent) {
        super(file, contentType);
        this.file = file;
        this.progressEvent = progressEvent;
    }

    @Override
    public InputStream getContent() throws IOException {
        if (this.file instanceof com.good.gd.file.File) {
            return new com.good.gd.file.FileInputStream(this.file);
        }
        return new FileInputStream(this.file);
    }

    @Override
    public void writeTo(final OutputStream outstream) throws IOException {
        if (outstream == null) {
            throw new IllegalArgumentException("Output stream may not be null");
        }
        outputStreamProgress = new OutputStreamProgress(outstream);
        InputStream inputstream = getContent();
        try {
            byte[] tmp = new byte[4096];
            int l;
            while ((l = inputstream.read(tmp)) != -1) {
                outstream.write(tmp, 0, l);
                outputStreamProgress.write(tmp, 0, l);
                progressEvent.publishProgress(getProgress(),
                        writtenLength, getContentLength());
            }
            outstream.flush();
        } finally {
            inputstream.close();
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

} // class FileEntity
