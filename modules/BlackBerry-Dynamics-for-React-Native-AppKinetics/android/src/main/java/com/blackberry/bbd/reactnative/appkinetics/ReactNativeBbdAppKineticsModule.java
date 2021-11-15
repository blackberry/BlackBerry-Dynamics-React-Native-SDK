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

package com.blackberry.bbd.reactnative.appkinetics;

import android.content.res.AssetManager;

import com.blackberry.bbd.reactnative.helpers.RNBbdServiceHelper;
import com.blackberry.bbd.reactnative.storage.GDFileSystemDelegate;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.good.gd.GDAndroid;
import com.good.gd.GDServiceProvider;
import com.good.gd.GDServiceType;
import com.good.gd.file.GDFileSystem;
import com.good.gd.icc.GDServiceException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;

public class ReactNativeBbdAppKineticsModule extends ReactContextBaseJavaModule {

  private GDFileSystemDelegate gdFileSystemDelegate = new GDFileSystemDelegate();
  private GDAndroid gdAndroid = GDAndroid.getInstance();
  private RNBbdServiceHelper serviceHelper = RNBbdServiceHelper.getInstance();

  private static final String ASSETS_DATA_FOLDER_PATH = "data";
  private static final String BBD_DATA_FOLDER_PATH = "data";
  private WritableArray entriesInSecureStorageDataDir = new WritableNativeArray();
  private WritableArray entriesCopiedFromAssetsData = new WritableNativeArray();

  public ReactNativeBbdAppKineticsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    serviceHelper.setRNContext(reactContext);
  }

  @Override
  public String getName() {
    return "ReactNativeBbdAppKinetics";
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
  private void bringAppToFront(final ReadableMap arguments,
                               final Promise promise) {
    final String applicationId = arguments.getString("applicationId");

    try {
      serviceHelper.bringToFront(applicationId);
      promise.resolve(applicationId + " was successfully brought to front");
    } catch (final GDServiceException e) {
      promise.reject(this.getName(), e.getMessage());
    }
  }

  @ReactMethod
  public void getServiceProvidersFor(final ReadableMap arguments, final Promise promise) {
    final String serviceId = arguments.getString("serviceId");
    final String version = arguments.getString("version");

    try {
      List<GDServiceProvider> serviceProviders =
              gdAndroid.getServiceProvidersFor(serviceId, version, GDServiceType.GD_SERVICE_TYPE_APPLICATION);

      final WritableArray serviceProvidersArray = new WritableNativeArray();

      for(final GDServiceProvider serviceProvider : serviceProviders) {
        final WritableMap serviceProviderMap = new WritableNativeMap();

        serviceProviderMap.putString("applicationId", serviceProvider.getIdentifier());
        serviceProviderMap.putString("name", serviceProvider.getName());
        serviceProviderMap.putString("address", serviceProvider.getAddress());
        serviceProviderMap.putString("version", serviceProvider.getVersion());

        serviceProvidersArray.pushMap(serviceProviderMap);
      }

      promise.resolve(serviceProvidersArray);
    } catch (Exception e) {
      promise.reject(this.getName(), e.getMessage());
    }
  }

  @ReactMethod
  public void copyFilesToSecureFilesystem(final Promise promise) {
    try {
      WritableMap entries = new WritableNativeMap();

      copyBundledFilesToSecureFilesystemRecursive(ASSETS_DATA_FOLDER_PATH);

      getEntriesInSecureStorageForPath(File.separator + BBD_DATA_FOLDER_PATH);

      entries.putArray("securedDataDirEntries", entriesInSecureStorageDataDir);
      entries.putArray("copiedInThisCall", entriesCopiedFromAssetsData);

      entriesInSecureStorageDataDir = new WritableNativeArray();
      entriesCopiedFromAssetsData = new WritableNativeArray();

      promise.resolve(entries);
    } catch (JSONException | IOException e) {
      promise.reject(this.getName(), e.getMessage());
    }
  }

  @ReactMethod
  public void callAppKineticsService(final ReadableMap arguments, final Promise promise) {

    final String applicationId = arguments.getString("applicationId");
    final String serviceId = arguments.getString("serviceId");
    final String version = arguments.getString("version");
    final String method = arguments.getString("method");
    final ReadableMap parameters = arguments.getMap("parameters");
    final ReadableArray attachments = arguments.getArray("attachments");

    String[] attachmentsArray = null;
    try {
      if (attachments.size() > 0) {
        attachmentsArray = getAttachmentsArray(attachments);
      }

      final Object params = getMapFromJSON(RNBbdServiceHelper.convertMapToJson(parameters));

      callAppKineticsForApplication(applicationId, serviceId, version, method,
              params, attachmentsArray, promise);
    } catch (JSONException | IOException e) {
      promise.reject(this.getName(), e.getMessage());
    }
  }

  @ReactMethod
  public void readyToProvideService(final ReadableMap arguments, final Promise promise) {
    final String serviceId = arguments.getString("serviceId");
    final String version = arguments.getString("version");

    serviceHelper.setServiceId(serviceId);
    serviceHelper.setServiceVersion(version);

    promise.resolve("Providing service \"" + serviceId + "\" with version \"" + version + "\"");
  }

  private String[] getAttachmentsArray(final ReadableArray attachments)
          throws IOException {
    final String[] resultAttachments = new String[attachments.size()];

    for (int i = 0; i < attachments.size(); i++) {
      String filePath = attachments.getString(i);

      File file = createFile(filePath);

      if (!file.exists()) {
        throw new FileNotFoundException("File does not exist at path \"" + filePath + "\"");
      }

      resultAttachments[i] = filePath;
    }

    return resultAttachments;
  }

  private File createFile(final String path) {
    return new com.good.gd.file.File(path);
  }

  private void callAppKineticsForApplication(final String applicationId,
                                             final String serviceId,
                                             final String version,
                                             final String method,
                                             final Object parameters,
                                             final String[] attachments,
                                             final Promise promise) {
    try {
      serviceHelper.setPromise(promise);

      serviceHelper.sendTo(applicationId,
              serviceId,
              version,
              method,
              parameters,
              attachments);
    } catch (GDServiceException e) {
      promise.reject(this.getName(), e.getMessage());
    }
  }

  private void copyBundledFilesToSecureFilesystemRecursive(String path)
          throws JSONException, IOException {
    final AssetManager assetsManager = getCurrentActivity().getAssets();
    final String root = this.getReactApplicationContext().getFilesDir().getAbsolutePath() + File.separator;

    InputStream inputStream = null;
    OutputStream outputStream = null;
    try {
      final String[] fileList = assetsManager.list(path);
      File gdDataFolder = gdFileSystemDelegate.createFile(root + BBD_DATA_FOLDER_PATH);
      if (fileList.length > 0 &&
              !gdDataFolder.exists()) {
        gdDataFolder.mkdir();
      }

      for (final String fileName : fileList) {
        String filePath = path + File.separator + fileName;
        String gdDataPathFolder = root + filePath.substring(filePath.indexOf(BBD_DATA_FOLDER_PATH));

        String[] list = assetsManager.list(filePath);
        if(list != null && list.length > 0){
          gdFileSystemDelegate.createFile(gdDataPathFolder).mkdir();

          copyBundledFilesToSecureFilesystemRecursive(filePath);
        } else {
          gdFileSystemDelegate.createFile(gdDataPathFolder).createNewFile();

          outputStream = gdFileSystemDelegate.openFileOutput(gdDataPathFolder, GDFileSystem.MODE_PRIVATE);
          inputStream = assetsManager.open(filePath);

          copyFile(inputStream, outputStream);

          entriesCopiedFromAssetsData.pushString(File.separator + filePath);
        }
      }
    } finally {
      if (inputStream != null) {
        inputStream.close();
      }
      if (outputStream != null) {
        outputStream.close();
      }
    }
  }

  private void copyFile(final InputStream inputStream,
                        final OutputStream outputStream) throws IOException {
    final byte buffer[] = new byte[1024];

    while (inputStream.available() > 0) {
      int read = inputStream.read(buffer);

      if (read > 0) {
        outputStream.write(buffer, 0, read);
        outputStream.flush();
      }
    }
  }

  private void getEntriesInSecureStorageForPath(final String path){
    final File root = gdFileSystemCreateFile(path);

    try {
      if (root.listFiles().length > 0) {
        for (final File entry : root.listFiles()) {
          if (entry.isDirectory()) {
            getEntriesInSecureStorageForPath(entry.getAbsolutePath());
          } else {
            if (entry.canRead()) {
              entriesInSecureStorageDataDir.pushString(entry.getAbsolutePath());
            }
          }
        }
      }
    } catch (Exception e) {
      // nothing to handle here
    }
  }

  private File gdFileSystemCreateFile(final String path) {
    return new com.good.gd.file.File(path);
  }

  private Object getMapFromJSON(final JSONObject jsonObject)
          throws JSONException {
    final HashMap<String, Object> map = new HashMap<String, Object>();

    if (jsonObject == null || jsonObject.names() == null) {
      return null;
    }

    final JSONArray names = jsonObject.names();

    for (int i = 0; i < names.length(); i++) {
      map.put(names.getString(i), jsonObject.get(names.getString(i)));
    }

    return map;
  }
}
