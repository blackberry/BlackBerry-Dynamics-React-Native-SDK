/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

import React, { createContext, useState } from 'react';
import { ToastMessage } from '../components/ToastMessage';
import { faCheckCircle, faExclamationCircle, faExclamationTriangle, faComment } from '@fortawesome/free-solid-svg-icons'

export const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
  const [notification, setNotification] = useState(null);

  const emmit = (type, message) => {
    switch(type) {
      case 'alert':
        setNotification(
        <ToastMessage
          icon={faExclamationCircle}
          color="red"
          message={message}
          onDismiss={() => setNotification(null)}
        />);
        break;
      case 'warning':
        setNotification(
        <ToastMessage
          icon={faExclamationTriangle}
          color="yellow"
          message={message}
          onDismiss={() => setNotification(null)}
        />);
        break;
      case 'success':
        setNotification(
        <ToastMessage
          icon={faCheckCircle}
          color="green"
          message={message}
          onDismiss={() => setNotification(null)}
        />);
        break;
      default:
        setNotification(
        <ToastMessage
          icon={faComment}
          color="#ccc"
          message={message}
          onDismiss={() => setNotification(null)}
        />);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notification: {emmit}
    }}>
      {children}
      {notification}
    </NotificationContext.Provider>
  );
};
