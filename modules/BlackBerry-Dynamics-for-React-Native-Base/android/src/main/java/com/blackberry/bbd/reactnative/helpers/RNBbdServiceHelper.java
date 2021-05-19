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

package com.blackberry.bbd.reactnative.helpers;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.good.gd.icc.GDICCForegroundOptions;
import com.good.gd.icc.GDService;
import com.good.gd.icc.GDServiceClient;
import com.good.gd.icc.GDServiceClientListener;
import com.good.gd.icc.GDServiceError;
import com.good.gd.icc.GDServiceException;
import com.good.gd.icc.GDServiceListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * Helper class to interact with GDService and GDServiceClient.
 */
public class RNBbdServiceHelper implements GDServiceListener, GDServiceClientListener {

    private static final String TAG = RNBbdServiceHelper.class.getSimpleName();

    private static final String FILE_TRANSFER_SERVICE_NAME = "com.good.gdservice.transfer-file";
    private static final String FILE_TRANSFER_SERVICE_VERSION = "1.0.0.0";
    private static final String FILE_TRANSFER_METHOD = "transferFile";

    private static final String APP_KINETICS_APPLICATION_NAME_KEY = "applicationId";
    private static final String APP_KINETICS_SERVICE_NAME_KEY = "serviceId";
    private static final String APP_KINETICS_VERSION_KEY = "serviceVersion";
    private static final String APP_KINETICS_METHOD_KEY = "serviceMethod";
    private static final String APP_KINETICS_PARAMETERS_KEY = "parameters";
    private static final String APP_KINETICS_ATTACHMENT_KEY = "attachments";

    private static RNBbdServiceHelper instance = null;
    private Promise promise = null;
    private ReactApplicationContext reactContext = null;
    private String serviceId = null;
    private String serviceVersion = null;

    public static RNBbdServiceHelper getInstance() {
        if(instance == null) {
            instance = new RNBbdServiceHelper();
        }

        return instance;
    }

    /**
     * Constructs RNBbdServiceHelper.
     */
    public void init() {
        try {
            GDService.setServiceListener(this);
            GDServiceClient.setServiceClientListener(this);
        } catch (final GDServiceException exception) {
            throw new Error("couldn't initialize GDService");
        }

        RNBbdServiceSpoolHelper.getInstance().init();
    }

    /**
     * Sets the promise to proceed with.
     *
     * @param promise promise to proceed with.
     */
    public void setPromise(final Promise promise) {
        this.promise = promise;
    }

    /**
     * Sets ReactApplicationContext.
     *
     * @param reactContext
     */
    public void setRNContext(final ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        RNBbdServiceSpoolHelper.getInstance().setRNContext(reactContext);
    }

    /**
     * Sets serviceId to proceed with.
     *
     * @param serviceId serviceId to proceed with.
     */
    public void setServiceId(final String serviceId) {
        this.serviceId = serviceId;
        RNBbdServiceSpoolHelper.getInstance().setServiceId(serviceId);
    }

    /**
     * Sets serviceVersion to proceed with.
     *
     * @param serviceVersion serviceVersion to proceed with.
     */
    public void setServiceVersion(final String serviceVersion) {
        this.serviceVersion = serviceVersion;
        RNBbdServiceSpoolHelper.getInstance().setServiceVersion(serviceVersion);
    }

    /**
     * Bring given for address app to front.
     *
     * @param address address of app to be brought.
     * @throws GDServiceException in case of unsuccessful bringing.
     */
    public void bringToFront(final String address) throws GDServiceException {
        GDServiceClient.bringToFront(address);
    }

    /**
     * Sends files to another application.
     *
     * @param address     application address.
     * @param serviceId   application service id.
     * @param version     application service version.
     * @param method      service method.
     * @param parameters  parameters to send.
     * @param attachments attachments to message.
     * @throws GDServiceException in case of unsuccessful sending.
     */
    public void sendTo(final String address,
                       final String serviceId,
                       final String version,
                       final String method,
                       final Object parameters,
                       final String[] attachments) throws GDServiceException {
        GDServiceClient.sendTo(address,
                serviceId,
                version,
                method,
                parameters,
                attachments,
                GDICCForegroundOptions.PreferPeerInForeground);
    }

    @Override
    public void onReceivingAttachments(String s, int i, String s1) {

    }

    @Override
    public void onReceivingAttachmentFile(String s, String s1, long l, String s2) {

    }

    @Override
    public void onReceiveMessage(final String application,
                                 final String service,
                                 final String version,
                                 final String method,
                                 final Object params,
                                 final String[] attachments,
                                 final String requestID) {

        try {
            if (FILE_TRANSFER_SERVICE_NAME.equals(service) &&
                    FILE_TRANSFER_SERVICE_VERSION.equals(version) &&
                    FILE_TRANSFER_METHOD.equals(method)) {
                RNBbdServiceSpoolHelper.getInstance().proceedSimpleReceive(service, version, attachments);
                return;
            }
            if (serviceId.equals(service) && serviceVersion.equals(version)) {

                final JSONObject resultObject = new JSONObject();

                try {
                    resultObject.put(APP_KINETICS_APPLICATION_NAME_KEY, application);
                    resultObject.put(APP_KINETICS_SERVICE_NAME_KEY, service);
                    resultObject.put(APP_KINETICS_VERSION_KEY, version);
                    resultObject.put(APP_KINETICS_METHOD_KEY, method);

                    if (attachments != null) {
                        resultObject.put(APP_KINETICS_ATTACHMENT_KEY, attachments);
                    }

                    if (params != null) {
                        resultObject.put(APP_KINETICS_PARAMETERS_KEY, params);
                    }

                    if (reactContext != null) {
                        reactContext
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onReceivedMessage", convertJsonToMap(resultObject));
                    }
                } catch (final JSONException exception) {
                    // Should not get here
                }

            }
        } catch (final NullPointerException nullPointerException) {
            if (reactContext != null) {
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onError", "Please call readyToProvideService for receiving file");
            }
        } catch (final Exception exception) {
            if (reactContext != null) {
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onError", exception.getMessage());
            }
        }
    }

    @Override
    public void onReceiveMessage(final String application,
                                 final Object params,
                                 final String[] attachments,
                                 final String requestID) {

        if (params instanceof GDServiceError){
            if(promise != null) {
                promise.reject(String.valueOf(((GDServiceError) params).getErrorCode()), ((GDServiceError) params).getMessage());
                return;
            }
        }

        proceedSimpleReceive(attachments);

        try {
            GDService.replyTo(application, params,
                    GDICCForegroundOptions.NoForegroundPreference,
                    null,
                    requestID);
        } catch (final GDServiceException exception) {
            if (reactContext != null) {
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onError", exception.getMessage());
            }
        }
    }

    private void proceedSimpleReceive(final String[] attachments) {
        if (attachments == null || attachments.length < 1) {
            return;
        }

        if (reactContext != null) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onReceivedFile", attachments[0]);
        }
    }

    @Override
    public void onMessageSent(final String application,
                              final String requestID,
                              final String[] attachments) {
        if(promise != null) {
            promise.resolve("Send completed");
        }
    }

    public static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else if (value instanceof String[]) {
                map.putArray(key, convertJsonToArray(new JSONArray(value)));
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    public static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }

    public static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    public static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }
}
