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

(function() {
    var fs = require('fs'),
        path = require('path'),
        pwd = process.env.PWD;

    function removeRNDuplLinkerFlags() {
        var projectRoot = path.join(pwd, '..'),
        	projectName = require(path.join(projectRoot, 'app.json')).name,
            releaseXcconfigPath = path.join(
                projectRoot,
                'ios',
                'Pods',
                'Target\ support\ Files',
                'Pods-' + projectName,
                'Pods-' + projectName + '.release.xcconfig'
            ),
            debugXcconfigPath = path.join(
                projectRoot,
                'ios',
                'Pods',
                'Target\ support\ Files',
                'Pods-' + projectName,
                'Pods-' + projectName + '.debug.xcconfig'
            ),
            releaseXcconfigContent = fs.readFileSync(releaseXcconfigPath, 'utf-8'),
            debugXcconfigContent = fs.readFileSync(debugXcconfigPath, 'utf-8');

        releaseXcconfigContent = releaseXcconfigContent.replace(' -l"crypto"', '');
        releaseXcconfigContent = releaseXcconfigContent.replace(' -l"ssl"', '');

        debugXcconfigContent = debugXcconfigContent.replace(' -l"crypto"', '');
        debugXcconfigContent = debugXcconfigContent.replace(' -l"ssl"', '');

        fs.writeFileSync(releaseXcconfigPath, releaseXcconfigContent, 'utf-8');
        fs.writeFileSync(debugXcconfigPath, debugXcconfigContent, 'utf-8');
    }

    function addBuildActiveArchitectureOnly() {
        var projectRoot = path.join(pwd, '..'),
            projectName = require(path.join(projectRoot, 'package.json')).name,
            projectReleaseXcconfigPath = path.join(
                projectRoot,
                'ios',
                'Pods',
                'Target\ support\ Files',
                'Pods-' + projectName,
                'Pods-' + projectName + '.release.xcconfig'
            ),
            bbdReleaseXcconfigPath = path.join(
                projectRoot,
                'ios',
                'Pods',
                'Target\ support\ Files',
                'BlackBerryDynamics',
                'BlackBerryDynamics.release.xcconfig'
            ),
            projectReleaseXcconfigContent = fs.readFileSync(projectReleaseXcconfigPath, 'utf-8'),
            bbdReleaseXcconfigContent = fs.readFileSync(bbdReleaseXcconfigPath, 'utf-8');

        projectReleaseXcconfigContent = projectReleaseXcconfigContent.replace('USE_RECURSIVE_SCRIPT_INPUTS_IN_SCRIPT_PHASES = YES', 'USE_RECURSIVE_SCRIPT_INPUTS_IN_SCRIPT_PHASES = YES\nONLY_ACTIVE_ARCH = YES');
        bbdReleaseXcconfigContent = bbdReleaseXcconfigContent.replace('USE_RECURSIVE_SCRIPT_INPUTS_IN_SCRIPT_PHASES = YES', 'USE_RECURSIVE_SCRIPT_INPUTS_IN_SCRIPT_PHASES = YES\nONLY_ACTIVE_ARCH = YES');

        fs.writeFileSync(projectReleaseXcconfigPath, projectReleaseXcconfigContent, 'utf-8');
        fs.writeFileSync(bbdReleaseXcconfigPath, bbdReleaseXcconfigContent, 'utf-8');
    }

    removeRNDuplLinkerFlags();
    addBuildActiveArchitectureOnly();
})();
