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

package com.blackberry.bbd.reactnative.core.launcher;

import android.app.Application;
import android.util.Log;

import java.util.List;

public class BBDLauncherManager {
    private static BBDLauncherInterfaceProvider s_provider;
    private static BBDLauncherManager s_manager;

    private static String TAG = BBDLauncherManager.class.getSimpleName();

    private BBDLauncherManager() {
        Log.d(TAG, "private initialization");
    }

    public static BBDLauncherManager initWithProvider(BBDLauncherInterfaceProvider provider) {
        if (s_manager == null) {
            s_manager = new BBDLauncherManager();
        }
        s_provider = provider;
        Log.d(TAG, "initWithProvider: set up LauncherManager with provider");
        return s_manager;
    }

    public static BBDLauncherManager getInstance() {
        if (s_manager == null) {
            s_manager = new BBDLauncherManager();
        }

        return s_manager;
    }

    public void setProvider(BBDLauncherInterfaceProvider provider) {
        s_provider = provider;
        Log.d(TAG, "setProvider: set up provider on instance");
    }

    public void initForApplication(Application application, List<Class> activities) {
        if (s_provider == null) {
            Log.i(TAG, "no LauncherInterface provider found");
            return;
        }

        s_provider.initLauncher(application, activities);
        Log.d(TAG, "launcher initialization with Application and Activities");
    }

    public void setAppUnauthorized() {
        if (s_provider == null) {
            return;
        }
        s_provider.setAppUnauthorized();
        Log.d(TAG, "set up launcher Unauthorized");
    }

    public void setAppAuthorized() {
        if (s_provider == null) {
            return;
        }
        s_provider.setAppAuthorized();
        Log.d(TAG, "set up launcher Authorized");
    }

    public void onUpdateConfig() {
        if (s_provider == null) {
            return;
        }
        s_provider.onUpdateConfig();
    }

    public void onUpdatePolicy() {
        if (s_provider == null) {
            return;
        }
        s_provider.onUpdatePolicy();
    }
}
