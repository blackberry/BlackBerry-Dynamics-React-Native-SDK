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


import FS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';

String.prototype.lastPathComponent = function() {
  let str = this.valueOf();
  const lastPathComponent = (parts = str.split('/'))[parts.length -1];
  return lastPathComponent;
}

String.prototype.exposeNameAndExtension = function() {
  let str = this.valueOf();
  str = str.split('.');
  return {
    name: str[0],
    extension: str[1]
  }
}

class FileSystemService {

  static async readFile(path) {
    try {
      return FS.readFile(path);
    } catch (error) {
      throw error;
    }
  }

  static async writeFile(path, contents) {
    try {
      return FS.writeFile(path, contents);
    } catch (error) {
      throw error;
    }
  }

  static async createFile(path) {
    try {
      if(await FS.exists(path)) {
        const name = (parts = path.split('/'))[parts.length -1];
        throw new Error(`File ${name} already exists!`);
      }
      return FS.writeFile(path, '');
    } catch (error) {
      throw error;
    }
  }

  static async delete(path) {
    try {
      return FS.unlink(path);
    } catch (error) {
      throw error;
    }
  }

  static async createFolder(path) {
    try {
      if(await FS.exists(path)) {
        const name = (parts = path.split('/'))[parts.length -1];
        throw new Error(`Folder ${name} already exists!`);
      }
      return FS.mkdir(path);
    } catch (error) {
      throw error;
    }
  }

}

export default FileSystemService;
