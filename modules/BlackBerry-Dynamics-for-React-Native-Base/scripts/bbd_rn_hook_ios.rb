#!/usr/bin/env ruby
#
# Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

require 'xcodeproj'
require 'plist'
require 'json'

class BbdRNProject
  def self.get_product_bundle_id
    ARGV && ARGV.length >= 2 ? ARGV[1] : '$(PRODUCT_BUNDLE_IDENTIFIER)'
  end

  DEFAULT_PRODUCT_ID = '$(PRODUCT_BUNDLE_IDENTIFIER)'
  PRODUCT_ID = BbdRNProject.get_product_bundle_id

  GD_ASSETS_BUNDLE = File.expand_path('~/Library/Application Support/BlackBerry/Good.platform/iOS/Frameworks/GD.framework/Versions/A/Resources/GDAssets')
  GD_FIPS_LD = File.expand_path('~/Library/Application Support/BlackBerry/Good.platform/iOS/FIPS_module/$FIPS_PACKAGE/bin/gd_fipsld')

  FRAMEWORKS = [
    'GD',
    'WebKit',
    'LocalAuthentication',
    'DeviceCheck',
    'CFNetwork',
    'CoreData',
    'CoreTelephony',
    'QuartzCore',
    'Security',
    'MessageUI',
    'SystemConfiguration',
    'MobileCoreServices',
    'CoreGraphics',
    'AssetsLibrary',
    'SafariServices'
  ]

  TBD_LIBS = ['z']

  BUILD_CONFIGS = {
    'FIPS_PACKAGE'    => '$(CURRENT_ARCH).sdk',
    'LDPLUSPLUS'      => GD_FIPS_LD,
    'LD'              => GD_FIPS_LD,
    'ENABLE_BITCODE'  => 'NO'
  }

  PLIST_CONFIG = {
    "GDApplicationID"          => PRODUCT_ID,
    "GDApplicationVersion"     => '1.0.0.0',
    "NSFaceIDUsageDescription" => 'Enable authentication without a password.',
    "CFBundleURLTypes"         => [{
      "CFBundleURLName"        => PRODUCT_ID,
      "CFBundleURLSchemes"     => [
        "#{PRODUCT_ID}.sc2.1.0.0.0",
        "#{PRODUCT_ID}.sc2",
        "#{PRODUCT_ID}.sc3.1.0.0.0",
        "#{PRODUCT_ID}.sc3",
        'com.good.gd.discovery'
      ]
    }],
    "BlackBerryDynamics"       => {
      "CheckEventReceiver"     => false
    },
    "CFBundleIdentifier"       => PRODUCT_ID
  }

  attr_reader :product_name
  attr_reader :product_id

  def initialize
    rn_project_path = ENV['INIT_CWD'] || Dir.pwd
    rn_project_json = JSON.load File.open "#{rn_project_path}/package.json"
    @product_name = rn_project_json['name']
    @xcodeproj = Xcodeproj::Project.open("#{rn_project_path}/ios/#{@product_name}.xcodeproj")
    @plist_path = "#{rn_project_path}/ios/#{@product_name}/Info.plist"
    @plist = Plist.parse_xml @plist_path
    @native_target = get_native_target

    @product_id = get_product_bundle_id
  end

  public

  def prepare_project
    patch_plist
    patch_xcodeproj
  end

  def set_product_bundle_id (product_id)
    @native_target.build_configurations.each do |configuration|
      configuration.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = product_id
    end
  end

  private

  def patch_plist
    @plist.merge! PLIST_CONFIG

    File.open(@plist_path, 'w') do |file|
      file.write @plist.to_plist
    end
  end

  def get_native_target
    @xcodeproj.targets.select do |target|
      target.name == @product_name
    end.first
  end

  def get_product_bundle_id
    @native_target.build_configurations.first.build_settings['PRODUCT_BUNDLE_IDENTIFIER']
  end

  def patch_xcodeproj
    unless PRODUCT_ID == DEFAULT_PRODUCT_ID
      set_product_bundle_id PRODUCT_ID
    end

    @native_target.add_system_frameworks FRAMEWORKS
    @native_target.add_system_libraries_tbd TBD_LIBS

    @native_target.build_configurations.each do |configuration|
      configuration.build_settings.merge! BUILD_CONFIGS
    end

    app_group = @xcodeproj.groups.select do |group|
      group.name == @product_name
    end.first

    if app_group.files.select do |file|
      file.name == 'GDAssets.bundle'
    end.empty? then
      gdAssetsFileRef = Xcodeproj::Project::Object::FileReferencesFactory.new_bundle(app_group, GD_ASSETS_BUNDLE)

      @native_target.add_resources([gdAssetsFileRef])
    end
    @xcodeproj.save
  end
end

class String
  def green
    "\e[32m#{self}\e[0m"
  end
end

react_native_project = BbdRNProject.new
react_native_project.prepare_project
