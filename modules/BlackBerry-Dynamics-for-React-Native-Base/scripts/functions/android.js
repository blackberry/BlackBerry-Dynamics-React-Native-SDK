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
const fs = require('fs');
const path = require('path');
const constants = require('../constants');

const addBbdDependencies = (fileContent) => {
   if (fileContent.includes(constants.bbdDependenciesString)) {
      return fileContent;
   }

   return fileContent.replace(
      'dependencies {',
      'dependencies {\n\t' + constants.bbdDependenciesString
   );
};
const removeBbdDependencies = (fileContent) => {
   if (!fileContent.includes(constants.bbdDependenciesString)) {
      return fileContent;
   }

   return fileContent.replace(
      'dependencies {\n\t' + constants.bbdDependenciesString,
      'dependencies {'
   );
};

const addImportLineInJavaFile = (importLine, fileContent) => {
   const indexOfFirstImport = fileContent.indexOf('\nimport ');
   const beforeFirstImportPart = fileContent.substr(0, indexOfFirstImport);
   const firstImportPartAndRest = fileContent.substr(beforeFirstImportPart.length, fileContent.length);

   if (fileContent.indexOf(importLine) >= 0) {
      return fileContent;
   }

   return beforeFirstImportPart + importLine + firstImportPartAndRest;
};
const removeImportLineInJavaFile = (importLine, fileContent) => fileContent.replace(importLine, '');

const updateExtendsClassInMainActivity = (fileContent) => fileContent.replace(
   /extends ReactActivity/gi,
   'extends BBDReactActivity'
);
const restoreExtendsClassInMainActivity = (fileContent) => fileContent.replace(
   /extends BBDReactActivity/gi,
   'extends ReactActivity'
);

const updateReactActivityDelegateUsage = (fileContent) => fileContent.replace(
   / ReactActivityDelegate/gi,
   ' BBDReactActivityDelegate'
);
const restoreReactActivityDelegateUsage = (fileContent) => fileContent.replace(
   / BBDReactActivityDelegate/gi,
   ' ReactActivityDelegate'
);

const updateReactActivityUsage = (fileContent) => {
   const str = 'BBDReactActivity activity';
   if (fileContent && fileContent.indexOf(str) < 0) {
     return fileContent.replace('ReactActivity activity', str);
   }
   return fileContent;
};
const restoreReactActivityUsage = (fileContent) => fileContent.replace(
   'BBDReactActivity activity',
   'ReactActivity activity'
);

const commentFlipperForRn70x = (fileContent) => {
   if (fileContent && fileContent.indexOf(constants.commentedInitializeFlipperRn70xString) < 0) {
      return fileContent.replace(
         constants.initializeFlipperRn70xString,
         constants.commentedInitializeFlipperRn70xString
      );
   }

   return fileContent;
};
const unCommentFlipperForRn70x = (fileContent) => {
   if (fileContent && fileContent.indexOf(constants.commentedInitializeFlipperRn70xString) >= 0) {
      return fileContent.replace(
         constants.commentedInitializeFlipperRn70xString,
         constants.initializeFlipperRn70xString
      );
   }

   return fileContent;
};

const commentFlipperForRn71xPlus = (fileContent) => {
   if (fileContent && fileContent.indexOf(constants.commentedInitializeFlipperRn71xPlusString) < 0) {
      return fileContent.replace(
         constants.initializeFlipperRn71xPlusString,
         constants.commentedInitializeFlipperRn71xPlusString
      );
   }

   return fileContent;
};
const unCommentFlipperForRn71xPlus = (fileContent) => {
   if (fileContent && fileContent.indexOf(constants.commentedInitializeFlipperRn71xPlusString) >= 0) {
      return fileContent.replace(
         constants.commentedInitializeFlipperRn71xPlusString,
         constants.initializeFlipperRn71xPlusString
      );
   }

   return fileContent;
};

const updateOnCreateInMainApplication = (fileContent) => {
   const indexOfOnCreate = fileContent.indexOf('public void onCreate() {');
   const indexOfSuperOnCreateCall = fileContent.indexOf('super.onCreate();', indexOfOnCreate);
   const indexOfAfterSuperOnCreateCall = fileContent.indexOf('\n', indexOfSuperOnCreateCall);
   const beforeSuperOnCreateCall = fileContent.substr(0, indexOfAfterSuperOnCreateCall + 1);
   const afterSuperOnCreateCall = fileContent.substr(indexOfAfterSuperOnCreateCall, fileContent.length);

   if (fileContent.indexOf(constants.bbdLifeCycleCall) >= 0) {
      return fileContent;
   }

   return beforeSuperOnCreateCall + constants.bbdLifeCycleCall + afterSuperOnCreateCall;
}

const restoreOnCreateInMainApplication = (fileContent) => fileContent.replace(constants.bbdLifeCycleCall, '');

const updatePackageNameInJavaFile = (updatedPackageName, fileContent) => {
   const startIndexOfPackageName = fileContent.indexOf(' ', fileContent.indexOf('package ')) + 1;
   const endIndexOfPackageName = fileContent.indexOf(';', startIndexOfPackageName);
   const packageName = fileContent.substring(startIndexOfPackageName, endIndexOfPackageName);

   return fileContent.replace(packageName, updatedPackageName);
};

// For RN > 0.71
const renameReactActivityDelegate = (fileContent) => {
   // Return if it doesn't contain string used in RN > 0.70
   if (!fileContent.includes('return new DefaultReactActivityDelegate')) {
     return fileContent;
   }

   return fileContent.replace(
     /(protected BBDReactActivityDelegate createReactActivityDelegate)(.|\n)*}/gm,
     constants.bbdReactActivityDelegateString
   );
};
const restoreReactActivityDelegateCodeForRnHigherThan70 = (rnVersion, fileContent) => {
   // Return if it contains string used in RN < 0.71
   if (!fileContent.includes('return new MainActivityDelegate(this, getMainComponentName());')) {
      return fileContent;
   }

   let originalReactActivityDelegateString = '';

   switch(rnVersion) {
      case 71:
         originalReactActivityDelegateString = constants.originalReactActivityDelegateRn71String;
         // Remove ReactRootView import used only on RN < 0.71
         fileContent = fileContent.replace(constants.reactViewImport, '');
         break;
      case 72:
         originalReactActivityDelegateString = constants.originalReactActivityDelegateRn72String;
         // Remove ReactRootView import used only on RN < 0.71
         fileContent = fileContent.replace(constants.reactViewImport, '');
         break;
      default:
         originalReactActivityDelegateString = constants.originalReactActivityDelegateRn71String;
   }

   return fileContent.replace(
      constants.bbdReactActivityDelegateString,
      originalReactActivityDelegateString
   );
};

const addMavenStringForRnHigherThan71 = (content) => {
   if (content.indexOf('allprojects') < 0) {
     return content += constants.allprojectsMaven
   }
   return content;
};

const flipperUpdater = ((list) => {
   const entryWithFinalKeyword = (entry) => 'final ' + entry;

   let rnFlipperFileContent = null;

   const add = (rnFlipperFilePath) => {
      rnFlipperFileContent = fs.readFileSync(rnFlipperFilePath, 'utf-8');

      list.forEach((entry) => {
         if (rnFlipperFileContent.includes(entryWithFinalKeyword(entry))) {
            return;
         };

         rnFlipperFileContent = rnFlipperFileContent.replace(entry, entryWithFinalKeyword(entry));
      });

      fs.writeFileSync(rnFlipperFilePath, rnFlipperFileContent, 'utf-8');
   };

   const remove = (rnFlipperFilePath) => {
      rnFlipperFileContent = fs.readFileSync(rnFlipperFilePath, 'utf-8');

      list.forEach((entry) => {
         if (rnFlipperFileContent.includes(entryWithFinalKeyword(entry))) {
            rnFlipperFileContent = rnFlipperFileContent.replace(entryWithFinalKeyword(entry), entry);
         };
      });

      fs.writeFileSync(rnFlipperFilePath, rnFlipperFileContent, 'utf-8');
   };

   return { add, remove };
})([
   'ReactInstanceManager reactInstanceManager',
   'NetworkFlipperPlugin networkFlipperPlugin'
]);

const updateFinalFromRnFlipperClass = (androidSrcDebugPath, command) => {
   const finder = require('findit')(androidSrcDebugPath);
   const rnFlipperFileName = 'ReactNativeFlipper.java';

   const action = (filePath) => {
      if (filePath.includes(rnFlipperFileName)) {
         command(filePath);
      }
   };

   finder.on('file', action);
};

const getPackageNameFromAndroidManifest = (pathToAndroidManifest) => {
   let androidManifestContent = fs.readFileSync(pathToAndroidManifest, 'utf-8');

   if (androidManifestContent.indexOf('package=') < 0)
      return false;

   const startIndexOfPackageString = androidManifestContent.indexOf(
         '"', androidManifestContent.indexOf('package=')
      ) + 1,
      endIndexOfPackageString = androidManifestContent.indexOf('"', startIndexOfPackageString);

   return androidManifestContent.substring(startIndexOfPackageString, endIndexOfPackageString);
};

const getProjectPackageName = (androidProjectRoot) => {
   const projectAndroidMainPath = path.join(androidProjectRoot, 'app', 'src', 'main'),
      projectAndroidManifestPath = path.join(projectAndroidMainPath, 'AndroidManifest.xml'),
      appBuildGradlePath = path.join(androidProjectRoot, 'app', 'build.gradle');

   // read from AndroidManifest.xml
   const bundleIDFromManifest = getPackageNameFromAndroidManifest(projectAndroidManifestPath);

   if (bundleIDFromManifest) {
      return bundleIDFromManifest;
   }

   // read from android/app/build.gradle
   const gradleFileContent = fs.readFileSync(appBuildGradlePath, 'utf8'),
      bundleIDFromGradle = gradleFileContent.match(/applicationId\s+['"](.+)['"]/)[1];

   if (bundleIDFromGradle) {
      return bundleIDFromGradle;
   }
}

module.exports = {
   addBbdDependencies,
   removeBbdDependencies,
   addImportLineInJavaFile,
   removeImportLineInJavaFile,
   updateExtendsClassInMainActivity,
   restoreExtendsClassInMainActivity,
   updateReactActivityDelegateUsage,
   restoreReactActivityDelegateUsage,
   updateReactActivityUsage,
   restoreReactActivityUsage,
   updateOnCreateInMainApplication,
   restoreOnCreateInMainApplication,
   updatePackageNameInJavaFile,
   renameReactActivityDelegate,
   restoreReactActivityDelegateCodeForRnHigherThan70,
   addMavenStringForRnHigherThan71,
   updateFinalFromRnFlipperClass,
   flipperUpdater,
   getProjectPackageName,
   commentFlipperForRn70x,
   unCommentFlipperForRn70x,
   commentFlipperForRn71xPlus,
   unCommentFlipperForRn71xPlus
}
