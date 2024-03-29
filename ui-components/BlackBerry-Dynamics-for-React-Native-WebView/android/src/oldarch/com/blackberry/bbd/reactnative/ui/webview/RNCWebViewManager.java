/*
 * Copyright (c) 2023 BlackBerry Limited.
 *
 * Some modifications to the original <WebView /> UI component
 * from https://github.com/react-native-community/react-native-webview/blob/v13.3.1
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.blackberry.bbd.reactnative.ui.webview;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.blackberry.bbd.reactnative.ui.webview.events.TopPermissionRequestEvent;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.views.scroll.ScrollEventType;
import com.blackberry.bbd.reactnative.ui.webview.events.TopCustomMenuSelectionEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopHttpErrorEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopLoadingErrorEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopLoadingFinishEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopLoadingProgressEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopLoadingStartEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopMessageEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopOpenWindowEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopRenderProcessGoneEvent;
import com.blackberry.bbd.reactnative.ui.webview.events.TopShouldStartLoadWithRequestEvent;

import android.graphics.Color;
import android.webkit.WebChromeClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;
import java.util.HashMap;

public class RNCWebViewManager extends SimpleViewManager<RNCWebView> {
    private final RNCWebViewManagerImpl mRNCWebViewManagerImpl;
    protected RNCWebViewClient bbWebViewClient;

    public RNCWebViewManager() {
        mRNCWebViewManagerImpl = new RNCWebViewManagerImpl();
    }

    @Override
    public String getName() {
        return RNCWebViewManagerImpl.NAME;
    }

    @Override
    public RNCWebView createViewInstance(ThemedReactContext context) {
        return mRNCWebViewManagerImpl.createViewInstance(context);
    }

    public RNCWebView createViewInstance(ThemedReactContext context, RNCWebView webView) {
      return mRNCWebViewManagerImpl.createViewInstance(context, webView);
    }

    @ReactProp(name = "allowFileAccess")
    public void setAllowFileAccess(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setAllowFileAccess(view, value);
    }

    @ReactProp(name = "allowFileAccessFromFileURLs")
    public void setAllowFileAccessFromFileURLs(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setAllowFileAccessFromFileURLs(view, value);

    }

    @ReactProp(name = "allowUniversalAccessFromFileURLs")
    public void setAllowUniversalAccessFromFileURLs(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setAllowUniversalAccessFromFileURLs(view, value);
    }

    @ReactProp(name = "allowsFullscreenVideo")
    public void setAllowsFullscreenVideo(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setAllowsFullscreenVideo(view, value);
    }

    @ReactProp(name = "allowsProtectedMedia")
    public void setAllowsProtectedMedia(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setAllowsProtectedMedia(view, value);
    }

    @ReactProp(name = "androidLayerType")
    public void setAndroidLayerType(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setAndroidLayerType(view, value);
    }

    @ReactProp(name = "applicationNameForUserAgent")
    public void setApplicationNameForUserAgent(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setApplicationNameForUserAgent(view, value);
    }

    @ReactProp(name = "basicAuthCredential")
    public void setBasicAuthCredential(RNCWebView view, @Nullable ReadableMap value) {
        mRNCWebViewManagerImpl.setBasicAuthCredential(view, value);
    }

    @ReactProp(name = "cacheEnabled")
    public void setCacheEnabled(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setCacheEnabled(view, value);
    }

    @ReactProp(name = "cacheMode")
    public void setCacheMode(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setCacheMode(view, value);
    }

    @ReactProp(name = "domStorageEnabled")
    public void setDomStorageEnabled(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setDomStorageEnabled(view, value);
    }

    @ReactProp(name = "downloadingMessage")
    public void setDownloadingMessage(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setDownloadingMessage(value);
    }

    @ReactProp(name = "forceDarkOn")
    public void setForceDarkOn(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setForceDarkOn(view, value);
    }

    @ReactProp(name = "geolocationEnabled")
    public void setGeolocationEnabled(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setGeolocationEnabled(view, value);
    }

    @ReactProp(name = "hasOnScroll")
    public void setHasOnScroll(RNCWebView view, boolean hasScrollEvent) {
        mRNCWebViewManagerImpl.setHasOnScroll(view, hasScrollEvent);
    }

    @ReactProp(name = "incognito")
    public void setIncognito(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setIncognito(view, value);
    }

    @ReactProp(name = "injectedJavaScript")
    public void setInjectedJavaScript(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setInjectedJavaScript(view, value);
    }

    @ReactProp(name = "injectedJavaScriptBeforeContentLoaded")
    public void setInjectedJavaScriptBeforeContentLoaded(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setInjectedJavaScriptBeforeContentLoaded(view, value);
    }

    @ReactProp(name = "injectedJavaScriptForMainFrameOnly")
    public void setInjectedJavaScriptForMainFrameOnly(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setInjectedJavaScriptForMainFrameOnly(view, value);

    }

    @ReactProp(name = "injectedJavaScriptBeforeContentLoadedForMainFrameOnly")
    public void setInjectedJavaScriptBeforeContentLoadedForMainFrameOnly(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setInjectedJavaScriptBeforeContentLoadedForMainFrameOnly(view, value);

    }

    @ReactProp(name = "javaScriptCanOpenWindowsAutomatically")
    public void setJavaScriptCanOpenWindowsAutomatically(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setJavaScriptCanOpenWindowsAutomatically(view, value);
    }

    @ReactProp(name = "javaScriptEnabled")
    public void setJavaScriptEnabled(RNCWebView view, boolean enabled) {
        mRNCWebViewManagerImpl.setJavaScriptEnabled(view, enabled);
    }

    @ReactProp(name = "lackPermissionToDownloadMessage")
    public void setLackPermissionToDownloadMessage(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setLackPermissionToDownloadMessage(value);
    }

    @ReactProp(name = "hasOnOpenWindowEvent")
    public void setHasOnOpenWindowEvent(RNCWebView view, boolean hasEvent) {
        mRNCWebViewManagerImpl.setHasOnOpenWindowEvent(view, hasEvent);
    }

    @ReactProp(name = "mediaPlaybackRequiresUserAction")
    public void setMediaPlaybackRequiresUserAction(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setMediaPlaybackRequiresUserAction(view, value);
    }

    @ReactProp(name = "messagingEnabled")
    public void setMessagingEnabled(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setMessagingEnabled(view, value);
    }

    @ReactProp(name = "menuItems")
    public void setMenuCustomItems(RNCWebView view, @Nullable ReadableArray items) {
        mRNCWebViewManagerImpl.setMenuCustomItems(view, items);
    }

    @ReactProp(name = "messagingModuleName")
    public void setMessagingModuleName(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setMessagingModuleName(view, value);
    }

    @ReactProp(name = "minimumFontSize")
    public void setMinimumFontSize(RNCWebView view, int value) {
        mRNCWebViewManagerImpl.setMinimumFontSize(view, value);
    }

    @ReactProp(name = "mixedContentMode")
    public void setMixedContentMode(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setMixedContentMode(view, value);
    }

    @ReactProp(name = "nestedScrollEnabled")
    public void setNestedScrollEnabled(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setNestedScrollEnabled(view, value);
    }

    @ReactProp(name = "overScrollMode")
    public void setOverScrollMode(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setOverScrollMode(view, value);
    }

    @ReactProp(name = "saveFormDataDisabled")
    public void setSaveFormDataDisabled(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setSaveFormDataDisabled(view, value);
    }

    @ReactProp(name = "scalesPageToFit")
    public void setScalesPageToFit(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setScalesPageToFit(view, value);
    }

    @ReactProp(name = "setBuiltInZoomControls")
    public void setSetBuiltInZoomControls(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setSetBuiltInZoomControls(view, value);
    }

    @ReactProp(name = "setDisplayZoomControls")
    public void setSetDisplayZoomControls(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setSetDisplayZoomControls(view, value);
    }

    @ReactProp(name = "setSupportMultipleWindows")
    public void setSetSupportMultipleWindows(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setSetSupportMultipleWindows(view, value);
    }

    @ReactProp(name = "showsHorizontalScrollIndicator")
    public void setShowsHorizontalScrollIndicator(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setShowsHorizontalScrollIndicator(view, value);
    }

    @ReactProp(name = "showsVerticalScrollIndicator")
    public void setShowsVerticalScrollIndicator(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setShowsVerticalScrollIndicator(view, value);
    }

    @ReactProp(name = "source")
    public void setSource(RNCWebView view, @Nullable ReadableMap value) {
        mRNCWebViewManagerImpl.setSource(view, value, false);
    }

    @ReactProp(name = "textZoom")
    public void setTextZoom(RNCWebView view, int value) {
        mRNCWebViewManagerImpl.setTextZoom(view, value);
    }

    @ReactProp(name = "thirdPartyCookiesEnabled")
    public void setThirdPartyCookiesEnabled(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setThirdPartyCookiesEnabled(view, value);
    }

    @ReactProp(name = "webviewDebuggingEnabled")
    public void setWebviewDebuggingEnabled(RNCWebView view, boolean value) {
        mRNCWebViewManagerImpl.setWebviewDebuggingEnabled(view, value);
    }

    @ReactProp(name = "userAgent")
    public void setUserAgent(RNCWebView view, @Nullable String value) {
        mRNCWebViewManagerImpl.setUserAgent(view, value);
    }

    @Override
    protected void addEventEmitters(@NonNull ThemedReactContext reactContext, RNCWebView view) {
        // Do not register default touch emitter and let WebView implementation handle touches
        bbWebViewClient = new RNCWebViewClient();
        bbWebViewClient.initializeClient(reactContext.getApplicationContext());
        view.setWebViewClient(bbWebViewClient);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        Map<String, Object> export = super.getExportedCustomDirectEventTypeConstants();
        if (export == null) {
            export = MapBuilder.newHashMap();
        }
        // Default events but adding them here explicitly for clarity
        export.put(TopLoadingStartEvent.EVENT_NAME, MapBuilder.of("registrationName", "onLoadingStart"));
        export.put(TopLoadingFinishEvent.EVENT_NAME, MapBuilder.of("registrationName", "onLoadingFinish"));
        export.put(TopLoadingErrorEvent.EVENT_NAME, MapBuilder.of("registrationName", "onLoadingError"));
        export.put(TopMessageEvent.EVENT_NAME, MapBuilder.of("registrationName", "onMessage"));
        // !Default events but adding them here explicitly for clarity

        export.put(TopLoadingProgressEvent.EVENT_NAME, MapBuilder.of("registrationName", "onLoadingProgress"));
        export.put(TopShouldStartLoadWithRequestEvent.EVENT_NAME, MapBuilder.of("registrationName", "onShouldStartLoadWithRequest"));
        export.put(ScrollEventType.getJSEventName(ScrollEventType.SCROLL), MapBuilder.of("registrationName", "onScroll"));
        export.put(TopHttpErrorEvent.EVENT_NAME, MapBuilder.of("registrationName", "onHttpError"));
        export.put(TopPermissionRequestEvent.EVENT_NAME, MapBuilder.of("registrationName", "onPermissionRequest"));
        export.put(TopRenderProcessGoneEvent.EVENT_NAME, MapBuilder.of("registrationName", "onRenderProcessGone"));
        export.put(TopCustomMenuSelectionEvent.EVENT_NAME, MapBuilder.of("registrationName", "onCustomMenuSelection"));
        export.put(TopOpenWindowEvent.EVENT_NAME, MapBuilder.of("registrationName", "onOpenWindow"));
        return export;
    }

    @Override
    public @Nullable
    Map<String, Integer> getCommandsMap() {
        return mRNCWebViewManagerImpl.getCommandsMap();
    }

    @Override
    public void receiveCommand(@NonNull RNCWebView reactWebView, String commandId, @Nullable ReadableArray args) {
        mRNCWebViewManagerImpl.receiveCommand(reactWebView, commandId, args);
        super.receiveCommand(reactWebView, commandId, args);
    }

    @Override
    public void onDropViewInstance(@NonNull RNCWebView view) {
        mRNCWebViewManagerImpl.onDropViewInstance(view);
        super.onDropViewInstance(view);
    }
}