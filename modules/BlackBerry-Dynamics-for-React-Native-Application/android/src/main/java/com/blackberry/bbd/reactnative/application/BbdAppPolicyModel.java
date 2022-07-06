/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
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

package com.blackberry.bbd.reactnative.application;

import android.util.Log;
import java.util.HashMap;
import java.util.Map;
import java.util.Observable;
import com.good.gd.GDAndroid;
import com.good.gd.error.GDNotAuthorizedError;

public class BbdAppPolicyModel extends Observable {
    private static final String tag = BbdAppPolicyModel.class.getSimpleName();
    private static BbdAppPolicyModel instance;
    private final GDAndroid gdAndroid;
    private Map<String, Object> appPolicyMap;

    /**
     * The constructor sets initial values of policies or sets empty values in case of unauthorized state
     */
    private BbdAppPolicyModel() {
        Log.d(tag, "+ ApplicationPolicyModel()");
        gdAndroid = GDAndroid.getInstance();
        try {
            appPolicyMap = gdAndroid.getApplicationPolicy();
        } catch (GDNotAuthorizedError e) {
            Log.d(tag, "GDNotAuthorizedError " + e.getMessage());
            appPolicyMap = new HashMap<String, Object>();
        }
    }

    /**
     * @return return single shared instance of class
     */
    public static synchronized BbdAppPolicyModel getInstance() {
        if (instance == null) {
            instance = new BbdAppPolicyModel();
        }
        return instance;
    }

    /**
     * The updatePolicy method updates model with new values of application policy by the
     * BlackBerry Dynamics Runtime calls and notifies observers about changes
     */
    public void updateAppPolicy() {
        Log.d(tag, "+ updateAppPolicy()");
        synchronized (this) {
            try {
                appPolicyMap = gdAndroid.getApplicationPolicy();
            } catch (GDNotAuthorizedError e) {
                Log.d(tag, "GDNotAuthorizedError " + e.getMessage());
                // Set empty values in case of unauthorized state
                appPolicyMap = new HashMap<String, Object>();
            }

        }

        setChanged();
        notifyObservers();
        Log.d(tag, "- updateAppPolicy()");
    }

    /**
     * @return a collection of application-specific policy settings
     */
    public synchronized Map<String, Object> getAppPolicyMap() {
        return appPolicyMap;
    }
}
