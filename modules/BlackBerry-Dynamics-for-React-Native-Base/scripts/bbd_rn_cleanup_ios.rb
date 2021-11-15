#!/usr/bin/env ruby
#
# Copyright (c) 2021 BlackBerry Limited. All Rights Reserved.
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
require 'fileutils'

class BbdRNProject
  def self.get_product_bundle_id
    ARGV && ARGV.length >= 2 ? ARGV[1] : '$(PRODUCT_BUNDLE_IDENTIFIER)'
  end

  PRODUCT_ID = BbdRNProject.get_product_bundle_id

  LIBRARY_SEARCH_PATHS = '$(SDK_DIR)/usr/lib/swift $(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME) $(inherited)'
  LD_RUNPATH_SEARCH_PATHS = '@executable_path/Frameworks'

  BUILD_FILES_TO_REMOVE = [
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
    'AuthenticationServices.framework',
    'libz.tbd',
    'libnetwork.tbd'
  ]

  BUILD_CONFIGS_TO_BE_DELETED = {
    'LIBRARY_SEARCH_PATHS' => LIBRARY_SEARCH_PATHS
  }

  BUILD_CONFIGS_TO_BE_RESTORED = {
    'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES' => 'NO',
    'LD_RUNPATH_SEARCH_PATHS'               => LD_RUNPATH_SEARCH_PATHS,
    'VALIDATE_WORKSPACE'                    => 'NO'
  }

  PLIST_CONFIG = {
    "GDApplicationID"          => PRODUCT_ID,
    "GDApplicationVersion"     => '1.0.0.0',
    "NSFaceIDUsageDescription" => 'Enable authentication without a password.',
    "NSCameraUsageDescription" => 'Allow camera usage to scan a QR code',
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
    @rn_project_path = ENV['INIT_CWD'] || Dir.pwd
    rn_project_json = JSON.load File.open "#{@rn_project_path}/package.json"
    @product_name = rn_project_json['name']
    @rn_version = rn_project_json['dependencies']['react-native']
    @xcodeproj = Xcodeproj::Project.open("#{@rn_project_path}/ios/#{@product_name}.xcodeproj")
    @development_tools_json_path = "#{@rn_project_path}/ios/#{@product_name}/Resources/development-tools-info.json"
    @plist_path = "#{@rn_project_path}/ios/#{@product_name}/Info.plist"
    @plist = Plist.parse_xml @plist_path
    @native_target = get_native_target

    @product_id = get_product_bundle_id
  end

  public

  def prepare_project
    restore_plist
    restore_xcodeproj
    remove_react_native_info
  end

  private

  def restore_plist
    @plist.delete_if {|key, value| PLIST_CONFIG.has_key?(key)}

    File.open(@plist_path, 'w') do |file|
      file.write @plist.to_plist
    end
  end

  def get_native_target
    target = @xcodeproj.targets.select do |target|
      target.name == @product_name
    end.first
    if target.nil? then
      target = @xcodeproj.targets.select.first
      @product_name = target.name
    end

    target
  end

  def get_product_bundle_id
    @native_target.build_configurations.first.build_settings['PRODUCT_BUNDLE_IDENTIFIER']
  end

  def remove_react_native_info
    File.delete(@development_tools_json_path) if File.exist?(@development_tools_json_path)
  end

  def restore_storyboard
    root = "#{@rn_project_path}/ios/#{@product_name}"
    path_to_backup = File.expand_path("#{root}/LaunchScreen-backup.storyboard")
    path_to_storyboard = File.expand_path("#{root}/LaunchScreen.storyboard")
    xcassets = File.expand_path("#{root}/Images.xcassets")
    xcassets_backup = File.expand_path("#{root}/Images-backup.xcassets")

    if File.exist?(path_to_backup)
      File.open(path_to_backup) do |backup_file|
        content = backup_file.read
        File.open(path_to_storyboard, "w") do |origin_file|
          origin_file.write(content)
        end
      end

      File.delete(path_to_backup)
    end

    # Images.xcassets
    if File.exists?(xcassets_backup)
      FileUtils.rm_rf xcassets if File.exists? xcassets
      File.rename xcassets_backup, xcassets
    end
  end

  def remove_localization(group)
    localization_group_name = "InfoPlist.strings"

    group.children.objects.each do |item|
      if item.display_name == localization_group_name
        item.clear
        item.remove_from_project
      end
    end
  end

  def restore_xcodeproj
    # remove frameworks
    @native_target.frameworks_build_phase.files.objects.each do |bf|
      if BUILD_FILES_TO_REMOVE.include? bf.display_name
        @native_target.frameworks_build_phase.remove_build_file(bf)
      end
    end

    # remove group and reference to development-tools-info.json
    app_group = @xcodeproj.groups.select do |group|
      group.name == @product_name
    end.first
    app_group.children.objects.each do |el|
      if el.display_name == 'development-tools-info.json'
        el.remove_from_project
      end
    end
    @native_target.resources_build_phase.files.objects.each do |res|
      if res.display_name == 'development-tools-info.json'
        @native_target.resources_build_phase.remove_build_file(res)
      end
    end

    # remove some build configuration
    @native_target.build_configurations.each do |configuration|
      configuration.build_settings.delete_if {|key, value| BUILD_CONFIGS_TO_BE_DELETED.has_key?(key)}
    end

    # for 0.62 and higher versions of RN we do not add 'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES' option to xcconfig
    # so we do not need to undo it
    BUILD_CONFIGS_TO_BE_RESTORED.delete('ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES')
    BUILD_CONFIGS_TO_BE_RESTORED.delete('LD_RUNPATH_SEARCH_PATHS')

    # restore some build configuration to default value
    @native_target.build_configurations.each do |configuration|
      configuration.build_settings.merge! BUILD_CONFIGS_TO_BE_RESTORED
    end

    # restore origin storyboard
    restore_storyboard

    remove_localization app_group

    @xcodeproj.save
  end
end

react_native_project = BbdRNProject.new
react_native_project.prepare_project
