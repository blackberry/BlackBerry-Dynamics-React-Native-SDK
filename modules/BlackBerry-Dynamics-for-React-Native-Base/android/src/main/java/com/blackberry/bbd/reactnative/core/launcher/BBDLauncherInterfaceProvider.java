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

import java.util.List;

public interface BBDLauncherInterfaceProvider {
    /**
     * Method is used to initialize Launcher with application and list of Activity classes
     * @param application Application subclass to initialize with
     * @param activities List of activities
     */
    void initLauncher(Application application, List<Class> activities);

    /**
     * Method is used to notify Launcher about the application is authorized
     */
    void setAppAuthorized();

    /**
     * Method is used to notify Launcher about the application is unauthorized
     */
    void setAppUnauthorized();

    /**
     * Method is used to notify Launcher about the config update
     */
    void onUpdateConfig();

    /**
     * Method is used to notify Launcher about the policy update
     */
    void onUpdatePolicy();
}
