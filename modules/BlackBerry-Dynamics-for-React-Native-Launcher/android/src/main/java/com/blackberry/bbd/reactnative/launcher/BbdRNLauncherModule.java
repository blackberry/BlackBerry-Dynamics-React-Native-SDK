/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
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

import com.blackberry.bbd.reactnative.core.BBDLifeCycle;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

import com.good.launcher.HostingApp;

public class BbdRNLauncherModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private Activity activity = null;
  private static final long ACTIVITY_WAIT_INTERVAL = 100L;
  private static final int ACTIVITY_WAIT_TRIES = 20;

  public BbdRNLauncherModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  public ReactApplicationContext getReactContext() {
    return reactContext;
  }

  @Override
  public String getName() {
    return "BbdRNLauncher";
  }

  @ReactMethod
  public void getActivityName(final Promise promise) {
    // Fixed issue GD-63687- getCurrentActivity() returns null sometimes and is available little late
    waitForActivity();
    activity = getCurrentActivity();
    BbdLauncher.getInstance().setProvider(activity);
    BBDLifeCycle.getInstance().initLauncher();
  }

  @ReactMethod
  public void show(final Promise promise) {
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        try {
          HostingApp.getInstance().setVisible(true, false);
          promise.resolve(null);
        } catch (Exception e) {
          promise.reject(null, e.getMessage());
        }
      }

    });
  }

  @ReactMethod
  public void hide(final Promise promise) {
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        try {
          HostingApp.getInstance().setVisible(false, false);
          promise.resolve(null);
        } catch (Exception e) {
          promise.reject(null, e.getMessage());
        }
      }

    });
  }

  private void waitForActivity() {
    for (int tries = 0; tries < ACTIVITY_WAIT_TRIES && !isActivityReady(); tries++) {
        sleep(ACTIVITY_WAIT_INTERVAL);
    }
  }

  private boolean isActivityReady() {
    return getReactApplicationContext().hasCurrentActivity();
  }

  private static void sleep(long ms) {
    try {
        Thread.sleep(ms);
    } catch (InterruptedException e) {
    }
  }

}
