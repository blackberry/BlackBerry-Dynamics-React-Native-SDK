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

package com.blackberry.bbd.reactnative.helpers;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.good.gd.GDAndroid;
import com.good.gd.GDStateListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;

public class RNBbdServiceSpoolHelper implements GDStateListener {
    private static final String TAG = RNBbdServiceSpoolHelper.class.getSimpleName();

    private static RNBbdServiceSpoolHelper instance = null;
    private ReactApplicationContext reactContext = null;
    private String serviceId = null;
    private String serviceVersion = null;

    private volatile boolean authorized = false;

    // files that will be notified after App is prepared
    ArrayList<ReceivedOneFile> spoolingFilesToNotify = new ArrayList<ReceivedOneFile>();

    // used for locking of spoolingFilesToNotify
    Object spoolingFilesToNotifyLock = new Object();

    public static RNBbdServiceSpoolHelper getInstance() {
        if (instance == null) {
            synchronized (RNBbdServiceSpoolHelper.class) {
                instance = new RNBbdServiceSpoolHelper();
            }
        }
        return instance;
    }

    /**
     * Constructs RNBbdServiceSpoolHelper.
     */
    public void init() {
        GDAndroid.getInstance().setGDStateListener(instance);
    }

    /**
     * Sets ReactApplicationContext.
     *
     * @param reactContext
     */
    public void setRNContext(final ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        checkForFlushSpool();
    }

    /**
     * Sets serviceId to proceed with.
     *
     * @param serviceId serviceId to proceed with.
     */
    public void setServiceId(final String serviceId) {
        this.serviceId = serviceId;
        checkForFlushSpool();
    }

    /**
     * Sets serviceVersion to proceed with.
     *
     * @param serviceVersion serviceVersion to proceed with.
     */
    public void setServiceVersion(final String serviceVersion) {
        this.serviceVersion = serviceVersion;
        checkForFlushSpool();
    }

    // Add files to the collection of files that will be notified after App is prepared
    public boolean proceedSimpleReceive(String service, String version, final String[] files) {
        synchronized (spoolingFilesToNotifyLock) {
            for (String oneFile: files) {
                spoolingFilesToNotify.add(new ReceivedOneFile(service, version, oneFile));
            }
        }

        checkForFlushSpool();

        return true;
    }

    private void checkForFlushSpool() {
        try {
            if (this.authorized && reactContext != null && serviceId != null && serviceVersion != null) {
                ArrayList<ReceivedOneFile> filesToNotify;
                synchronized (spoolingFilesToNotifyLock) {
                    filesToNotify = new ArrayList<ReceivedOneFile>(spoolingFilesToNotify);
                    spoolingFilesToNotify.clear();
                }
                for (ReceivedOneFile oneFile: filesToNotify) {
                    String file = oneFile.getFile();
                    if (file != null) {
                        reactContext
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onReceivedFile", file);
                    }
                }
            }
        } catch (final Exception exception) {
            if (reactContext != null) {
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onError", exception.getMessage());
            }
        }
    }

    // GDStateListener Methods ------------------------------------------------
    @Override
    public void onAuthorized() {
        authorized = true;
        checkForFlushSpool();
    }

    @Override
    public void onLocked() {
        authorized = false;
        Log.d(TAG, "RNBbdServiceSpoolHelper.onLocked()");
    }

    @Override
    public void onWiped() {
        this.authorized = false;
    }

    @Override
    public void onUpdateConfig(Map<String, Object> settings) {
        Log.d(TAG, "RNBbdServiceSpoolHelper.onUpdateConfig()");
    }

    @Override
    public void onUpdatePolicy(Map<String, Object> policyValues) {
        Log.d(TAG, "RNBbdServiceSpoolHelper.onUpdatePolicy()");
    }

    @Override
    public void onUpdateServices() {
        Log.d(TAG, "RNBbdServiceSpoolHelper.onUpdateServices()");
    }

    @Override
    public void onUpdateEntitlements() {
        Log.d(TAG, "RNBbdServiceSpoolHelper.onUpdateEntitlements()");
    }

    boolean isAuthorized() {
        return authorized;
    }

    private class ReceivedOneFile {
        String service;
        String version;
        String file;

        ReceivedOneFile(String service, String version, String file) {
            this.service = service;
            this.version = version;
            this.file = file;
        }

        String getFile() {
            if (serviceId.equals(service) && serviceVersion.equals(version)) {
                return(file);
            }
            return(null);
        }
    }
}
