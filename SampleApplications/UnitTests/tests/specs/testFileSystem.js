/**
 * Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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

import RNFS from 'BlackBerry-Dynamics-for-React-Native-FileSystem';

import { Platform } from 'react-native';

export default function() {
  describe('FileSystem API', function() {

    it('Check FileSystem is available', function() {
      expect(RNFS).toBeDefined();
    });

    it('Check FileSystem some basic API is available', function() {
      let isAvailableBasicFileSystemMethods = true;
      let FileSystemAPI = [];

      const fileSystemBasicMethodsMock = [
        'readFile',
        'writeFile',
        'appendFile',
        'readdir',
        'stat',
        'unlink',
        'copyFile',
        'moveFile',
        'mkdir',
        'exists'
      ];

      for (key in RNFS) {
        FileSystemAPI.push(key);
      }

      for (let i = 0; i < fileSystemBasicMethodsMock.length; i++) {
        if (!FileSystemAPI.includes(fileSystemBasicMethodsMock[i])) {
          isAvailableBasicFileSystemMethods = false;
          break;
        }
      }

      expect(isAvailableBasicFileSystemMethods).toBe(true);
    });

    describe('FileSystem basic functionality', function() {
      const testRoot = `${RNFS.DocumentDirectoryPath}/testing_dir`;

      beforeEach(async function() {
        // DEVNOTE: clear FileSystem testing root directory before running each spec
        try {
          await RNFS.unlink(testRoot);
        } catch (error) {
          // console.log('FileSystem: storage had been already cleared or clear error appeared!');
        } finally {
          await RNFS.mkdir(testRoot);
        }
      });

      it('FileSystem: check empty directory entries (readdir)', async function() {
        const entries = await RNFS.readdir(testRoot);
        expect(entries.length).toBe(0);
      });

      it('FileSystem: create directory, check entries (readdir)', async function() {
        const directoryName = 'new_directory';

        await RNFS.mkdir(`${testRoot}/${directoryName}`);
        const entries = await RNFS.readdir(testRoot);
        expect(entries.length).toBe(1);
        expect(entries[0]).toBe(directoryName);
      });

      it('FileSystem: create directory, check entries (readDir)', async function() {
        const directoryName = 'new_directory';
        const path = `${testRoot}/${directoryName}`;

        await RNFS.mkdir(path);
        const entries = await RNFS.readDir(testRoot);
        expect(entries.length).toBe(1);
        expect(typeof entries[0]).toBe('object');
        expect(entries[0].name).toBe(directoryName);
        expect(entries[0].path).toBe(path);
        expect(entries[0].size).toBeGreaterThan(1);
        expect(entries[0].isDirectory).toBeDefined();
        expect(entries[0].isDirectory()).toBe(true);
        expect(entries[0].isFile).toBeDefined();
        expect(entries[0].isFile()).toBe(false);
      });

      it('FileSystem: write, read empty file', async function() {
        const fileName = 'file.txt';
        const fileContent = '';
        const textFilePath = `${testRoot}/${fileName}`;

        await RNFS.writeFile(textFilePath, fileContent, 'utf8');
        const entries = await RNFS.readdir(testRoot);
        expect(entries.length).toBe(1);
        expect(entries[0]).toBe(fileName);

        const result = await RNFS.readFile(textFilePath, 'utf8')
        expect(result).toBe(fileContent);
      });

      it('FileSystem: write, read not empty utf-8 file', async function() {
        const fileName = 'file.txt';
        const fileContent = 'foo © bar 𝌆 baz';
        const textFilePath = `${testRoot}/${fileName}`;

        await RNFS.writeFile(textFilePath, fileContent, 'utf8');
        const entries = await RNFS.readdir(testRoot);
        expect(entries.length).toBe(1);
        expect(entries[0]).toBe(fileName);

        const result = await RNFS.readFile(textFilePath, 'utf8')
        expect(result).toBe(fileContent);
      });

      it('FileSystem: create multiple directories, files, check entries existence', async function() {
        const fileName1 = 'file.txt';
        const fileName2 = 'test_file.xml';
        const directoryName1 = 'new_directory1';
        const directoryName2 = 'new_directory2';

        await RNFS.mkdir(`${testRoot}/${directoryName1}`);
        await RNFS.mkdir(`${testRoot}/${directoryName2}`);
        await RNFS.writeFile(`${testRoot}/${fileName1}`, '', 'utf8');
        await RNFS.writeFile(`${testRoot}/${fileName2}`, '', 'utf8');

        const entries = await RNFS.readdir(testRoot);
        expect(entries.length).toBe(4);
        expect(entries.includes(fileName1)).toBe(true);
        expect(entries.includes(fileName2)).toBe(true);
        expect(entries.includes(directoryName1)).toBe(true);
        expect(entries.includes(directoryName2)).toBe(true);
      });

      it('FileSystem: exists - check existing directory, file', async function() {
        const directoryPath = `${testRoot}/test_directory`;
        await RNFS.mkdir(directoryPath);
        const directoryExists = await RNFS.exists(directoryPath);
        expect(directoryExists).toBe(true);

        const filePath = `${testRoot}/file.txt`;
        await RNFS.writeFile(filePath, '', 'utf8');
        const fileExists = await RNFS.exists(filePath);
        expect(fileExists).toBe(true);
      });

      it('FileSystem: exists - check not existing directory, file', async function() {
        const directoryPath = `${testRoot}/not_existing_directory`;
        const directoryExists = await RNFS.exists(directoryPath);
        expect(directoryExists).toBe(false);

        const filePath = `${testRoot}/not_existing_file.txt`;
        const fileExists = await RNFS.exists(filePath);
        expect(fileExists).toBe(false);
      });

      it('FileSystem: unlink file', async function() {
        const fileName = 'file.txt';
        const fileContent = 'foo © bar 𝌆 baz';
        const filePath = `${testRoot}/${fileName}`;

        await RNFS.writeFile(filePath, fileContent, 'utf8');
        const fileExists = await RNFS.exists(filePath);
        expect(fileExists).toBe(true);

        await RNFS.unlink(filePath);
        const fileExistsAfterUnlink = await RNFS.exists(filePath);
        expect(fileExistsAfterUnlink).toBe(false);
      });

      it('FileSystem: create nested directories, write file, unlink recursively', async function() {
        const directoryPath = `${testRoot}/a`;
        const nestedDirPath = `${directoryPath}/b/c`;
        const fileInNestedPath = `${nestedDirPath}/file.txt`;

        await RNFS.mkdir(nestedDirPath);
        const nestedDirExists = await RNFS.exists(nestedDirPath);
        expect(nestedDirExists).toBe(true);

        await RNFS.writeFile(fileInNestedPath, 'some test content', 'utf8');
        const fileExists = await RNFS.exists(fileInNestedPath);
        expect(fileExists).toBe(true);

        await RNFS.unlink(directoryPath);
        const directoryExists = await RNFS.exists(directoryPath);
        expect(directoryExists).toBe(false);
      });

      it('FileSystem: append content to files', async function() {
        const file1Path = `${testRoot}/f1.txt`;
        const file2Path = `${testRoot}/f2.txt`;

        await RNFS.writeFile(file1Path, 'foo © bar 𝌆 baz', 'utf8');
        await RNFS.appendFile(file1Path, 'baz 𝌆 bar © foo', 'utf8');
        await RNFS.appendFile(file2Path, 'baz 𝌆 bar © foo', 'utf8');

        const file1Content = await RNFS.readFile(file1Path, 'utf8');
        expect(file1Content).toBe('foo © bar 𝌆 bazbaz 𝌆 bar © foo');
        const file2Content = await RNFS.readFile(file2Path, 'utf8');
        expect(file2Content).toBe('baz 𝌆 bar © foo');
      });

      it('FileSystem: write, read with options, get stats for file', async function() {
        const fileName = 'file.txt';
        const fileContent = 'test file content';
        const filePath = `${testRoot}/${fileName}`;

        await RNFS.writeFile(filePath, fileContent, { encoding: 'utf8' });
        const fileExists = await RNFS.exists(filePath);
        expect(fileExists).toBe(true);
        const fileContentResult = await RNFS.readFile(filePath, { encoding: 'utf8' });
        expect(fileContentResult).toBe(fileContent);

        const fileStats = await RNFS.stat(filePath);
        if (Platform.OS === 'ios') {
          expect(fileStats.ctime).toBeDefined();
          expect(fileStats.ctime instanceof Date).toBe(true);
        }
        expect(fileStats.isDirectory).toBeDefined();
        expect(fileStats.isDirectory()).toBe(false);
        expect(fileStats.isFile).toBeDefined();
        expect(fileStats.isFile()).toBe(true);
        expect(fileStats.mtime).toBeDefined();
        expect(fileStats.mtime instanceof Date).toBe(true);
        if (Platform.OS === 'android') {
          expect(fileStats.originalFilepath).toBeDefined();
        }
        expect(fileStats.path).toBeDefined();
        expect(fileStats.path).toContain(filePath);
        expect(fileStats.size).toBeDefined();
        expect(fileStats.size).toBe(fileContent.length);
      });

      it('FileSystem: get stats for not existing file - negative case', async function() {
        const fileName = 'not_existing.txt';
        const filePath = `${testRoot}/${fileName}`;

        try {
          await RNFS.stat(filePath);
          expect('Stat for not existing file should fail').toBe(true);
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it('FileSystem: get stats for directory', async function() {
        const directoryPath = `${testRoot}/test_directory`;

        await RNFS.mkdir(directoryPath);
        const directoryExists = await RNFS.exists(directoryPath);
        expect(directoryExists).toBe(true);

        const directoryStats = await RNFS.stat(directoryPath);
        if (Platform.OS === 'ios') {
          expect(directoryStats.ctime).toBeDefined();
          expect(directoryStats.ctime instanceof Date).toBe(true);
        }
        expect(directoryStats.isDirectory).toBeDefined();
        expect(directoryStats.isDirectory()).toBe(true);
        expect(directoryStats.isFile).toBeDefined();
        expect(directoryStats.isFile()).toBe(false);
        expect(directoryStats.mtime).toBeDefined();
        expect(directoryStats.mtime instanceof Date).toBe(true);
        if (Platform.OS === 'android') {
          expect(directoryStats.originalFilepath).toBeDefined();
        }
        expect(directoryStats.path).toBeDefined();
        expect(directoryStats.path).toContain(directoryPath);
        expect(directoryStats.size).toBeDefined();
        expect(directoryStats.size).toBeGreaterThan(0);
      });

      it('FileSystem: write/read empty file, get file stats', async function() {
        const filePath = `${testRoot}/file.txt`;
        const fileContent = '';

        await RNFS.writeFile(filePath, fileContent, { encoding: 'utf8' });
        const fileContentResult = await RNFS.readFile(filePath, { encoding: 'utf8' });
        expect(fileContentResult).toBe(fileContent);

        const fileStats = await RNFS.stat(filePath);
        expect(fileStats.size).toBe(fileContent.length);
        expect(fileStats.isFile()).toBe(true);
        expect(fileStats.isDirectory()).toBe(false);
      });

      it('FileSystem: copy file', async function() {
        const fileContent = 'some test content';
        const originalFilePath = `${testRoot}/original.txt`;
        const copyFilePath = `${testRoot}/copy.txt`;

        const existsCopiedFileBefore = await RNFS.exists(copyFilePath);
        expect(existsCopiedFileBefore).toBe(false);

        await RNFS.writeFile(originalFilePath, fileContent);
        await RNFS.copyFile(originalFilePath, copyFilePath);

        const existsOriginalFileAfter = await RNFS.exists(originalFilePath);
        expect(existsOriginalFileAfter).toBe(true);
        const originalFileContent = await RNFS.readFile(originalFilePath);
        expect(originalFileContent).toBe(fileContent);

        const existsCopiedFileAfter = await RNFS.exists(copyFilePath);
        expect(existsCopiedFileAfter).toBe(true);
        const copiedFileContent = await RNFS.readFile(copyFilePath);
        expect(copiedFileContent).toBe(fileContent);
      });

      it('FileSystem: move file', async function() {
        const fileContent = 'some test content';
        const originalFilePath = `${testRoot}/original.txt`;
        const filePathToMove = `${testRoot}/move.txt`;

        const existsMovedFileBefore = await RNFS.exists(filePathToMove);
        expect(existsMovedFileBefore).toBe(false);

        await RNFS.writeFile(originalFilePath, fileContent);
        await RNFS.moveFile(originalFilePath, filePathToMove);

        const existsOriginalFileAfter = await RNFS.exists(originalFilePath);
        expect(existsOriginalFileAfter).toBe(false);

        const existsMovedFileAfter = await RNFS.exists(filePathToMove);
        expect(existsMovedFileAfter).toBe(true);
        const movedFileContent = await RNFS.readFile(filePathToMove);
        expect(movedFileContent).toBe(fileContent);
      });

      it('FileSystem: read not existing file - negative case', async function() {
        const textFilePath = `${testRoot}/not_existing_file.txt`;

        try {
          await RNFS.readFile(textFilePath);
          expect('Reading not existing file should fail').toBe(true);
        } catch (error) {
          expect(error.message).toMatch(/^ENOENT: no such file or directory, open/);
          expect(error.code).toBe('ENOENT');
        }
      });

      it('FileSystem: read directory as file - negative case', async function() {
        try {
          await RNFS.readFile(testRoot);
          expect('Reading directory as file should fail').toBe(true);
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it('FileSystem: getFSInfo', async function() {
        const storageSpaceInBytes = 104857600; // 100 MB
        const fsInfo = await RNFS.getFSInfo();

        expect(fsInfo.freeSpace).toBeDefined();
        expect(fsInfo.freeSpace).toBeGreaterThan(0);
        expect(fsInfo.totalSpace).toBeDefined();
        expect(fsInfo.totalSpace).toBeGreaterThan(storageSpaceInBytes);
        expect(fsInfo.totalSpace).toBeGreaterThan(fsInfo.freeSpace);
      });

      it('FileSystem: write the contents to filepath at the given access position', async function() {
        const filePath = `${testRoot}/testFile.txt`;
        const contents = 'Lorem ipsum dolor sit amet';
        const encoding = 'utf8';
        const position = 0;

        await RNFS.write(filePath, contents, position, encoding);
        const content = await RNFS.read(filePath, contents.length, position, encoding);

        expect(content).toBeDefined();
        expect(typeof content).toBe('string');
        expect(content).toEqual(contents);
      });

      it('FileSystem: write the contents to bad filepath at the given access position throw an error', async function() {
        try {
          const filePath = testRoot;
          const contents = 'Lorem ipsum dolor sit amet';
          const encoding = 'utf8';
          const position = 0;

          await RNFS.write(filePath, contents, position, encoding);

          expect('Write in folder should fail').toBe(true);
        } catch (error) {
          expect(error.message).toBeDefined();
          expect(error.message).toMatch(/^ENOENT: error writing file:/);
          expect(error.code).toEqual('ENOENT');
        }
      });

      it('FileSystem: read the contents of file at the given access position', async function() {
        const filePath = `${testRoot}/testFile.txt`;
        const contents = 'Lorem ipsum dolor sit amet';
        const encoding = 'utf8';
        const position = 10;

        await RNFS.write(filePath, contents, 0, encoding);
        const content = await RNFS.read(filePath, contents.length, position, encoding);

        expect(content).toBeDefined();
        expect(typeof content).toBe('string');
        expect(content).toEqual('m dolor sit amet');
      });

      it('FileSystem: read file in chunks', async function() {
        const filePath = `${testRoot}/testFile.txt`;
        const contents = 'Lorem ipsum dolor sit amet';
        const encoding = 'utf8';

        await RNFS.write(filePath, contents, 0, encoding);

        const phrase = [];
        phrase.push(await RNFS.read(filePath, 5, 0, encoding));
        phrase.push(await RNFS.read(filePath, 5, 6, encoding));
        phrase.push(await RNFS.read(filePath, 5, 12, encoding));
        phrase.push(await RNFS.read(filePath, 3, 18, encoding));
        phrase.push(await RNFS.read(filePath, 4, 22, encoding));

        const words = contents.split(' ');

        words.forEach(function(word, index) {
          expect(typeof phrase[index]).toBe('string');
          expect(phrase[index]).toEqual(word);
        });
      });

      it('FileSystem: hash - read file checksum', async function() {
        const filePath = `${testRoot}/testFile.txt`;
        const algorithms = ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512'];
        const checksums = [
          'd41d8cd98f00b204e9800998ecf8427e',
          'da39a3ee5e6b4b0d3255bfef95601890afd80709',
          'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f',
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
          'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
        ];

        await RNFS.writeFile(filePath, '', 'utf8');

        algorithms.forEach(async function(algorithm, index) {
          const checksum = await RNFS.hash(filePath, algorithm);
          expect(typeof checksum).toBe('string');
          expect(checksum).toBe(checksums[index]);
        });
      });

      it('FileSystem: touch - update ctime and mtime', async function() {
        const filePath = `${testRoot}/testFile.txt`;
        const ctime = new Date();
        const mtime = new Date();

        await RNFS.writeFile(filePath, '', 'utf8');
        await RNFS.touch(filePath, mtime, ctime);

        const fileStats = await RNFS.stat(filePath);

        expect(fileStats.mtime).toBeDefined();
        expect(fileStats.mtime instanceof Date).toBe(true);
        if (Platform.OS === 'ios') {
          expect(fileStats.ctime).toBeDefined();
          expect(fileStats.ctime instanceof Date).toBe(true);
        }
      });

    });

    describe('FileSystem platform specific', function() {
      /**
       * Android only - check assets support
       */
      if (Platform.OS === 'android') {
        const assetsTestFilePath = 'testFile.txt';
        const assetsTestFileTextContent = 'this is a test file';

        it('FileSystem: readDirAssets - get list of files in Android Assets directory', async function() {
          const entries = await RNFS.readDirAssets('');
          // DEVNOTE: assets directory can contain more than 1 testing files because of testing files from other suites.
          expect(entries.length).toBeGreaterThan(1);
        });

        it('FileSystem: readFileAssets - read file in Android Assets directory', async function() {
          const fileContent = await RNFS.readFileAssets(assetsTestFilePath);
          expect(fileContent).toBe(assetsTestFileTextContent);
        });

        it('FileSystem: existsAssets, check not existing file in Android Assets directory - negative case', async function() {
          const fileExists = await RNFS.existsAssets('not_existing_file.txt');
          expect(fileExists).toBe(false);
        });

        it('FileSystem: copy file from Android Assets to documents directory, read file content', async function() {
          const destinationPath = `${RNFS.DocumentDirectoryPath}/${assetsTestFilePath}`;

          if (await RNFS.exists(destinationPath)) {
            await RNFS.unlink(destinationPath);
          }

          await RNFS.copyFileAssets(assetsTestFilePath, destinationPath);
          const copiedFileContent = await RNFS.readFile(destinationPath);
          expect(copiedFileContent).toBe(assetsTestFileTextContent);
        });

        xit('FileSystem: existsRes, check existing file in resources', async function() {
          const fileExists = await RNFS.existsRes('ic_launcher_round.png');
          expect(fileExists).toBe(true);
        });

        xit('FileSystem: readFileRes', async function() {
          const fileContent = await RNFS.readFileRes('ic_launcher_round.png');
          expect(fileContent).toEqual('');
        });

        xit('FileSystem: copyFileRes', async function() {
          const destination = `${RNFS.DocumentDirectoryPath}/ic_launcher_round.png`;
          await RNFS.copyFileRes('ic_launcher_round.png', destination);

          const fileExists = await RNFS.existsRes('ic_launcher_round.png');
          const copiedFileExists = await RNFS.exists(destination);

          expect(fileExists).toBe(true);
          expect(copiedFileExists).toBe(true);
        });

        it('FileSystem: scanFile', async function() {
          const pathToScan = `${RNFS.DocumentDirectoryPath}/${assetsTestFilePath}`;
          const uri = await RNFS.scanFile(pathToScan);
          expect(uri).toEqual(pathToScan);
        });

        it('FileSystem: getAllExternalFilesDirs,', async function() {
          const applicationSpecificDirs = await RNFS.getAllExternalFilesDirs();
          expect(typeof applicationSpecificDirs).toBe('object');
          expect(applicationSpecificDirs.length).toBeGreaterThan(0);
        });
      }

      if (Platform.OS === 'ios') {
        it('FileSystem: pathForGroup, should throw an error', async function() {
          try {
            const groupName = 'com.blackberry.bbd.example.cdv.unittest';
            await RNFS.pathForGroup(groupName);

            expect('FileSystem: pathForGroup, should throw an error').toBe(true);
          } catch (error) {
            // DEVNOTE: pathForGroup always return nil
            // https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/interface_g_d_file_manager.html#a336569e3f6b3827dbdbe5a6db543b518
            expect(error).toBeDefined();
            expect(error.message).toContain('ENOENT: no directory for group');
          }
        });

        xit('FileSystem: copyAssetsFileIOS', async function() {
          const imageURI = '';
          const destPath = '';
          const size = 115;

          const pathForGroup = await RNFS.copyAssetsFileIOS(imageURI, destPath, size, size);
          expect(typeof pathForGroup).toBe('string');
          expect(pathForGroup).toBe(0);
        });

        xit('FileSystem: copyAssetsVideoIOS', async function() {
          const imageURI = '';
          const destPath = '';

          const pathForGroup = await RNFS.copyAssetsVideoIOS(imageURI, destPath);
          expect(typeof pathForGroup).toBe('string');
          expect(pathForGroup).toBe(0);
        });
      }

    });

    describe('FileSystem download / upload functionality', function() {
      const testRoot = `${RNFS.DocumentDirectoryPath}/testing_download_dir`;
      const testFilePath = `${testRoot}/testFile.txt`;
      const urls = {
        download: 'http://www.textfiles.com/programming/24hrs.txt',
        upload: {
          put: 'http://httpbin.org/put',
          post: 'http://httpbin.org/post',
        },
        incorrect: 'http://www.incorrect.loc',
      };

      beforeEach(async function() {
        // DEVNOTE: clear FileSystem testing root directory before running each spec
        try {
          await RNFS.unlink(testRoot);
        } catch (error) {
          // console.log('FileSystem: storage had been already cleared or clear error appeared!');
        } finally {
          await RNFS.mkdir(testRoot);
        }
      });

      it('Should download 24hrs.txt file', async function() {
        try {
          const options = {
            fromUrl: urls.download,
            toFile: testFilePath,
            begin: () => {},
            progress: () => {},
          };

          spyOn(options, 'begin');
          spyOn(options, 'progress');

          const downloadTask = RNFS.downloadFile(options);

          expect(typeof downloadTask.jobId).toBe('number');
          expect(downloadTask.jobId).toBeDefined();

          const result = await downloadTask.promise;

          expect(options.begin).toHaveBeenCalled();
          expect(options.progress).toHaveBeenCalled();

          expect(result.jobId).toBeDefined();
          expect(typeof result.jobId).toBe('number');
          expect(result.jobId).toEqual(downloadTask.jobId);
          expect(typeof result.statusCode).toBe('number');
          expect(result.statusCode).toBe(200);
          expect(typeof result.bytesWritten).toBe('number');
          expect(result.bytesWritten).toBeGreaterThan(1);

          expect(await RNFS.exists(testFilePath)).toBe(true);

          const fileContent = await RNFS.readFile(testFilePath, 'utf8');

          expect(fileContent).not.toBeNull();
          expect(fileContent).toContain('From: chuck@eng.umd.edu (Chuck Harris)');
        } catch (error) {
          expect(error).toBeUndefined();
        }
      });

      it('Should cancel downloading process', async function() {
        try {
          const options = {
            fromUrl: urls.download,
            toFile: testFilePath,
          };

          const downloadTask = RNFS.downloadFile(options);

          expect(downloadTask.jobId).toBeDefined();
          expect(typeof downloadTask.jobId).toBe('number');

          RNFS.stopDownload(downloadTask.jobId);

          await downloadTask.promise;
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it('Should throw an error when trying to download from incorrect url', async function() {
        try {
          const options = {
            fromUrl: urls.incorrect,
            toFile: testFilePath,
          };

          const downloadTask = RNFS.downloadFile(options);

          expect(typeof downloadTask.jobId).toBe('number');
          expect(downloadTask.jobId).toBeDefined();

          await downloadTask.promise;
          expect('Downloading file should fail').toBe(true);
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it('Should throw an error when trying to download from correct url to root folder', async function() {
        try {
          const options = {
            fromUrl: urls.download,
            toFile: testRoot,
          };

          const downloadTask = RNFS.downloadFile(options);

          expect(typeof downloadTask.jobId).toBe('number');
          expect(downloadTask.jobId).toBeDefined();

          await downloadTask.promise;
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it('Should upload file to server POST method', async function() {
        try {
          await RNFS.writeFile(testFilePath, 'Some content', 'utf8');

          const files = [{
            name: 'testFile.txt',
            filename: 'testFile',
            filepath: testFilePath,
            filetype: 'text/plain'
          }];

          const options = {
            toUrl: urls.upload.post,
            method: 'POST',
            files,
            begin: () => {},
            progress: () => {}
          };

          spyOn(options, 'begin');
          spyOn(options, 'progress');

          const uploadTask = RNFS.uploadFiles(options);

          expect(typeof uploadTask.jobId).toBe('number');
          expect(uploadTask.jobId).toBeDefined();

          const response = await uploadTask.promise;

          expect(options.begin).toHaveBeenCalled();
          expect(options.progress).toHaveBeenCalled();

          expect(typeof response.statusCode).toBe('number');
          expect(response.statusCode).toBe(200);
          expect(typeof response.headers).toBe('object');
          expect(response.body).toBeDefined();

        } catch (error) {
          expect(error.message).toBeUndefined();
        }
      });

      it('Should upload file to server PUT method', async function() {
        try {
          await RNFS.writeFile(testFilePath, 'Some content', 'utf8');

          const files = [{
            name: 'testFile.txt',
            filename: 'testFile',
            filepath: testFilePath,
            filetype: 'text/plain'
          }];

          const options = {
            toUrl: urls.upload.put,
            method: 'PUT',
            files,
            begin: () => {},
            progress: () => {}
          };

          spyOn(options, 'begin');
          spyOn(options, 'progress');

          const uploadTask = RNFS.uploadFiles(options);

          expect(typeof uploadTask.jobId).toBe('number');
          expect(uploadTask.jobId).toBeDefined();

          const response = await uploadTask.promise;

          expect(options.begin).toHaveBeenCalled();
          expect(options.progress).toHaveBeenCalled();

          expect(typeof response.statusCode).toBe('number');
          expect(response.statusCode).toBe(200);
          expect(typeof response.headers).toBe('object');
          expect(response.body).toBeDefined();

        } catch (error) {
          expect(error.message).toBeUndefined();
        }
      });

      it('Should upload multiple files to server POST method', async function() {
        try {
          const files = [
            {
              name: 'simpleFile.txt',
              filename: 'simpleFile',
              filepath: `${testRoot}/simpleFile.txt`,
              filetype: 'text/plain',
              content: '3$6@%^&'
            },
            {
              name: 'image.png',
              filename: 'image',
              filepath: `${testRoot}/image.png`,
              filetype: 'application/zip',
              content: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
            },
            {
              name: 'binary.zip',
              filename: 'binary',
              filepath: `${testRoot}/binary.zip`,
              filetype: 'image/png',
              content: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
            }
          ];

          files.forEach(async function({ filepath, content }) {
            await RNFS.writeFile(filepath, content, 'utf8');
          });

          const options = {
            toUrl: urls.upload.post,
            method: 'POST',
            files,
            begin: () => {},
            progress: () => {}
          };

          spyOn(options, 'begin');
          spyOn(options, 'progress');

          const uploadTask = RNFS.uploadFiles(options);

          expect(typeof uploadTask.jobId).toBe('number');
          expect(uploadTask.jobId).toBeDefined();

          const response = await uploadTask.promise;

          expect(options.begin).toHaveBeenCalled();
          expect(options.progress).toHaveBeenCalled();

          expect(typeof response.statusCode).toBe('number');
          expect(response.statusCode).toBe(200);
          expect(typeof response.headers).toBe('object');
          expect(response.body).toBeDefined();

        } catch (error) {
          expect(error.message).toBeUndefined();
        }
      });


      it('Should throw an error on uploading not existing file', async function() {
        try {
          const files = [{
            name: 'testFile.txt',
            filename: 'testFile',
            filepath: testFilePath,
            filetype: 'text/plain'
          }];

          const options = {
            toUrl: urls.upload.post,
            method: 'POST',
            files,
            begin: () => {},
            progress: () => {}
          };

          spyOn(options, 'begin');
          spyOn(options, 'progress');

          const uploadTask = RNFS.uploadFiles(options);

          expect(typeof uploadTask.jobId).toBe('number');
          expect(uploadTask.jobId).toBeDefined();

          await uploadTask.promise;
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it('Should throw an error when trying to upload to incorrect server', async function() {
        try {
          await RNFS.writeFile(testFilePath, 'Some content', 'utf8');

          const files = [{
            name: 'testFile.txt',
            filename: 'testFile',
            filepath: testFilePath,
            filetype: 'text/plain'
          }];

          const options = {
            toUrl: urls.incorrect,
            method: 'POST',
            files
          };

          const uploadTask = RNFS.uploadFiles(options);

          expect(typeof uploadTask.jobId).toBe('number');
          expect(uploadTask.jobId).toBeDefined();

          await uploadTask.promise;

          expect('Uploading file should fail').toBe(true);
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      if (Platform.OS === 'ios') {
        it('Should cancel uploading process (iOS only)', async function() {
          try {
            await RNFS.writeFile(testFilePath, 'Some content', 'utf8');

            const files = [{
              name: 'testFile.txt',
              filename: 'testFile',
              filepath: testFilePath,
              filetype: 'text/plain'
            }];

            const options = {
              toUrl: urls.upload.post,
              method: 'POST',
              files
            };

            const uploadTask = RNFS.uploadFiles(options);

            expect(uploadTask.jobId).toBeDefined();
            expect(typeof uploadTask.jobId).toBe('number');

            RNFS.stopUpload(uploadTask.jobId);
            await uploadTask.promise;
          } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toBe('cancelled');
          }
        });
      }

    });
  });

};
