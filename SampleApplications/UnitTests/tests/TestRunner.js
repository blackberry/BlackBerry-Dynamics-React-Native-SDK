/**
 * Copyright (c) 2020 BlackBerry Limited. All Rights Reserved.
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
 
import jasmineRequire from './jasmine';
import { testRunnerService } from './testResultsService';

import runSpecsForFetch from './specs/testFetch';
import runSpecsForXMLHttpRequest from './specs/testXMLHttpRequest';
import runSpecsForSQLite from './specs/testSQLite';
import runSpecsForSQLiteImport from './specs/testSQLite_import';
import runSpecsForClipboard from './specs/testClipboard';
import runSpecsForAsyncStorage from './specs/testAsyncStorage';
import runSpecsForAppKinetics from './specs/testAppKinetics';

export default {
  execute: function() {
    window.jasmine = jasmineRequire.core(jasmineRequire);

    // Boot jasmine
    const env = jasmine.getEnv();
    const jasmineInterface = jasmineRequire.interface(jasmine, env);

    // Globally expose Jasmine
    function extend(destination, source) {
      for (const property in source) destination[property] = source[property];
      return destination;
    }
    extend(window, jasmineInterface);

    const customConfig = {
      random: false
    };
    env.configure(customConfig);
    env.addReporter(jasmineInterface.jsApiReporter);

    function configureJasmineReporterForRN() {
      let suitesTree = [];
      let specs = [];
      let totalSpecsCounter;
      let passedSpecsCounter;
      let failedSpecsCounter;
      let pendingSpecsCounter;
      let noExpectationSpecsCounter;
      let testResults = {
        status: '',
        suites: [],
        statistic: {
          totalSpecsCounter: 0,
          passedSpecsCounter: 0,
          failedSpecsCounter: 0,
          pendingSpecsCounter: 0,
          noExpectationSpecsCounter: 0
        }
      };

      const reactNativeCustomReporter = {
        jasmineStarted: function(suiteInfo) {
          totalSpecsCounter = 0;
          passedSpecsCounter = 0;
          failedSpecsCounter = 0;
          pendingSpecsCounter = 0;
          noExpectationSpecsCounter = 0;
          testResults.statistic.totalSpecsCounter = suiteInfo.totalSpecsDefined;
          testResults.status = 'in progress';
        },
        suiteStarted: function(result) {
          const { id, fullName, description } = result;
          const parentSuite = suitesTree.length > 0 ? suitesTree[suitesTree.length - 1] : '';
          let currentSuite = {
            id,
            fullName,
            description,
            specs: [],
            status: '',
            parent: parentSuite
          };

          suitesTree.push(description);
          testResults.suites.push(currentSuite);
        },
        specStarted: function(result) {
          totalSpecsCounter++;
        },
        specDone: function(result) {
          let statusDescription = '';
          let specClass = '';
          let parentSuite = suitesTree[suitesTree.length - 1];

          if ((result.passedExpectations.length > 0) && (result.failedExpectations.length === 0)) {
            // Passed tests and no failures
            specClass = 'testPassed';
            passedSpecsCounter++;
            testResults.statistic.passedSpecsCounter++;
          } else if (result.failedExpectations.length > 0) {
            // Failed tests
            specClass = 'testFailed';
            failedSpecsCounter++;
            testResults.statistic.failedSpecsCounter++;
          } else if ((result.failedExpectations.length + result.passedExpectations.length) === 0 && result.status === 'passed') {
            // No expectations tests
            specClass = 'testNoExpectations'
            statusDescription += 'SPEC HAS NO EXPECTATIONS';
            noExpectationSpecsCounter++;
            testResults.statistic.noExpectationSpecsCounter++;
          } else if (result.status === 'pending') {
            // Pending tests
            specClass = 'testPending';
            if (result.pendingReason !== '') {
              statusDescription += `PENDING WITH MESSAGE: ${result.pendingReason}`;
            }
            pendingSpecsCounter++;
            testResults.statistic.pendingSpecsCounter++;
          }

          let specResult = {
            ...result,
            specClass,
            statusDescription,
            parent: parentSuite
          };
          specs.push(specResult);

          let { suites } = testResults;
          const updatedSuites = suites.map(suite => {
            return suite.description === parentSuite ? { ...suite, specs: [...suite.specs, specResult] } : suite;
          });

          testResults.suites = updatedSuites;
          testRunnerService.sendTestRunnerResults(testResults);
        },
        suiteDone: function(result) {
          suitesTree.pop();

          let { suites } = testResults;
          const updatedSuites = suites.map(suite => {
            return suite.id === result.id ? { ...suite, status: result.status } : suite;
          });

          testResults.suites = updatedSuites;
        },
        jasmineDone: function(result) {
          testResults.status = 'finished';
          testRunnerService.sendTestRunnerResults(testResults);

          console.log('----- FINAL JASMINE REPORTER RESULTS -----');
          console.log(testResults);
          console.log('Specs:', specs);
          const specsFailed = specs.filter(spec => spec.failedExpectations.length > 0);
          console.log('Failed specs:', specsFailed);
        }
      }

      return reactNativeCustomReporter;
    }

    const reactNativeCustomReporter = configureJasmineReporterForRN();
    env.addReporter(reactNativeCustomReporter);

    runSpecsForXMLHttpRequest();
    runSpecsForFetch();
    runSpecsForSQLite();
    runSpecsForSQLiteImport();
    runSpecsForClipboard();
    runSpecsForAsyncStorage();
    runSpecsForAppKinetics();

    // Run tests
    env.execute();
  }
}
