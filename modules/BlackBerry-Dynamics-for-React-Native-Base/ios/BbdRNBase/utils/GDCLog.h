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

#ifndef GDC_LOG_H
#define GDC_LOG_H

#ifdef __cplusplus
extern "C" {
#endif

    /** Log level constants for use with GDCLog.
     * This enumeration represents log levels.
     * The <TT>level</TT> parameter of the GDCLog function takes one of these values.
     */
    typedef enum
    {
        GDC_LOG_ERROR,
        /**< The log message is an error and is always logged.
         */
        GDC_LOG_WARNING,
        /**< The log message is a warning and is always logged.
         */
        GDC_LOG_INFO,
        /**< The log message is informational only and is always logged.
         */
        GDC_LOG_DETAIL
        /**< The log message is only logged when detailed logging is enabled from Good Control.
         */
    } GDCLogLevel;

    void GDCLog(GDCLogLevel level, const char *format, ...);
    /**< Logs an encrypted message persisted within the secure container.
     * Writes an encrypted message to the secure container log.
     *
     * The BlackBerry Dynamics run-time also writes messages to the same log so application
     * messages will be interleaved. When the log reaches 4 MB older messages are
     * overwritten.
     *
     * This function is thread-safe.
     *
     * The message may be formatted.  After the format argument, the function expects at
     * least as many additional arguments as specified in <TT>format</TT>. See the
     * <A HREF="http://www.cplusplus.com/reference/clibrary/cstdio/printf/" target="_blank"
     * >C Library Reference</A> for a detailed description of the embedded format tags
     * that may be used.
     *
     * \param level \ref GDCLogLevel of the message.
     * \param format The message to be logged including optional embedded format tags.
     *
     * Unencrypted messages may be viewed in the Xcode console during execution,
     * or decrypted and exported to the applications's Documents folder later. The logs may also
     * be securely uploaded to the BlackBerry Technology Network Operations Center (NOC).
     *
     */

#ifdef __cplusplus
}
#endif

#endif
