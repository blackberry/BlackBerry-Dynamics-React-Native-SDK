/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
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

package com.blackberry.bbd.reactnative.networking.core.cookie;

import java.util.Collections;
import java.util.List;

import com.good.gd.apache.http.cookie.Cookie;


/**
 * Delegate BasicCookieStore class.
 */
public class BasicCookieStore extends com.good.gd.apache.http.impl.client.BasicCookieStore {

    // never accepts any cookies.
    private boolean NO_COOKIES = false;

    public BasicCookieStore() {
        super();
    }


    @Override
    public synchronized void addCookie(Cookie cookie) { 
        if (!NO_COOKIES) {
            super.addCookie(cookie);
        }
    }

    @Override
    public synchronized void addCookies(Cookie[] cookies) {
        if (!NO_COOKIES) {
            super.addCookies(cookies);
        }
    }

    @Override
    public synchronized List<Cookie> getCookies() {
        if (NO_COOKIES) {
            return Collections.emptyList();
        }
        return super.getCookies();
    }


    @Override
    public String toString() {
         if (!NO_COOKIES) {
            return super.toString();
        }
       return null;
    }
    
    public synchronized void noCookies(boolean nocookies) {
        NO_COOKIES = nocookies;
    }
    
}
