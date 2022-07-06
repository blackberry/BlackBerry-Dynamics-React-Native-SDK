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

import com.good.gd.GDAppEvent;
import com.good.gd.GDAppEventListener;
import com.good.gd.GDAppEventType;

public class BbdAppEventListener implements GDAppEventListener {

    /**
     * onGDEvent - handles events from the GD library including authorization
     * and withdrawal of authorization, policies updating.
     *
     * @see com.good.gd.GDAppEventListener#onGDEvent(com.good.gd.GDAppEvent)
     */
    public void onGDEvent(final GDAppEvent anEvent) {
        // Get event type
        final GDAppEventType eventType = anEvent.getEventType();

        // Get a shared instance of application policy model
        final BbdAppPolicyModel appSpecificPolicyModel = BbdAppPolicyModel.getInstance();
        // Get a shared instance of application settings model
        final BbdAppConfigModel appConfigModel = BbdAppConfigModel.getInstance();

        if (eventType == GDAppEventType.GDAppEventPolicyUpdate) {
            // Update application policy after receiving of an event about a change to one or more
            // application-specific policy settings
            appSpecificPolicyModel.updateAppPolicy();
        } else if (eventType == GDAppEventType.GDAppEventRemoteSettingsUpdate) {
            // Update application settings after receiving of an event about a change to one or more
            // application settings
            appConfigModel.updateAppConfig();
        }
    }
}
