/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
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

import React, { Component } from 'react';
import { Text, View, Platform, ScrollView, FlatList, StyleSheet } from 'react-native';
import _ from 'lodash';

import TestRunner from '../tests/TestRunner'
import { testRunnerResultsSubscriber } from '../tests/testResultsService';

export default class TestRunnerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRunningSuiteId: '',
      jasmineReporterResults: {
        status: '',
        statistic: {
          totalSpecsCounter: 0,
          passedSpecsCounter: 0,
          failedSpecsCounter: 0,
          pendingSpecsCounter: 0,
          noExpectationSpecsCounter: 0
        },
        suites: []
      },
      specsResults: []
    };
  }
  SPEC_STATUS_SYMBOLS = {
    passed: '•',
    failed: '×',
    pending: '•',
    noExpectations: '*'
  }

  componentDidMount() {
    TestRunner.execute();

    testRunnerResultsSubscriber.subscribe(results => {
      let specsResults = [];
      results.suites.forEach(suite => {
        const suiteSpecs = suite.specs;
        if (suiteSpecs && suiteSpecs.length > 0) {
          specsResults = [...specsResults, ...suiteSpecs];
        }
      });

      this.setState({
        jasmineReporterResults: { ...results },
        specsResults
      });
    });
  }

  componentWillUnmount() {
    testRunnerResultsSubscriber.unsubscribe();
  }

  renderSpecResult(spec) {
    let specResultSymbol = '';

    switch (spec.specClass) {
      case 'testPassed':
        specResultSymbol = this.SPEC_STATUS_SYMBOLS.passed;
        break;
      case 'testFailed':
        specResultSymbol = this.SPEC_STATUS_SYMBOLS.failed
        break;
      case 'testPending':
        specResultSymbol = this.SPEC_STATUS_SYMBOLS.pending;
        break;
      case 'testNoExpectations':
        specResultSymbol = this.SPEC_STATUS_SYMBOLS.noExpectations;
        break;
      default:
        specResultSymbol = '';
        break;
    }

    return (
      <View>
        <Text
          style={[styles.specsResultsFont, styles[spec.specClass]]}
          onPress={() => { this.showSpecExpectations(spec) }}>
          {specResultSymbol} {spec.description}
        </Text>
        {
          spec.failedExpectations && spec.failedExpectations.length > 0 ? (
            this.renderFailedExpectationsInfo(spec.failedExpectations)
          )
          :
          null
        }
      </View>
    );

  }

  renderFailedExpectationsInfo(failedExpectations) {
    return (
      <View
        style={styles.failedExpectationsInfo}>
        <Text style={[styles.specsResultsFont, styles.failedExpectationsTitle]}>
          Failed expectations:
        </Text>
        {
          failedExpectations.map((expectation, index) => (
            <Text
              key={index}
              style={[styles.specsResultsFont, styles.failedExpectationsMessage]}>
              • {expectation.message}
            </Text>
          ))
        }
      </View>
    );
  }

  renderSuiteResultsByParent(parent) {
    if (this.state.jasmineReporterResults.suites && this.state.jasmineReporterResults.suites.length > 0) {
      let suiteChildren = this.state.jasmineReporterResults.suites.filter(suite => suite.parent === parent);

      return suiteChildren && suiteChildren.length > 0 ? suiteChildren.map((suite) => (
        <View key={_.uniqueId()} style={styles.container}>
          <View style={{ paddingLeft: 8 }}>
            <Text
              style={[styles.specsResultsFont, styles.suiteTitle]}
              onPress={() => { this.showSuiteExpectations(suite) }}>
              {suite.description}
            </Text>

            {suite.specs && suite.specs.length > 0 ? suite.specs.map((spec) => (
              <View key={_.uniqueId()}>
                {this.renderSpecResult(spec)}
              </View>)
              )
              :
              null
            }

            {this.renderSuiteResultsByParent(suite.description)}
          </View>
        </View>
      )
      )
        :
        null;
    }
  }

  renderStatusExecutedSpecs(specsResults) {
    return specsResults.map((specResult, index) => {
      let symbol = '';

      switch (specResult.specClass) {
        case 'testPassed':
          symbol = ` ${this.SPEC_STATUS_SYMBOLS.passed} `;
          break;
        case 'testFailed':
          symbol = ` ${this.SPEC_STATUS_SYMBOLS.failed} `;
          break;
        case 'testPending':
          symbol = ` ${this.SPEC_STATUS_SYMBOLS.pending} `;
          break;
        case 'testNoExpectations':
          symbol = ` ${this.SPEC_STATUS_SYMBOLS.noExpectations} `;
          break;
        default:
          return;
      }

      return (
        <Text
          key={_.uniqueId()}
          style={[styles.testStatusIcon, styles[specResult.specClass]]}>
          {symbol}
        </Text>
      );
    })
  }

  renderSpecsToBeExecuted(specsNumber) {
    return _.times(specsNumber, () => (
      <Text key={_.uniqueId()} style={[styles.testStatusIcon, styles.testLoading]}> • </Text>
    ));
  }

  renderSpecsStatusBar(specsResults) {
    const {
      totalSpecsCounter,
      passedSpecsCounter,
      failedSpecsCounter,
      pendingSpecsCounter,
      noExpectationSpecsCounter
    } = this.state.jasmineReporterResults.statistic;
    let executedSpecs = passedSpecsCounter + failedSpecsCounter + pendingSpecsCounter + noExpectationSpecsCounter;

    return [...this.renderStatusExecutedSpecs(specsResults), ...this.renderSpecsToBeExecuted(totalSpecsCounter - executedSpecs)];
  }

  // Click on test name in app UI to display detailed info in debugger console
  showSpecExpectations(spec) {
    console.log('Test info:');
    console.log(spec);
  }

  // Click on suite name in app UI to display detailed info in debugger console
  showSuiteExpectations(suite) {
    console.log('Suite info:');
    console.log(suite);
  }

  render() {
    const { jasmineReporterResults, specsResults } = this.state;

    return (
      <View style={styles.container}>

        <View style={styles.reporterStatistic}>
          <Text style={styles.jasmineTitle}>Jasmine: {jasmineReporterResults.status}</Text>
          {
            jasmineReporterResults ? (
              <View style={styles.reporterStatisticResults}>
                <Text style={{ paddingLeft: 5 }}>Tests: {jasmineReporterResults.statistic.totalSpecsCounter}</Text>
                <Text>
                  <Text style={styles.testPassed}>  {this.SPEC_STATUS_SYMBOLS.passed}  </Text>
                  <Text>Passed: {jasmineReporterResults.statistic.passedSpecsCounter}</Text>
                </Text>
                <Text>
                  <Text style={styles.testFailed}>  {this.SPEC_STATUS_SYMBOLS.failed}  </Text>
                  <Text>Failed: {jasmineReporterResults.statistic.failedSpecsCounter}</Text>
                </Text>
                <Text>
                  <Text style={styles.testPending}>  {this.SPEC_STATUS_SYMBOLS.pending}  </Text>
                  <Text>Pending: {jasmineReporterResults.statistic.pendingSpecsCounter}</Text>
                </Text>
                <Text>
                  <Text style={styles.testNoExpectations}>  {this.SPEC_STATUS_SYMBOLS.noExpectations}  </Text>
                  <Text>No expectations: {jasmineReporterResults.statistic.noExpectationSpecsCounter}</Text>
                </Text>
              </View>
              )
              :
              null
          }
          <View style={styles.specsResultsStatusBar}>
            {specsResults ? this.renderSpecsStatusBar(specsResults) : null}
          </View>
        </View>

        <ScrollView
          style={{ paddingHorizontal: 3 }}
          ref={scrollView => { this.testResultsScrollView = scrollView }}
          onContentSizeChange={() => {this.testResultsScrollView.scrollToEnd()}}>
          {this.renderSuiteResultsByParent('')}
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    fontSize: 16
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  reporterStatistic: {
    marginVertical: 4,
    width: '100%',
    backgroundColor: '#f5f5f5'
  },
  reporterStatisticResults: {
    paddingTop: 10,
    paddingHorizontal: 14
  },
  jasmineTitle: {
    textAlign: 'center',
    padding: 4,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#8a4182'
  },
  textMessage: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 16
  },
  specsResultsFont: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'CourierNewPSMT' : 'monospace'
  },
  specsResultsStatusBar: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  testStatusIcon: {
    fontSize: 18,
    maxWidth: 18
  },
  testPassed: {
    color: '#007069'
  },
  testPending: {
    color: '#ba9d37'
  },
  testNoExpectations: {
    color: '#ba9d37'
  },
  testFailed: {
    color: '#ca3a11'
  },
  testLoading: {
    color: '#bdb9b9'
  },
  suiteTitle: {
    fontSize: 16,
    paddingVertical: 4
  },
  failedExpectationsInfo: {
    padding: 4,
    margin: 5,
    borderColor: '#8A4182',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  failedExpectationsTitle: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#8A4182'
  },
  failedExpectationsMessage: {
    paddingVertical: 3
  }
});
