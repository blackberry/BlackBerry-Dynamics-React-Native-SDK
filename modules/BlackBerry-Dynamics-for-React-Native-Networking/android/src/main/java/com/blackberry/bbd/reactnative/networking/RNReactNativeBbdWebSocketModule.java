/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original WebSocket API of react-native (Java part)
 * from https://github.com/facebook/react-native/tree/0.63-stable/ReactAndroid/src/main/java/com/facebook/react/modules/websocket
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * <p>This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 */
package com.blackberry.bbd.reactnative.networking;

import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.network.ForwardingCookieHandler;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okio.ByteString;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.java_websocket.protocols.IProtocol;
import org.java_websocket.WebSocket;

import javax.net.ssl.SSLSession;

@ReactModule(name = RNReactNativeBbdWebSocketModule.NAME, hasConstants = false)
public final class RNReactNativeBbdWebSocketModule extends ReactContextBaseJavaModule {
  public static final String NAME = "BbdRNWebSocketModule";

  private static final String WEBSOCKET_OPEN = "bbdWebsocketOpen";
  private static final String WEBSOCKET_MESSAGE = "bbdWebsocketMessage";
  private static final String WEBSOCKET_CLOSED = "bbdWebsocketClosed";
  private static final String WEBSOCKET_FAILED = "bbdWebsocketFailed";

  public interface ContentHandler {
    void onMessage(String text, WritableMap params);

    void onMessage(ByteString byteString, WritableMap params);
  }

  private final Map<Integer, WebSocket> mWebSocketConnections = new ConcurrentHashMap<>();
  private final Map<Integer, ContentHandler> mContentHandlers = new ConcurrentHashMap<>();

  private ReactContext mReactContext;
  private ForwardingCookieHandler mCookieHandler;

  public RNReactNativeBbdWebSocketModule(ReactApplicationContext context) {
    super(context);
    mReactContext = context;
    mCookieHandler = new ForwardingCookieHandler(context);
  }

  private void sendEvent(String eventName, WritableMap params) {
    mReactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  @Override
  public String getName() {
    return NAME;
  }

  public void setContentHandler(final int id, final ContentHandler contentHandler) {
    if (contentHandler != null) {
      mContentHandlers.put(id, contentHandler);
    } else {
      mContentHandlers.remove(id);
    }
  }

  @ReactMethod
  public void connect(
      final String url,
      @Nullable final ReadableArray protocols,
      @Nullable final ReadableMap options,
      final int id) {
    OkHttpClient client =
        new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .readTimeout(0, TimeUnit.MINUTES) // Disable timeouts for read
            .build();

    Request.Builder builder = new Request.Builder().tag(id).url(url);

    String cookie = getCookie(url);
    if (cookie != null) {
      builder.addHeader("Cookie", cookie);
    }

    if (options != null
        && options.hasKey("headers")
        && options.getType("headers").equals(ReadableType.Map)) {

      ReadableMap headers = options.getMap("headers");
      ReadableMapKeySetIterator iterator = headers.keySetIterator();

      if (!headers.hasKey("origin")) {
        builder.addHeader("origin", getDefaultOrigin(url));
      }

      while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        if (ReadableType.String.equals(headers.getType(key))) {
          builder.addHeader(key, headers.getString(key));
        } else {
          Log.w(ReactConstants.TAG, "Ignoring: requested " + key + ", value not a string");
        }
      }
    } else {
      builder.addHeader("origin", getDefaultOrigin(url));
    }

    if (protocols != null && protocols.size() > 0) {
      StringBuilder protocolsValue = new StringBuilder("");
      for (int i = 0; i < protocols.size(); i++) {
        String v = protocols.getString(i).trim();
        if (!v.isEmpty() && !v.contains(",")) {
          protocolsValue.append(v);
          protocolsValue.append(",");
        }
      }
      if (protocolsValue.length() > 0) {
        protocolsValue.replace(protocolsValue.length() - 1, protocolsValue.length(), "");
        builder.addHeader("Sec-WebSocket-Protocol", protocolsValue.toString());
      }
    }

    BbdWebSocketClient bbdWebSocketClient = null;
    try {
      bbdWebSocketClient = new BbdWebSocketClient(new URI(url), id);
      bbdWebSocketClient.connect();

    } catch (URISyntaxException e) {
      e.printStackTrace();
    }

    // Trigger shutdown of the dispatcher's executor so this process can exit cleanly
    client.dispatcher().executorService().shutdown();
  }

  @ReactMethod
  public void close(int code, String reason, int id) {
    WebSocket client = mWebSocketConnections.get(id);
    if (client == null) {
      // WebSocket is already closed
      // Don't do anything, mirror the behaviour on web
      return;
    }
    try {
      client.close(code, reason);
      mWebSocketConnections.remove(id);
      mContentHandlers.remove(id);
    } catch (Exception e) {
      Log.e(ReactConstants.TAG, "Could not close WebSocket connection for id " + id, e);
    }
  }

  @ReactMethod
  public void send(String message, int id) {
    WebSocket client = mWebSocketConnections.get(id);
    if (client == null) {
      // This is a programmer error -- display development warning
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);
      params.putString("message", "client is null");
      sendEvent("websocketFailed", params);
      params = Arguments.createMap();
      params.putInt("id", id);
      params.putInt("code", 0);
      params.putString("reason", "client is null");
      sendEvent("websocketClosed", params);
      mWebSocketConnections.remove(id);
      mContentHandlers.remove(id);
      return;
    }
    try {
      client.send(message);
    } catch (Exception e) {
      notifyWebSocketFailed(id, e.getMessage());
    }
  }

  @ReactMethod
  public void sendBinary(String base64String, int id) {
    WebSocket client = mWebSocketConnections.get(id);
    if (client == null) {
      // This is a programmer error -- display development warning
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);
      params.putString("message", "client is null");
      sendEvent("websocketFailed", params);
      params = Arguments.createMap();
      params.putInt("id", id);
      params.putInt("code", 0);
      params.putString("reason", "client is null");
      sendEvent("websocketClosed", params);
      mWebSocketConnections.remove(id);
      mContentHandlers.remove(id);
      return;
    }
    try {
      ByteString byteString = ByteString.decodeBase64(base64String);
      client.send(byteString.toByteArray());
    } catch (Exception e) {
      notifyWebSocketFailed(id, e.getMessage());
    }
  }

  public void sendBinary(ByteString byteString, int id) {
    WebSocket client = mWebSocketConnections.get(id);
    if (client == null) {
      // This is a programmer error -- display development warning
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);
      params.putString("message", "client is null");
      sendEvent("websocketFailed", params);
      params = Arguments.createMap();
      params.putInt("id", id);
      params.putInt("code", 0);
      params.putString("reason", "client is null");
      sendEvent("websocketClosed", params);
      mWebSocketConnections.remove(id);
      mContentHandlers.remove(id);
      return;
    }
    try {
      client.send(byteString.toByteArray());
    } catch (Exception e) {
      notifyWebSocketFailed(id, e.getMessage());
    }
  }

  @ReactMethod
  public void ping(int id) {
    WebSocket client = mWebSocketConnections.get(id);
    if (client == null) {
      // This is a programmer error -- display development warning
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);
      params.putString("message", "client is null");
      sendEvent("websocketFailed", params);
      params = Arguments.createMap();
      params.putInt("id", id);
      params.putInt("code", 0);
      params.putString("reason", "client is null");
      sendEvent("websocketClosed", params);
      mWebSocketConnections.remove(id);
      mContentHandlers.remove(id);
      return;
    }
    try {
      client.sendPing();
    } catch (Exception e) {
      notifyWebSocketFailed(id, e.getMessage());
    }
  }

  private void notifyWebSocketFailed(int id, String message) {
    WritableMap params = Arguments.createMap();
    params.putInt("id", id);
    params.putString("message", message);
    sendEvent("websocketFailed", params);
  }

  /**
   * Get the default HTTP(S) origin for a specific WebSocket URI
   *
   * @param uri
   * @return A string of the endpoint converted to HTTP protocol (http[s]://host[:port])
   */
  private static String getDefaultOrigin(String uri) {
    try {
      String defaultOrigin;
      String scheme = "";

      URI requestURI = new URI(uri);
      switch (requestURI.getScheme()) {
        case "wss":
          scheme += "https";
          break;
        case "ws":
          scheme += "http";
          break;
        case "http":
        case "https":
          scheme += requestURI.getScheme();
          break;
        default:
          break;
      }

      if (requestURI.getPort() != -1) {
        defaultOrigin =
            String.format("%s://%s:%s", scheme, requestURI.getHost(), requestURI.getPort());
      } else {
        defaultOrigin = String.format("%s://%s", scheme, requestURI.getHost());
      }

      return defaultOrigin;
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException("Unable to set " + uri + " as default origin header");
    }
  }

  /**
   * Get the cookie for a specific domain
   *
   * @param uri
   * @return The cookie header or null if none is set
   */
  private String getCookie(String uri) {
    try {
      URI origin = new URI(getDefaultOrigin(uri));
      Map<String, List<String>> cookieMap = mCookieHandler.get(origin, new HashMap());
      List<String> cookieList = cookieMap.get("Cookie");

      if (cookieList == null || cookieList.isEmpty()) {
        return null;
      }

      return cookieList.get(0);
    } catch (URISyntaxException | IOException e) {
      throw new IllegalArgumentException("Unable to get cookie from " + uri);
    }
  }

  public class BbdWebSocketClient extends WebSocketClient {
    protected int id;

    public BbdWebSocketClient(URI serverUri) {
      super(serverUri);
    }

    public BbdWebSocketClient(URI serverUri, int id) {
      super(serverUri);

      this.id = id;
    }

    @Override
    public void onOpen(ServerHandshake serverHandshake) {
      Log.i(getName(), "websocket is connected");
      mWebSocketConnections.put(id, this);
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);
      params.putString("protocol", "Sec-WebSocket-Protocol: \"\"");
      sendEvent(WEBSOCKET_OPEN, params);
    }

    @Override
    public void onMessage(String text) {
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);
      params.putString("type", "text");

      ContentHandler contentHandler = mContentHandlers.get(id);
      if (contentHandler != null) {
        contentHandler.onMessage(text, params);
      } else {
        params.putString("data", text);
      }
      sendEvent(WEBSOCKET_MESSAGE, params);
    }

    @Override
    public void onMessage(ByteBuffer blob) {
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);
      params.putString("type", "binary");

      ByteString bytes = new ByteString(blob.array());

      ContentHandler contentHandler = mContentHandlers.get(id);
      if (contentHandler != null) {
        contentHandler.onMessage(bytes, params);
      } else {
        String text = bytes.base64();

        params.putString("data", text);
      }

      sendEvent(WEBSOCKET_MESSAGE, params);
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
      Log.i(getName(), "websocket is disconnected: " + reason);
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);

      params.putInt("code", code);
      params.putString("reason", reason);
      sendEvent(WEBSOCKET_CLOSED, params);
    }

    @Override
    public void onError(Exception e) {
      WritableMap params = Arguments.createMap();
      params.putInt("id", id);
      params.putString("message", e.getMessage());
      sendEvent(WEBSOCKET_FAILED, params);
    }

    @Override
    public boolean hasSSLSupport() {
      return true;
    }

    @Override
    public SSLSession getSSLSession() throws IllegalArgumentException {
      return null;
    }

    @Override
    public IProtocol getProtocol() {
      return null;
    }
  }
}
