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

  PRODUCT_ID = BbdRNProject.get_product_bundle_id

  GD_ASSETS_BUNDLE = File.expand_path('~/Library/Application Support/BlackBerry/Good.platform/iOS/Frameworks/GD.framework/Versions/A/Resources/GDAssets')
  GD_FIPS_LD = File.expand_path('~/Library/Application Support/BlackBerry/Good.platform/iOS/FIPS_module/$FIPS_PACKAGE/bin/gd_fipsld')

  BUILD_FILES_TO_REMOVE = [
    'GD.framework',
    'WebKit.framework',
    'LocalAuthentication.framework',
    'DeviceCheck.framework',
    'CFNetwork.framework',
    'CoreData.framework',
    'CoreTelephony.framework',
    'QuartzCore.framework',
    'Security.framework',
    'MessageUI.framework',
    'SystemConfiguration.framework',
    'MobileCoreServices.framework',
    'CoreGraphics.framework',
    'AssetsLibrary.framework',
    'SafariServices.framework',
    'libz.tbd'
  ]

  BUILD_CONFIGS = {
    'FIPS_PACKAGE'    => '$(CURRENT_ARCH).sdk',
    'LDPLUSPLUS'      => GD_FIPS_LD,
    'LD'              => GD_FIPS_LD
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
    }
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
    restore_plist
    restore_xcodeproj
  end

  private

  def restore_plist
    @plist.delete_if {|key, value| PLIST_CONFIG.has_key?(key)}

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

  def restore_xcodeproj

    # remove frameworks
    @native_target.frameworks_build_phase.files.objects.each do |bf|
      if BUILD_FILES_TO_REMOVE.include? bf.display_name 
        @native_target.frameworks_build_phase.remove_build_file(bf)
      end
    end
    frameworks_group = @xcodeproj.groups.select do |group|
      group.name == 'Frameworks'
    end.first
    frameworks_group.children.objects.each do |el|
      if el.display_name == 'iOS'
        el.remove_from_project
      end
    end

    # remove group and reference to GDAssets.bundle
    app_group = @xcodeproj.groups.select do |group|
      group.name == @product_name
    end.first
    app_group.children.objects.each do |el|
      if el.display_name == 'GDAssets.bundle'
        el.remove_from_project
      end
    end
    @native_target.resources_build_phase.files.objects.each do |res|
      if res.display_name == 'GDAssets.bundle' 
        @native_target.resources_build_phase.remove_build_file(res)
      end
    end

    # remove build configuration
    @native_target.build_configurations.each do |configuration|
      configuration.build_settings.delete_if {|key, value| BUILD_CONFIGS.has_key?(key)}
    end
    
    @xcodeproj.save
  end
end

react_native_project = BbdRNProject.new
react_native_project.prepare_project
