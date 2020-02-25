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

package com.blackberry.bbd.reactnative.core;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.ReactActivityDelegate;
import com.good.gd.GDAndroid;
import com.good.gd.GDStateAction;

import javax.annotation.Nullable;

public class BBDReactActivityDelegate extends ReactActivityDelegate {
    protected BBDReactActivityDelegate(BBDReactActivity activity, @Nullable String mainComponentName) {
        super(activity, mainComponentName);
    }

    @Override
    protected void loadApp(String appKey) {
        if (BBDLifeCycle.getInstance().isAuthorized()) {
            loadAppPrivate(appKey);
        } else {
            registerReceiverToLoadApp(appKey);
        }
    }

    /**
     * method is used to register BroadcastReceiver which calls origin loadApp method after
     * the application gets authorized
     */
    private void registerReceiverToLoadApp(final String appKey) {
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(GDStateAction.GD_STATE_AUTHORIZED_ACTION);

        final GDAndroid bbdRuntime = GDAndroid.getInstance();

        bbdRuntime.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                switch (intent.getAction()) {
                    case GDStateAction.GD_STATE_AUTHORIZED_ACTION:
                        loadAppPrivate(appKey);
                        // ensure to set MainActivity as current activity after  loadApp as same as method of onResume in ReactActivityDelegate.
                        onResumePrivate();
                        // unregister BroadcastReceiver to prevent View reload after application unlock
                        bbdRuntime.unregisterReceiver(this);
                        break;

                    default:
                        break;
                }

            }
        }, intentFilter);
    }

    /**
     * private wrapper of loadApp
     */
    private void loadAppPrivate(String appKey) {
        super.loadApp(appKey);
    }

    /**
     * private wrapper of onResume
     */
    private void onResumePrivate() {
        super.onResume();
    }

}
