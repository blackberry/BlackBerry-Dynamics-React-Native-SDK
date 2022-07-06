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

import static com.blackberry.bbd.reactnative.helpers.RNBbdServiceHelper.convertJsonToMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.good.gd.GDAndroid;
import com.good.gd.GDAppServer;
import com.good.gd.error.GDNotAuthorizedError;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.List;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;

public class BbdRNApplicationModule extends ReactContextBaseJavaModule {

  static final String MODULE_NAME = "BbdRNApplication";
  private final ReactApplicationContext reactContext;

  private GDAndroid gdAndroid = GDAndroid.getInstance();

  public BbdRNApplicationModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void addListener(String eventName) {
    // DEVNOTE: keep it, as it's required for Event Emitter calls starting from 0.65 RN
    // Set up any upstream listeners or background tasks as necessary
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    // DEVNOTE: keep it, as it's required for Event Emitter calls starting from 0.65 RN
    // Remove upstream listeners, stop unnecessary background tasks
  }

  @ReactMethod
  public void getApplicationConfig(final Promise promise) {
    gdAndroid.setGDAppEventListener(new BbdAppEventListener());

    BbdAppConfigModel.getInstance().addObserver(new Observer() {
      @Override
      public void update(final Observable observable, final Object object) {
        if (observable == BbdAppConfigModel.getInstance()) {
          if (reactContext != null) {
            try {
              final WritableMap appConfig =  parseAppConfig();
              reactContext
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("onAppConfigUpdate", appConfig);
            } catch (JSONException e) {
              reactContext
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("onError", "ERROR: issue occured with serializing data.");
            }
          }
        }
      }
    });

    try {
      final WritableMap appConfig = parseAppConfig();
      promise.resolve(appConfig);
    } catch (final GDNotAuthorizedError | JSONException e) {
      promise.reject(this.getName(), e.getMessage());
    }
  }

  @ReactMethod
  public void getApplicationPolicy(final Promise promise) {
    gdAndroid.setGDAppEventListener(new BbdAppEventListener());

    BbdAppPolicyModel.getInstance().addObserver(new Observer() {
      @Override
      public void update(final Observable observable, final Object object) {
        if (observable == BbdAppPolicyModel.getInstance()) {
          if (reactContext != null) {
            try {
              final WritableMap appPolicy = parseAppPolicy();
              reactContext
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("onAppPolicyUpdate", appPolicy);
            } catch (JSONException e) {
              reactContext
                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                  .emit("onError", "ERROR: issue occured with serializing data.");
            }
          }
        }
      }
    });

    try {
      final WritableMap appPolicy = parseAppPolicy();
      promise.resolve(appPolicy);
    } catch (final GDNotAuthorizedError | JSONException e) {
      promise.reject(this.getName(), e.getMessage());
    }
  }

  private WritableMap parseAppConfig() throws JSONException {
    Map<String, Object> applicationConfig;
    applicationConfig = BbdAppConfigModel.getInstance().getAppConfigMap();

    final JSONObject result = new JSONObject();

    for (final String key : applicationConfig.keySet()) {
      Object value = applicationConfig.get(key);

      if (GDAndroid.GDAppConfigKeyServers.equals(key)) {
        value = parseGDAppServers(value);
      }

      if (GDAndroid.GDAppConfigKeyEnterpriseIdFeatures.equals(key)) {
        value = parseEnterpriseIdFeatures(value);
      }

      if (GDAndroid.GDAppConfigKeyExtraInfo.equals(key) ||
              GDAndroid.GDAppConfigKeyCommunicationProtocols.equals(key)) {
        value = new JSONObject(value.toString());
      }

      result.put(key, value);
    }
    return convertJsonToMap(result);
  }

  private WritableMap parseAppPolicy() throws JSONException {
    final Map<String, Object> appPolicy =  BbdAppPolicyModel.getInstance().getAppPolicyMap();
    return convertJsonToMap(new JSONObject(appPolicy));
  }

  private String[] parseEnterpriseIdFeatures(final Object enterpriseIdFeatures) {
    String temp = enterpriseIdFeatures.toString().substring(2);
    temp = temp.substring(0, temp.length()-2).replace("\"", "");

    return temp.split(", ");
  }

  private JSONArray parseGDAppServers(final Object serversContainer) throws JSONException {
    /*
     * NOTE: Since the GDAppConfigKeyServers returns a list of GDAppServer objects, this list
     * will be formatted to conform to the following JSON fragment:
     *    [{server:<server-name>, port:<port-number>, priority:<priority-number>}, {...} ]
     */

    final List<GDAppServer> servers = (List<GDAppServer>) serversContainer;

    final JSONArray serversValue = new JSONArray();

    for (final GDAppServer server : servers) {
      final JSONObject serverObject = new JSONObject();

      serverObject.put("server", server.server);
      serverObject.put("port", server.port);
      serverObject.put("priority", server.priority);

      serversValue.put(serverObject);
    }

    return serversValue;
  }
}