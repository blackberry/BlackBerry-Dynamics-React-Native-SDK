package org.java_websocket.util;

public class LoggerFactory {

    public static Logger getLogger(Class classInstantiating) {
        return new Logger(classInstantiating);
    }


}
