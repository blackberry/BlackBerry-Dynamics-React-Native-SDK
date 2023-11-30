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

const curry = (fn, ...args) => (..._arg) => fn(...args, ..._arg);
const pipe = (...fns) => (args) => fns.reduce((arg, fn) => fn(arg), args);
const joinWithSeparator = (...strs) => (separator) => strs.join(separator);
const join = (...strs) => joinWithSeparator(...strs)('');
const replace = (pattern, replacement) => (where) => where.replace(pattern, replacement);

const addContentTo = ({ afterWhere, content }) => (fileContent) => {
   if (afterWhere === undefined) {
     return join(content, fileContent);
   }

   const postInstallIndex = fileContent.indexOf(afterWhere) + 1;
   const beforePostInstall = fileContent.substring(0, postInstallIndex + afterWhere.length);
   const afterPostInstall = fileContent.substring(postInstallIndex + afterWhere.length + 1, fileContent.length);

   return join(beforePostInstall, content, afterPostInstall);
};

module.exports = {
   curry,
   pipe,
   joinWithSeparator,
   join,
   replace,
   addContentTo
};
