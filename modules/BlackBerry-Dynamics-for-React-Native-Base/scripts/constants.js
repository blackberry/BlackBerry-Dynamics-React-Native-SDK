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

const { join } = require('./utils');

const updatePodsCommand = '\t\tsystem("node ../node_modules/BlackBerry-Dynamics-for-React-Native-Base' +
  '/scripts/updatePods.js")\n';

const podPlatformPatternVersion = /platform :ios, '([0-9\.]+)'/;
const podPlatformPatternVersionSupported = /platform :ios, min_ios_version_supported/;
const podPlatformVersion = 'platform :ios, \'15.0\'';
const minIOSVersionSupportedString = 'min_ios_version_supported';

const bbdPodCommand = 'pod \'BlackBerryDynamics\', ' +
  ':podspec => \'https://software.download.blackberry.com/repository/framework/dynamics/ios/12.0.1.79/BlackBerryDynamics-12.0.1.79.podspec\'\n';

const bbdPodTemplate = /pod 'BlackBerryDynamics', (:podspec|:path) => '(.+)'/;

const postInstall = 'post_install do |installer|';

const enabledFlipper = '  use_flipper!()';
const enabledFlipperNewSyntaxRn70x = ':flipper_configuration => FlipperConfiguration.enabled,';
const enabledFlipperNewSyntaxRn71x = ':flipper_configuration => flipper_config,';

const disabledFlipperHeader = join(
  `#\n`,
  `    # Flipper cannot be used together with BlackBerry Dynamics SDK for React Native on iOS\n`,
  `    # in debug configuration as it disables some BlackBerry Dynamics functionality\n`,
  `    # related to secure networking.\n`
);

const disabledFlipper = join(
  disabledFlipperHeader,
  '  # use_flipper!()'
);

const disabledFlipperNewSyntaxRn70x =  join(
  disabledFlipperHeader,
 `  # :flipper_configuration => FlipperConfiguration.enabled,`
);

const disabledFlipperNewSyntaxRn71x =  join(
  disabledFlipperHeader,
 `    # :flipper_configuration => flipper_config,`
);

const bbdReactActivityDelegateString = `protected BBDReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends BBDReactActivityDelegate {
    public MainActivityDelegate(BBDReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
`;
const originalReactActivityDelegateRn71String = `protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }
}
`;
const originalReactActivityDelegateRn72String = `protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
`;

const mavenLocal = 'mavenLocal()';
const mavenCentral = 'mavenCentral {';
const androidBuildToolsGradleTemplate = /com.android.tools.build:gradle:[0-9].[0-9].[0-9]/g;
const bbdMavenString = `maven {
          apply from: "$rootDir/../node_modules/BlackBerry-Dynamics-for-React-Native-Base/android/helper.gradle"
          url getBbdMavenLocation
      }
`;
const allprojectsMaven = ` allprojects {
   repositories {
      ${bbdMavenString}
   }
}`;
const bbdDependenciesString =`apply from: "$rootDir/../node_modules/BlackBerry-Dynamics-for-React-Native-Base/android/gd.gradle"\n`;
const bbdLifeCycleCall = '\n\tBBDLifeCycle.getInstance().initialize(this);\n';
const bbdLifeCycleImport = '\nimport com.blackberry.bbd.reactnative.core.BBDLifeCycle;\n';
const bbdReactActivityDelegateImport = '\nimport com.blackberry.bbd.reactnative.core.BBDReactActivityDelegate;\n';
const bbdReactActivityImport = '\nimport com.blackberry.bbd.reactnative.core.BBDReactActivity;\n';
const reactViewImport = '\nimport com.facebook.react.ReactRootView;\n';


const initializeFlipperRn70xString = ' initializeFlipper';
const commentedInitializeFlipperRn70xString = `//${initializeFlipperRn70xString}`;

const initializeFlipperRn71xPlusString = 'ReactNativeFlipper.initializeFlipper';
const commentedInitializeFlipperRn71xPlusString = `// ${initializeFlipperRn71xPlusString}`;

module.exports = {
  updatePodsCommand,
  bbdPodCommand,
  bbdPodTemplate,
  podPlatformPatternVersion,
  podPlatformPatternVersionSupported,
  minIOSVersionSupportedString,
  podPlatformVersion,
  postInstall,
  enabledFlipper,
  disabledFlipper,
  enabledFlipperNewSyntax: enabledFlipperNewSyntaxRn70x,
  disabledFlipperNewSyntax: disabledFlipperNewSyntaxRn70x,
  enabledFlipperNewSyntaxRn71x,
  disabledFlipperNewSyntaxRn71x,
  bbdReactActivityDelegateString,
  originalReactActivityDelegateRn71String,
  originalReactActivityDelegateRn72String,
  mavenLocal,
  mavenCentral,
  androidBuildToolsGradleTemplate,
  bbdMavenString,
  allprojectsMaven,
  bbdDependenciesString,
  bbdLifeCycleCall,
  bbdLifeCycleImport,
  bbdReactActivityDelegateImport,
  bbdReactActivityImport,
  reactViewImport,
  initializeFlipperRn70xString,
  commentedInitializeFlipperRn70xString,
  initializeFlipperRn71xPlusString,
  commentedInitializeFlipperRn71xPlusString
};
