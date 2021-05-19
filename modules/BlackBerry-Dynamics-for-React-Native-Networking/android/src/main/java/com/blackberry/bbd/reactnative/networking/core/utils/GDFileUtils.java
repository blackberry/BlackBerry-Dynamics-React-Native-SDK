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

package com.blackberry.bbd.reactnative.networking.core.utils;

import android.content.ContentUris;
import android.database.Cursor;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.util.Log;
import android.webkit.MimeTypeMap;

import com.facebook.react.bridge.ReactApplicationContext;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;


public class GDFileUtils {
    private static final String LOG_TAG = "FileUtils";

    /**
     * Returns the real path of the given URI string.
     * If the given URI string represents a content:// URI, the real path is retrieved from the media store.
     *
     * @param uriString the URI string of the audio/image/video
     * @param reactContext the current application context
     * @return the full path to the file
     */
    @SuppressWarnings("deprecation")
    public static String getRealPath(String uriString, ReactApplicationContext reactContext) {
        String realPath = null;

        Uri uri = Uri.parse(uriString);
        if (DocumentsContract.isDocumentUri(reactContext, uri)) {
            // Whether the Uri authority is ExternalStorageProvider
            if ("com.android.externalstorage.documents".equals(uri.getAuthority())) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];

                if ("primary".equalsIgnoreCase(type)) {
                    // Environment.getExternalStorageDirectory() is deprecated in API level 29
                    return reactContext.getExternalFilesDir(null).getAbsolutePath() + "/" + split[1];
                }

                // TODO handle non-primary volumes

            }
            // Whether the Uri authority is DownloadsProvider
            else if ("com.android.providers.downloads.documents".equals(uri.getAuthority())) {
                final String id = DocumentsContract.getDocumentId(uri);

                String contentUriPrefixesToTry[] = new String[] {
                    "content://downloads/public_downloads",
                    "content://downloads/my_downloads",
                    // "content://downloads/all_downloads" need android.permission.ACCESS_ALL_DOWNLOADS
                    // protectionLevel is "signature" and general app cannot access
                    "content://downloads/all_downloads"
                };

                for (String contentUriPrefix : contentUriPrefixesToTry) {
                    try {
                        final Uri contentUri = ContentUris.withAppendedId(
                            Uri.parse(contentUriPrefix), Long.valueOf(id));

                        String path = getDataColumn(reactContext, contentUri, null, null);
                        if (path != null) {
                            return path;
                        }
                    } catch (NumberFormatException e) {
                        // if id start with 'msf:', cannot get real path
                        return null;
                    }
                    catch (Exception e) {}
                }
                return null;
            }
            // Whether the Uri authority is MediaProvider
            else if ("com.android.providers.media.documents".equals(uri.getAuthority())) {
                final String docId = DocumentsContract.getDocumentId(uri);
                final String[] split = docId.split(":");
                final String type = split[0];

                Uri contentUri = null;
                if ("image".equals(type)) {
                    contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if ("video".equals(type)) {
                    contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if ("audio".equals(type)) {
                    contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }

                final String selection = "_id=?";
                final String[] selectionArgs = new String[] {
                        split[1]
                };

                return getDataColumn(reactContext, contentUri, selection, selectionArgs);
            }
            Log.e(LOG_TAG, "Could get real path for URI string" + uriString, null);
        }
        // MediaStore (and general)
        else if (uriString.startsWith("content://")) {
            realPath = getDataColumn(reactContext, uri, null, null);
            if (realPath == null) {
                Log.e(LOG_TAG, "Could get real path for URI string" + uriString, null);
            }
        // File
        } else if (uriString.startsWith("file://")) {
            realPath = uriString.substring(7);
            if (realPath.startsWith("/android_asset/")) {
                Log.e(LOG_TAG, "Cannot get real path for URI string " + uriString + " because it is a file:///android_asset/ URI.", null);
                realPath = null;
            }
        } else {
            realPath = uriString;
        }

        return realPath;
    }

    /**
     * Returns the real path of the given URI.
     * If the given URI is a content:// URI, the real path is retrieved from the media store.
     *
     * @param uri the URI of the audio/image/video
     * @param reactContext the current application context
     * @return the full path to the file
     */
    public static String getRealPath(Uri uri, ReactApplicationContext reactContext) {
        return GDFileUtils.getRealPath(uri.toString(), reactContext);
    }

    /**
     * Get the value of the data column for this Uri. This is useful for
     * MediaStore Uris, and other file-based ContentProviders.
     *
     * @param reactContext The context.
     * @param uri The Uri to query.
     * @param selection (Optional) Filter used in the query.
     * @param selectionArgs (Optional) Selection arguments used in the query.
     * @return The value of the _data column, which is typically a file path.
     */
    public static String getDataColumn(ReactApplicationContext reactContext, Uri uri, String selection,
                                       String[] selectionArgs) {

        Cursor cursor = null;
        final String column = "_data";
        final String[] projection = {
                column
        };

        try {
            cursor = reactContext.getContentResolver().query(uri, projection, selection, selectionArgs,
                    null);
            if (cursor != null && cursor.moveToFirst()) {
                final int column_index = cursor.getColumnIndexOrThrow(column);
                return cursor.getString(column_index);
            }
        } catch (Exception e) {
            Log.e(LOG_TAG, "Cannot get value of the data column for uri: " + uri.toString(), e);
        } finally {
            if (cursor != null)
                cursor.close();
        }
        return null;
    }

    /**
     * Returns an input stream based on given URI string.
     *
     * @param uriString the URI string from which to obtain the input stream
     * @param reactContext the current application context
     * @return an input stream into the data at the given URI or null if given an invalid URI string
     * @throws IOException
     */
    public static InputStream getInputStreamFromUriString(String uriString, ReactApplicationContext reactContext) throws IOException {
        if (uriString.startsWith("content")) {
            Uri uri = Uri.parse(uriString);
            return reactContext.getContentResolver().openInputStream(uri);
        } else if (uriString.startsWith("file://")) {
            int question = uriString.indexOf("?");
            if (question > -1) {
                uriString = uriString.substring(0,question);
            }
            if (uriString.startsWith("file:///android_asset/")) {
                Uri uri = Uri.parse(uriString);
                String relativePath = uri.getPath().substring(15);
                return reactContext.getAssets().open(relativePath);
            } else {
                return new FileInputStream(getRealPath(uriString, reactContext));
            }
        } else {
            return new FileInputStream(getRealPath(uriString, reactContext));
        }
    }

    /**
     * Removes the "file://" prefix from the given URI string, if applicable.
     * If the given URI string doesn't have a "file://" prefix, it is returned unchanged.
     *
     * @param uriString the URI string to operate on
     * @return a path without the "file://" prefix
     */
    public static String stripFileProtocol(String uriString) {
        if (uriString.startsWith("file://")) {
            uriString = uriString.substring(7);
        }
        return uriString;
    }

    public static String getMimeTypeForExtension(String path) {
        String extension = path;
        int lastDot = extension.lastIndexOf('.');
        if (lastDot != -1) {
            extension = extension.substring(lastDot + 1);
        }
        // Convert the URI string to lower case to ensure compatibility with MimeTypeMap (see CB-2185).
        extension = extension.toLowerCase(Locale.getDefault());
        if (extension.equals("3ga")) {
            return "audio/3gpp";
        }
        return MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
    }

    /**
     * Returns the mime type of the data specified by the given URI string.
     *
     * @param uriString the URI string of the data
     * @param reactContext the current application context
     * @return the mime type of the specified data
     */
    public static String getMimeType(String uriString, ReactApplicationContext reactContext) {
        String mimeType = null;

        Uri uri = Uri.parse(uriString);
        if (uriString.startsWith("content://")) {
            mimeType = reactContext.getContentResolver().getType(uri);
        } else {
            mimeType = getMimeTypeForExtension(uri.getPath());
        }

        return mimeType;
    }
}
