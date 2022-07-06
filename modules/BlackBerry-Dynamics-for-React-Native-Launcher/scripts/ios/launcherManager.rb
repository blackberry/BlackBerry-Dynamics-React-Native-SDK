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
require 'json'

class LauncherPluginManager

  LAUNCHER_XCFRAMEWORK    = 'BlackBerryLauncher.xcframework'
  EMBED_FRAMEWORKS_PHASE  = 'Embedded Launcher Framework'
  FRAMEWORKS_GROUP_NAME   = 'Frameworks'
  FRAMEWORKS_BUILD_PHASE  = 'FrameworksBuildPhase'

  LAUNCHER_FRAMEWORK_PATH = "#{__dir__}/../../ios/frameworks/BlackBerryLauncher.xcframework"

  CODE_SIGN_SETTINGS = {
    'ATTRIBUTES' => ['CodeSignOnCopy', 'RemoveHeadersOnCopy']
  }

  def initialize
    open_project
    exit 1 if !@xcodeproj
  end

  def add_framework
    pods_target = get_target @podsproj, 'BbdRNLauncher'
    exit 0 if !pods_target

    frameworks_group = find_group @xcodeproj, FRAMEWORKS_GROUP_NAME

    target = @xcodeproj.targets.select.first
    frameworks_build_phase = target.build_phases.find { |build_phase|
       build_phase.to_s == FRAMEWORKS_BUILD_PHASE
    }

    # Check if BlackBerryLauncher.xcframework is already added to avoid extra adding
    exit 0 if frameworks_build_phase.file_display_names.include? LAUNCHER_XCFRAMEWORK

    # Add new "Embedded Launcher Framework" build phase to target
    embed_frameworks_build_phase = @xcodeproj.new Xcodeproj::Project::Object::PBXCopyFilesBuildPhase
    embed_frameworks_build_phase.name = EMBED_FRAMEWORKS_PHASE
    embed_frameworks_build_phase.symbol_dst_subfolder_spec = :frameworks
    target.build_phases << embed_frameworks_build_phase

    framework_ref = frameworks_group.new_file File.expand_path LAUNCHER_FRAMEWORK_PATH
    build_file = embed_frameworks_build_phase.add_file_reference framework_ref
    frameworks_build_phase.add_file_reference framework_ref
    build_file.settings = CODE_SIGN_SETTINGS

    # Add BlackBerryLauncher.xcframework in Pods to target 'BbdRNLauncher'
    frameworks_group = find_group @podsproj, FRAMEWORKS_GROUP_NAME
    framework_ref = frameworks_group.new_file File.expand_path LAUNCHER_FRAMEWORK_PATH
    phase = get_build_phase pods_target, 'Frameworks'
    phase.add_file_reference framework_ref

    @xcodeproj.save
    @podsproj.save
  end

  def rm_framework
    target = @xcodeproj.targets.select.first
    frameworks_build_phase = get_build_phase target, 'Frameworks'

    # Check if BlackBerryLauncher.xcframework is still in project to avoid errors
    exit 0 if !frameworks_build_phase.file_display_names.include? LAUNCHER_XCFRAMEWORK

    # Find and remove "BlackBerryLauncher.xcframework" from build phases
    remove_launcher_from_build_phases frameworks_build_phase

    # Find and remove "BlackBerryLauncher.xcframework" from sign & copy build phases
    embeded_phase = target.copy_files_build_phases.find { |build_phase|
      build_phase.name == EMBED_FRAMEWORKS_PHASE
    }
    embeded_phase.remove_from_project

    # Find and remove "BlackBerryLauncher.xcframework" from Pods project
    target = get_target @podsproj, 'BbdRNLauncher'
    frameworks_build_phase = get_build_phase target, 'Frameworks'
    remove_launcher_from_build_phases frameworks_build_phase

    @xcodeproj.save
    @podsproj.save
  end

  private

  def open_project
    @rn_project_path = projectRoot = ENV['PROJECT_ROOT'] || ENV['INIT_CWD'] || Dir.pwd
    rn_project_json = JSON.load File.open "#{@rn_project_path}/package.json"
    @product_name = rn_project_json['name']
    @xcodeproj = Xcodeproj::Project.open("#{@rn_project_path}/ios/#{@product_name}.xcodeproj")
    @podsproj = Xcodeproj::Project.open("#{@rn_project_path}/ios/Pods/Pods.xcodeproj")
  end

  def find_group project, name
    project.groups.find { |group| group.display_name == name }
  end

  def get_build_phase target, name
    target.build_phases.find { |phase| phase.display_name == name }
  end

  def get_target project, name
    project.targets.find { |target| target.display_name == name }
  end

  def remove_launcher_from_build_phases phases
    launcher_xcframework = phases.files.find { |build_file|
      build_file.display_name == LAUNCHER_XCFRAMEWORK
    }
    phases.remove_build_file launcher_xcframework
    launcher_xcframework.remove_from_project
  end
end

class String
  def red; "\e[31m#{self}\e[0m" end
end

class ErrorManager
  def self.print_exception exception
    puts "ERROR: #{exception.class}: #{exception.message}".red
  end
end
