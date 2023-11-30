## FileSystem sample application
> FileSystem sample application shows example of using secure FileSystem instance in React Native application. It demonstrates how to manage files/directories and how to upload/download files.

#### How to prepare the app
Open the sample app directory in Terminal window:
`$ cd <path>/SampleApplications/FileSystem`

Install dependencies:
`$ yarn`

> NOTE: FileSystem sample is based on `0.70.0` version of React Native. There is a possibility to upgrade to `0.70.x`, `0.71.x`, `0.72.x` versions (`0.70.1` - `0.70.10`, `0.71.0` - `0.71.13`, `0.72.0` - `0.72.4`) by running one of following commands:
`$ npx react-native upgrade 0.70.x`
for example:
`$ npx react-native upgrade 0.70.10`
or
`$ npx react-native upgrade 0.71.13`
or
`$ npx react-native upgrade 0.72.4`

Generate ios and android directories:
`$ npx react-native eject`

> There is a known issue with loading Metro server on `0.72.0` and `0.72.1` versions when the error message is displayed during app load in Metro server: "Cannot read properties of undefined (reading 'addHelper')". The issue can be fixed by adding the following devDependency to the project:
`$ yarn add @babel/traverse@7.22.8 --dev`  

## Dynamics modules
#### Prerequisites
There are some dependencies that need to be installed before using `BlackBerry-Dynamics-for-React-Native-Base` module. More information can be found [here](https://github.com/blackberry/BlackBerry-Dynamics-React-Native-SDK/tree/master/modules/BlackBerry-Dynamics-for-React-Native-Base#Preconditions).

#### How to integrate Dynamics into application
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base

> Integrates Dynamics based on your current identifiers - iOS Bundle ID and Android Package Name.

	$ yarn set-bundle-id (Optional step, but required for sample applications)

> Allows to update an identifier (required) and name (optional) for your application. This identifier is your iOS Bundle ID or Android Package Name. It will also be used as the Entitlement ID for entitling and activating your application with the BlackBerry UEM management console.

#### How to secure FileSystem
	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem

##### Android

> NOTE: for Android, `BlackBerry-Dynamics-for-React-Native-FileSystem` is dependent on `BlackBerry-Dynamics-for-React-Native-Networking` module and you need to install `BlackBerry-Dynamics-for-React-Native-Networking` first.

	$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking

##### iOS
Different `ruby` versions might be install on the machine. Especially it is related to React Native v`0.70.x` projects.
Depending on your Mac configuration following error can occur when running `pod install` command:
```
Traceback (most recent call last):
	4: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/ruby_executable_hooks:22:in `<main>'
	3: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/ruby_executable_hooks:22:in `eval'
	2: from /Users/vtaliar/.rvm/gems/ruby-2.7.5/bin/pod:23:in `<main>'
	1: from /Users/vtaliar/.rvm/rubies/ruby-2.7.5/lib/ruby/2.7.0/rubygems.rb:296:in `activate_bin_path'
/Users/vtaliar/.rvm/rubies/ruby-2.7.5/lib/ruby/2.7.0/rubygems.rb:277:in `find_spec_for_exe': can't find gem cocoapods (>= 0.a) with executable pod (Gem::GemNotFoundException)
```
More details can be found [here](https://medium.com/@pk60905/bundle-install-and-bundle-update-80f3d6f52214).

`$ bundle install` - needed on some `0.70.x` versions to fix the issue above  
`$ cd ios`
`$ pod install`
`$ cd ..`

#### How to run application
##### iOS
`$ npx react-native run-ios`

##### Android
`$ npx react-native run-android`

#### Examples of usage
##### 0.70.0
`$ cd <path>/SampleApplications/FileSystem`  
`$ yarn`  
`$ git init`  
`$ npx react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`  
For iOS:  
`$ bundle install`  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`  
##### 0.70.10
`$ cd <path>/SampleApplications/FileSystem`  
`$ yarn`  
`$ git init`  
`$ npx react-native upgrade 0.70.10`  
`$ npx react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`  
##### 0.72.0
`$ cd <path>/SampleApplications/FileSystem`  
`$ yarn`  
`$ yarn add @babel/traverse@7.22.8 --dev` - OPTIONAL: needed on `0.72.0`, `0.72.1` versions to fix the error mentioned above in Metro server  
`$ git init`  
`$ npx react-native upgrade 0.72.0`  
`$ npx react-native eject`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Base`  
`$ yarn set-bundle-id`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-Networking`  
`$ yarn add <path>/modules/BlackBerry-Dynamics-for-React-Native-FileSystem`  
For iOS:  
`$ cd ios`  
`$ pod install`  
`$ cd ..`  
`$ npx react-native run-ios`  
For Android:  
`$ npx react-native run-android`  
