package org.java_websocket.util;


import com.good.gd.apache.commons.logging.impl.GDLogger;
import com.good.gd.ndkproxy.GDLog;

public class Logger {

    private final Class classInstantiating;

    public Logger(Class classInstantiating) {
        this.classInstantiating = classInstantiating;
    }

    public void error(String s, Throwable e) {
        WSLog.e(classInstantiating, e, s);
    }

    public void trace(String s, Throwable ex) {
        WSLog.d(classInstantiating, ex, s);
    }

    public void error(String s, String name, Throwable e) {
        WSLog.e(classInstantiating, e, s + "name : "+name);
    }

    public void trace(String s) {
        WSLog.d(classInstantiating, s);
    }

    public void error(String s) {
        WSLog.e(classInstantiating, s);
    }
}
