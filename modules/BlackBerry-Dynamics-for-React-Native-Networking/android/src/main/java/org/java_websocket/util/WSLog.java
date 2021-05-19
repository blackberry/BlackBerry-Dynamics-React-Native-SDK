/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.java_websocket.util;

import android.util.Log;

import java.lang.reflect.Method;
import java.util.regex.Pattern;

/**
 * This is an internal logging utility class for BlackBerry Connect.
 * Logs are written to the console and/or to GD secure storage.
 * There are 4 logging levels: error, warning, info and detail.
 * Normally detail logs are not written to secure storage, as that
 * would use too much storage, but this can be enabled from the GC.
 *
 * It's also possible to specify filtering for the different log
 * levels by editing the assets/settings.json file.
 *
 * All log functions take a class or object as their first parameter;
 * the class name is extracted and added as a prefix to the log line.
 *
 * When logs are written to the android system log, the LOG_TAG will
 * be "GoodConnect" (the value of LOG_TAG).
 */
public class WSLog {

    // copied from com.good.gd.ndkproxy.GDLog
    public static final int LOG_ERROR           = 12;
    public static final int LOG_WARNING         = 13;
    public static final int LOG_INFO            = 14;
    public static final int LOG_DETAIL          = 16;

    private static Pattern controlCharPattern = Pattern.compile("\\p{Cntrl}");
    private static Pattern newlinePattern = Pattern.compile("[\r\n]");

    private static final int MAX_LINES_TO_LOG_FOR_ONE_CALL = 100;

    private static Method gdLogMethod = null;

    public final static String LOG_TAG = "Websocket";

    public static void initialize() {
        try {
            // find the GDLog class
            Class gdLogClass = com.good.gd.ndkproxy.GDLog.class;
            if (gdLogClass == null) {
                throw new Exception("GDLog class not found, cannot use GD logging");
            }

            // GD-2308: recommendation from GD team is to use the DBGPRINTF or obfuscated "a" method,
            // and NOT the "log" method, because using the "log" method will cause logging to the
            // system console in production in many cases. So if we can't get DBGPRINTF or "a" then
            // we should just fail. We DO NOT want to get the "log" method.

            try {
            	gdLogMethod = gdLogClass.getDeclaredMethod("DBGPRINTF", Integer.TYPE, String.class);
            } catch (NoSuchMethodException nsme) {
            }

            if (gdLogMethod == null) {
                try {
                    gdLogMethod = gdLogClass.getDeclaredMethod("a", Integer.TYPE, String.class);
                } catch (NoSuchMethodException nsme) {
                }
            }

            if (gdLogMethod == null) {
                throw new Exception("GDLog logging method not found, cannot use GD logging");
            }

            // just in case ...
            gdLogMethod.setAccessible(true);
        } catch (Exception e) {
            throw new RuntimeException("Cannot initialize GD logging: " + e);
        }
    }

    private static void logToGD(int logLevel, String caller, String message) {
        try {
            for (String m : sanitize(message)) {
                gdLogMethod.invoke(null, logLevel, LOG_TAG + " " + caller + " " + m + "\n");
            }
        } catch (Exception e) {
            Log.e(LOG_TAG, "[Exception trying to use GDLog: " + e + "]");
        }
    }

    // e

    public static void e(Class cls, String msg) {
        logToGD(LOG_ERROR, nameForClass(cls), msg);
    }

    public static void e(Object obj, String msg) {
        logToGD(LOG_ERROR, nameForClass(obj.getClass()), msg);
    }

    public static void e(Object obj, Throwable throwable) {
        logStackTrace(LOG_ERROR, nameForClass(obj.getClass()), throwable);
    }

    public static void e(Class cls, Throwable throwable) {
        logStackTrace(LOG_ERROR, nameForClass(cls), throwable);
    }

    public static void e(Object obj, Throwable throwable, String msg) {
        e(obj, msg);
        logStackTrace(LOG_ERROR, nameForClass(obj.getClass()), throwable);
    }

    public static void e(Class cls, Throwable throwable, String msg) {
        e(cls, msg);
        logStackTrace(LOG_ERROR, nameForClass(cls), throwable);
    }

    // w

    public static void w(Class cls, String msg) {
        logToGD(LOG_WARNING, nameForClass(cls), msg);
    }

    public static void w(Object obj, String msg) {
        logToGD(LOG_WARNING, nameForClass(obj.getClass()), msg);
    }

    public static void w(Object obj, Throwable throwable) {
        logStackTrace(LOG_WARNING, nameForClass(obj.getClass()), throwable);
    }

    public static void w(Class cls, Throwable throwable) {
        logStackTrace(LOG_WARNING, nameForClass(cls), throwable);
    }

    public static void w(Object obj, Throwable throwable, String msg) {
        w(obj, msg);
        logStackTrace(LOG_WARNING, nameForClass(obj.getClass()), throwable);
    }

    public static void w(Class cls, Throwable throwable, String msg) {
        w(cls, msg);
        logStackTrace(LOG_WARNING, nameForClass(cls), throwable);
    }

    // i

    public static void i(Class cls, String msg) {
        logToGD(LOG_INFO, nameForClass(cls), msg);
    }

    public static void i(Object obj, String msg) {
        logToGD(LOG_INFO, nameForClass(obj.getClass()), msg);
    }

    public static void i(Object obj, Throwable throwable) {
        logStackTrace(LOG_INFO, nameForClass(obj.getClass()), throwable);
    }

    public static void i(Class cls, Throwable throwable) {
        logStackTrace(LOG_INFO, nameForClass(cls), throwable);
    }

    public static void i(Object obj, Throwable throwable, String msg) {
        i(obj, msg);
        logStackTrace(LOG_INFO, nameForClass(obj.getClass()), throwable);
    }

    public static void i(Class cls, Throwable throwable, String msg) {
        i(cls, msg);
        logStackTrace(LOG_INFO, nameForClass(cls), throwable);
    }

    // d

    public static void d(Class cls, String msg) {
        logToGD(LOG_DETAIL, nameForClass(cls), msg);
    }

    public static void d(Object obj, String msg) {
        logToGD(LOG_DETAIL, nameForClass(obj.getClass()), msg);
    }

    public static void d(Object obj, Throwable throwable) {
        logStackTrace(LOG_DETAIL, nameForClass(obj.getClass()), throwable);
    }

    public static void d(Class cls, Throwable throwable) {
        logStackTrace(LOG_DETAIL, nameForClass(cls), throwable);
    }

    public static void d(Object obj, Throwable throwable, String msg) {
        d(obj, msg);
        logStackTrace(LOG_DETAIL, nameForClass(obj.getClass()), throwable);
    }

    public static void d(Class cls, Throwable throwable, String msg) {
        d(cls, msg);
        logStackTrace(LOG_DETAIL, nameForClass(cls), throwable);
    }

    // exception logging helper

    private static void logStackTrace(int level, String callerName, Throwable throwable) {

        logToGD(level, callerName, throwable.toString());
        for (StackTraceElement elem : throwable.getStackTrace()) {
            logToGD(level, callerName, "   " + elem);
        }

        Throwable cause = throwable.getCause();
        if (cause != null) {
            logToGD(level, callerName, " Caused by: " + cause.toString());
            for (StackTraceElement elem : cause.getStackTrace()) {
                logToGD(level, callerName, "   " + elem);
            }
        }
    }

    /*
     * Get the "simple name" of the class, or of its enclosing class if it has no name;
     * iterates until it reaches a class with a name or a class with no enclosing class,
     * in which case it just returns the empty string (this should not happen because all
     * classes should have some enclosing top-level class with a name).
     */
    private static String nameForClass(Class initialClass) {
        for (Class cls = initialClass; cls != null; cls = cls.getEnclosingClass()) {
            final String s = cls.getSimpleName();
            if (s != null && s.length() != 0) {
                return s;
            }
        }
        return "";
    }

    // Helper methods

    // split the message at newlines; replace control characters and
    // characters not in the basic multilingual plane with escape sequences
    private static String[] sanitize(String message) {

        String[] stringArr = newlinePattern.split(message, MAX_LINES_TO_LOG_FOR_ONE_CALL + 1);

        // we limit the number of log lines that can result from a single log request;
        // make sure we indicate we have truncated the lines by changing the last element
        if (stringArr.length > MAX_LINES_TO_LOG_FOR_ONE_CALL) {
            stringArr[MAX_LINES_TO_LOG_FOR_ONE_CALL] = "... (truncated)";
        }

        for (int i = 0; i < stringArr.length; i++) {
            StringBuffer sb = null;
            String s = stringArr[i];

            int copied_so_far = 0;
            for (int offset = 0, lim = s.length(); offset < lim; offset++) {
                char c = s.charAt(offset);
                if (Character.isHighSurrogate(c) ||
                    Character.isLowSurrogate(c) ||
                    (Character.isISOControl(c) && !Character.isWhitespace(c))) {

                    if (sb == null) {
                        // we only need the buffer if we're changing anything
                        sb = new StringBuffer();
                    }

                    if (copied_so_far < offset) {
                        // copy the boring characters before this interesting one
                        sb.append(s.substring(copied_so_far, offset));
                        copied_so_far = offset;
                    }

                    // special characters are always printed as 2 hex chars
                    sb.append(String.format("\\x%02X", s.codePointAt(offset)));
                    copied_so_far++;
                }
            }
            if (sb != null) {
                // we changed something, so copy the rest of the string and
                // change the reference in the string table to point to the
                // resultant string
                sb.append(s.substring(copied_so_far, s.length()));
                stringArr[i] = sb.toString();
            }
        }

        return stringArr;
    }
}
