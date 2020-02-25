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

import java.io.IOException;
import java.io.OutputStream;

public class OutputStreamProgress extends OutputStream {

    private final OutputStream outputStream;

    private volatile long bytesWritten = 0;

    public OutputStreamProgress(final OutputStream outputStream) {
        this.outputStream = outputStream;
    }

    @Override
    public void write(final int bytes) throws IOException {
        outputStream.write(bytes);
        bytesWritten++;
    }

    @Override
    public void write(final byte[] bytes) throws IOException {
        outputStream.write(bytes);
        bytesWritten += bytes.length;
    }

    @Override
    public void write(final byte[] bytes,final int offset,final int length) throws IOException {
        outputStream.write(bytes, offset, length);
        bytesWritten += length;
    }

    @Override
    public void flush() throws IOException {
        outputStream.flush();
    }

    @Override
    public void close() throws IOException {
        outputStream.close();
    }

    public long getWrittenLength() {
        return bytesWritten;
    }
}
