/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 * Some modifications to the original react-native-sqlite-storage module for react-native
 * from https://github.com/andpor/react-native-sqlite-storage/
 *
 * Written by Andrzej Porebski Nov 14/2015
 *
 * Copyright (c) 2015, Andrzej Porebski
 */

package com.blackberry.bbd.reactnative.storage;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class CallbackContext {

    private static final String LOG_TAG = CallbackContext.class.getSimpleName();

    private Callback successCallback;
    private Callback errorCallback;

    public CallbackContext(Callback success, Callback error) {
        this.successCallback = success;
        this.errorCallback = error;
    }

    /**
     * Helper for success callbacks that just returns the Status.OK by default
     *
     * @param message The message to add to the success result.
     */
    public void success(WritableMap message) {
        successCallback.invoke(message);

    }

    /**
     * Helper for success callbacks that just returns the Status.OK by default
     *
     * @param message The message to add to the success result.
     */
    public void success(String message) {
        successCallback.invoke(message);
    }

    /**
     * Helper for success callbacks that just returns the Status.OK by default
     *
     * @param message The message to add to the success result.
     */
    public void success(WritableArray message) {
        successCallback.invoke(message);
    }

    /**
     * Helper for success callbacks that just returns the Status.OK by default
     */
    public void success() {
        successCallback.invoke("Success");
    }

    /**
     * Helper for error callbacks that just returns the Status.ERROR by default
     *
     * @param message The message to add to the error result.
     */
    public void error(WritableMap message) {
        errorCallback.invoke(message);
    }

    /**
     * Helper for error callbacks that just returns the Status.ERROR by default
     *
     * @param message The message to add to the error result.
     */
    public void error(String message) {
        errorCallback.invoke(message);
    }
}