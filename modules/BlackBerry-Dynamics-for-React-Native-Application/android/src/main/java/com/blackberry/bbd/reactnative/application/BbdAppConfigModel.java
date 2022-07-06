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
import com.good.gd.GDAndroid;
import com.good.gd.error.GDNotAuthorizedError;
import java.util.HashMap;
import java.util.Map;
import java.util.Observable;

public class BbdAppConfigModel extends Observable {
    private static final String tag = BbdAppConfigModel.class.getSimpleName();
    private static BbdAppConfigModel instance;
    private final GDAndroid gdAndroid;
    private Map<String, Object> appConfigMap;

    /**
     * The constructor sets initial values of settings or sets empty values in case of unauthorized state
     */
    private BbdAppConfigModel() {
        Log.d(tag, "+ ApplicationConfigModel()");
        gdAndroid = GDAndroid.getInstance();
        try {
            appConfigMap = gdAndroid.getApplicationConfig();
        } catch (GDNotAuthorizedError e) {
            Log.d(tag, "GDNotAuthorizedError " + e.getMessage());
            appConfigMap = new HashMap<String, Object>();
        }
    }

    /**
     * @return return single shared instance of class
     */
    public static synchronized BbdAppConfigModel getInstance() {
        if (instance == null) {
            instance = new BbdAppConfigModel();
        }
        return instance;
    }

    /**
     * The updateAppConfig method updates model with new values of application settings by the
     * BlackBerry Dynamics Runtime calls and notifies observers about changes
     */
    public void updateAppConfig() {
        Log.d(tag, "+ updateAppConfig()");
        synchronized (this) {
            try {
                appConfigMap = gdAndroid.getApplicationConfig();
            } catch (GDNotAuthorizedError e) {
                Log.d(tag, "GDNotAuthorizedError " + e.getMessage());
                // Set empty values in case of unauthorized state
                appConfigMap = new HashMap<String, Object>();
            }

        }

        setChanged();
        notifyObservers();
        Log.d(tag, "- updateAppConfig()");
    }

    /**
     * @return a collection of application settings
     */
    public synchronized Map<String, Object> getAppConfigMap() {
        return appConfigMap;
    }
}
