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

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.good.gd.GDAndroid;

/**
 * Base Activity for React Native applications.
 */
public abstract class BBDReactActivity extends ReactActivity {

    @Override
    protected BBDReactActivityDelegate createReactActivityDelegate() {
        return new BBDReactActivityDelegate(this, getMainComponentName());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        GDAndroid.getInstance().activityInit(this);
        super.onCreate(savedInstanceState);
    }
}
