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

import { Component } from 'react';
// eslint-disable-next-line
import { IOSWebViewProps, AndroidWebViewProps } from './lib/WebViewTypes';

export { FileDownload, WebViewMessageEvent, WebViewNavigation } from "./lib/WebViewTypes";

export type WebViewProps = IOSWebViewProps & AndroidWebViewProps;

declare class WebView<P = {}> extends Component<WebViewProps & P> {
    /**
     * Go back one page in the webview's history.
     */
    goBack: () => void;

    /**
     * Go forward one page in the webview's history.
     */
    goForward: () => void;

    /**
     * Reloads the current page.
     */
    reload: () => void;

    /**
     * Stop loading the current page.
     */
    stopLoading(): void;

    /**
     * Executes the JavaScript string.
     */
    injectJavaScript: (script: string) => void;

    /**
     * Focuses on WebView redered page.
     */
    requestFocus: () => void;
    
     /**
     * Posts a message to WebView.
     */
    postMessage: (message: string) => void;
    
     /**
     * (Android only)
     * Removes the autocomplete popup from the currently focused form field, if present.
     */
    clearFormData?: () => void;

     /**
     * (Android only)
     * Clears the resource cache. Note that the cache is per-application, so this will clear the cache for all WebViews used.
     */
    clearCache?: (clear: boolean) => void;

     /**
     * (Android only)
     * Tells this WebView to clear its internal back/forward list.
     */
    clearHistory?: () => void;
}

export {WebView};
export default WebView;
