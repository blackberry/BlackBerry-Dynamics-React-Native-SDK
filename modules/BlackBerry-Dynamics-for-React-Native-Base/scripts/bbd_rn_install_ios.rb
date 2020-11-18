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
require 'fileutils'

class BbdRNProject
  def self.get_product_bundle_id
    ARGV && ARGV.length >= 2 ? ARGV[1] : '$(PRODUCT_BUNDLE_IDENTIFIER)'
  end

  DEFAULT_PRODUCT_ID = '$(PRODUCT_BUNDLE_IDENTIFIER)'
  PRODUCT_ID = BbdRNProject.get_product_bundle_id

  GD_IOS_PATH = File.expand_path('~/Library/Application Support/BlackBerry/Good.platform/iOS')
  GD_ASSETS_BUNDLE = File.expand_path(GD_IOS_PATH + '/Frameworks/GD.framework/Versions/A/Resources/GDAssets')
  GD_FIPS_LD = File.expand_path(GD_IOS_PATH + '/FIPS_module/$FIPS_PACKAGE/bin/gd_fipsld')
  LIBRARY_SEARCH_PATHS = '$(SDK_DIR)/usr/lib/swift $(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME) $(inherited)'
  LD_RUNPATH_SEARCH_PATHS = '/usr/lib/swift @executable_path/Frameworks'

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

  EMBEDDED_FRAMEWORKS = [
    'BlackBerryCerticom.framework',
    'BlackBerryCerticomSBGSE.framework'
  ]

  TBD_LIBS = [
    'z',
    'network'
  ]

  BUILD_CONFIGS = {
    'FIPS_PACKAGE'                          => '$(CURRENT_ARCH).sdk',
    'LDPLUSPLUS'                            => GD_FIPS_LD,
    'LD'                                    => GD_FIPS_LD,
    'ENABLE_BITCODE'                        => 'NO',
    'LIBRARY_SEARCH_PATHS'                  => LIBRARY_SEARCH_PATHS,
    'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES' => 'YES',
    'LD_RUNPATH_SEARCH_PATHS'               => LD_RUNPATH_SEARCH_PATHS
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
    },
    "CFBundleIdentifier"       => PRODUCT_ID
  }

  attr_reader :product_name
  attr_reader :product_id

  def initialize
    @rn_project_path = projectRoot = ENV['PROJECT_ROOT'] || ENV['INIT_CWD'] || Dir.pwd
    rn_project_json = JSON.load File.open "#{@rn_project_path}/package.json"
    @product_name = rn_project_json['name']
    @rn_version = rn_project_json['dependencies']['react-native']
    @development_tools_json_path = "#{@rn_project_path}/ios/#{@product_name}/Resources/development-tools-info.json"
    @xcodeproj = Xcodeproj::Project.open("#{@rn_project_path}/ios/#{@product_name}.xcodeproj")
    @plist_path = "#{@rn_project_path}/ios/#{@product_name}/Info.plist"
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

  def read_storyboard(path:)
    file = File.open(path)
    content = file.read()
    file.close()

    return content
  end

  def rewrite_storyboard(path:, content:)
    File.open(path, "w") { |f| f.write(content) }
  end

  def replace_storyboard
    root = "#{@rn_project_path}/ios/#{@product_name}"
    paths = {
      storyboard: "#{root}/LaunchScreen.storyboard",
      gd_storyboard: "ios/resources/GDLaunchScreen.storyboard",
      image_resources: "ios/resources/Images.xcassets",
      backup_storyboard: "#{root}/LaunchScreen-backup.storyboard",
      xcassets: "#{root}/Images.xcassets",
      xcassets_backup: "#{root}/Images-backup.xcassets",
      gd_xcassets: "ios/resources/Images.xcassets"
    }

    paths.each { |key, path| paths[key] = File.expand_path(path) }

    if File.exists? paths[:xcassets_backup] and File.exists? paths[:backup_storyboard]
      return
    end

    origin_storyboard = read_storyboard(path: paths[:storyboard])
    gd_storyboard = read_storyboard(path: paths[:gd_storyboard])

    # add app name to storyboard
    gd_storyboard.sub! 'APPNAME', @product_name

    # create backup
    rewrite_storyboard(
      path: paths[:backup_storyboard],
      content: origin_storyboard
    )
    # rewrite origin storyboard to GD storyboard
    rewrite_storyboard(
      path: paths[:storyboard],
      content: gd_storyboard
    )

    # create backup for Images.xcassets
    begin
      File.rename paths[:xcassets], paths[:xcassets_backup] if File.exists? paths[:xcassets]
      FileUtils.cp_r paths[:gd_xcassets], paths[:xcassets]
    rescue Errno::ENOTEMPTY => e
      # DEVNOTE: yarn set-bundle-id triggers bbd_rn_install_ios.rb hook again, no need to copy twice
    end
  end

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

  def add_localization(group)
    localization_group_name = "InfoPlist.strings"
    available_languages = ["da", "de", "en", "es", "fr", "it", "ja", "ko", "nl", "pt-PT", "pt", "sv", "zh-Hans"]
    localization_path = File.expand_path "ios/resources/localization"

    # if localization already added just return to avoid re-adding
    group.children.objects.each do |item|
      if item.display_name == localization_group_name
        return
      end
    end

    localization_group = group.new_variant_group(localization_group_name)
    available_languages.each do |lang|
      localization_group.new_reference("#{localization_path}/#{lang}.lproj/#{localization_group_name}")
    end

    @native_target.add_resources([localization_group])
  end

  def patch_xcodeproj
    unless PRODUCT_ID == DEFAULT_PRODUCT_ID
      set_product_bundle_id PRODUCT_ID
    end

    @native_target.add_system_frameworks FRAMEWORKS
    @native_target.add_system_libraries_tbd TBD_LIBS

    # 0.62 and higher versions of RN already add 'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES=YES' option to xcconfig
    # so we don't need to duplicate it
    BUILD_CONFIGS.delete('ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES')

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

    if app_group.files.select do |file|
      file.name == 'development-tools-info.json'
    end.empty? then
      developmentToolsJsonRef = Xcodeproj::Project::Object::FileReferencesFactory.new_reference(
        app_group, @development_tools_json_path, 'SOURCE_ROOT'
      )
      @native_target.add_resources([developmentToolsJsonRef])
    end

    frameworks_group = @xcodeproj.groups.find { |group| group.display_name == 'Frameworks' }
    frameworks_build_phase = @native_target.build_phases.find { |build_phase| build_phase.to_s == 'FrameworksBuildPhase' }

    # remove previous "Embed Frameworks" Copy Build Phase
    phases = @native_target.copy_files_build_phases().each do |phase|
      if phase.name == 'Embed Frameworks'
        phase.remove_from_project

        # remove frameworks
        @native_target.frameworks_build_phase.files.objects.each do |bf|
          if EMBEDDED_FRAMEWORKS.include? bf.display_name
            @native_target.frameworks_build_phase.remove_build_file(bf)
          end
        end

        # remove from groups
        frameworks_group.files.each do |file|
          file.remove_from_project if EMBEDDED_FRAMEWORKS.include? file.name
        end
      end
    end

    # Add new "Embed Frameworks" build phase to target
    embed_frameworks_build_phase = @xcodeproj.new(Xcodeproj::Project::Object::PBXCopyFilesBuildPhase)
    embed_frameworks_build_phase.name = 'Embed Frameworks'
    embed_frameworks_build_phase.symbol_dst_subfolder_spec = :frameworks
    @native_target.build_phases << embed_frameworks_build_phase

    # Add BlackBerryCerticom.framework and BlackBerryCerticomSBGSE.framework frameworks to target as "Embed Frameworks"
    EMBEDDED_FRAMEWORKS.each do |framework|
      framework_ref = frameworks_group.new_file(GD_IOS_PATH + '/Frameworks/' + framework)
      build_file = embed_frameworks_build_phase.add_file_reference(framework_ref)
      frameworks_build_phase.add_file_reference(framework_ref)
      build_file.settings = { 'ATTRIBUTES' => ['CodeSignOnCopy', 'RemoveHeadersOnCopy'] }
    end

    # Add BlackBerry storyboard with images.xcassets and create backup for origin storyboard
    replace_storyboard

    add_localization app_group

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
