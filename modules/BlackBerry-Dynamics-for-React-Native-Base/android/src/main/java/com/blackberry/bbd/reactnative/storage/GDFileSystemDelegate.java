/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

package com.blackberry.bbd.reactnative.storage;

import com.good.gd.file.FileInputStream;
import com.good.gd.file.FileOutputStream;
import com.good.gd.file.GDFileSystem;

import java.io.File;
import java.io.FileNotFoundException;

/**
 * Delegate class which wraps GDFileSystem.
 */
public class GDFileSystemDelegate {

    /**
     * Open a file in the secure store, for writing, from a <TT>String</TT>
     * containing the path.
     * Call this method to open a file in the secure store, for writing.
     * If a file already exists at the specified path, the file can either be
     * appended to, or overwritten.
     *
     * @param path String containing the path of the file to open,
     *             in the secure file system.
     * @param mode Selects the action to take if a file already exists at the
     *             specified path in the secure file system: MODE_APPEND to append, or
     *             just MODE_PRIVATE to truncate.
     * @return FileOutputStream for the open file.
     * @throws java.io.FileNotFoundException
     */
    public FileOutputStream openFileOutput(final String path, final int mode)
            throws FileNotFoundException {
        return GDFileSystem.openFileOutput(path, mode);
    }

    /**
     * Open a file in the secure store, for reading, from a String
     * containing the path.
     * Call this method to open a file in the secure store, for reading.
     *
     * @param path containing the path of the file to open,
     *             in the secure file system.
     * @return FileInputStream for the open file.
     * @throws FileNotFoundException
     */
    public FileInputStream openFileInput(final String path)
            throws java.io.FileNotFoundException {
        return GDFileSystem.openFileInput(path);
    }

    /**
     * This function returns the encrypted path for a file or directory within the secure file
     * system.
     * The principal usage for this function is to provide a path that is compatible
     * with the SQL ATTACH command.
     *
     * @param path String containing the path within the secure store
     * @return String containing the absolute path of the encrypted file on the filesystem
     */
    public String getAbsoluteEncryptedPath(final String path) {
        return GDFileSystem.getAbsoluteEncryptedPath(path);
    }

    /**
     * Creates secure file for given path.
     *
     * @param path path to create file in.
     * @return newly created file.
     */
    public File createFile(final String path) {
        return new com.good.gd.file.File(path);
    }

    /**
     * Creates a BlackBerry Dynamics RandomAccessFile object
     *
     * @param fileName file name to access
     * @param mode     access mode
     * @return BlackBerry Dynamics RandomAccessFile object
     * @throws FileNotFoundException, for detailed description look at
     *                                documentation for java.io.RandomAccessFile class
     */
    public com.good.gd.file.RandomAccessFile getRandomAccessFile(String fileName, String mode)
            throws FileNotFoundException {
        return new com.good.gd.file.RandomAccessFile(fileName, mode);
    }
}
