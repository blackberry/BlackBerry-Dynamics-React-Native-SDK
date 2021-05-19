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

package com.blackberry.bbd.reactnative.launcher;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.util.Log;

import com.blackberry.bbd.reactnative.core.BBDLifeCycle;
import com.blackberry.bbd.reactnative.core.launcher.BBDLauncherInterfaceProvider;
import com.good.launcher.GDStateNotifier;
import com.good.launcher.HostingApp;
import com.good.launcher.LauncherButton;

import java.util.List;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class BbdLauncher implements BBDLauncherInterfaceProvider {

    private static BbdLauncher s_launcher;
    private static Activity rn_activity;
    private Boolean isInitialized = false;

    private static String TAG = BbdLauncher.class.getSimpleName();

    private BbdLauncher() {
        Log.d(TAG, "private initialization");
    }

    static BbdLauncher getInstance() {
        if (s_launcher == null) {
            s_launcher = new BbdLauncher();
        }

        return s_launcher;
    }

    void setProvider(Activity currentActivity) {
        rn_activity = currentActivity;
        BBDLifeCycle.setLauncherProvider(s_launcher);
        Log.d(TAG, "set up provider");
    }

    @Override
    public void initLauncher(final Application application, final List<Class> activities) {
        if (isInitialized) {
            return;
        }
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                LauncherButton.initForApplication(application, activities, LauncherButton.ActivitiesTargetingMethod.Inclusive);

                setAppAuthorized();
                HostingApp.getInstance().setOnCommandCallback(new LauncherCommandCallbacksImpl());
                Log.d(TAG, "launcher interface initialization");

                Intent intent = rn_activity.getIntent();
                application.startActivity(intent);
                Log.d(TAG, "restart app activity and resume LauncherButton");
                isInitialized = true;
            }
        });
    }

    @Override
    public void setAppAuthorized() {
        setAuthorized(true);
        Log.d(TAG, "set up launcher Authorized");
    }

    @Override
    public void setAppUnauthorized() {
        setAuthorized(false);
        Log.d(TAG, "set up launcher Unauthorized");
    }

    @Override
    public void onUpdateConfig() {
        GDStateNotifier.onUpdateConfig();
        Log.d(TAG, "onUpdateConfig()");
    }

    @Override
    public void onUpdatePolicy() {
        GDStateNotifier.onUpdatePolicy();
        Log.d(TAG, "onUpdatePolicy()");
    }

    private void setAuthorized(boolean isAuthorized) {
        HostingApp.getInstance().setAuthorized(isAuthorized);
    }

    static class LauncherCommandCallbacksImpl implements HostingApp.LauncherCommandCallback {

        private void handleAppSettingsScreen() {
            // Here you can invoke your app settings screen.

            Log.d(TAG, "Settings button was tapped");
            Log.d(TAG, "BlackBerry Dynamics Launcher library version: " + HostingApp.getInstance().getVersion());
        }

        @Override
        public void onSettingsCommand() {
            handleAppSettingsScreen();
        }
    }
}

