/**
 * Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, View, NativeEventEmitter, NativeModules } from 'react-native';

import { ShowItemsList } from './components/ShowItemsList';
import { ApplicationHeader } from './components/ApplicationHeader';
import { NavigationTab } from './components/NavigationTab';

import BbdApplication from 'BlackBerry-Dynamics-for-React-Native-Application';
// Import native part of module to use Event Emitter
const { BbdRNApplication } = NativeModules;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'config',
      applicationConfig: {},
      applicationPolicy: {}
    };
  }
  eventEmitter = new NativeEventEmitter(BbdRNApplication);
  NAVIGATION_TABS = [
    {
      name: 'config',
      title: 'App config'
    },
    {
      name: 'app',
      title: 'App policy'
    }
  ];

  componentDidMount() {
    this.handlePolicyByType(this.state.activeTab);
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.onAppPolicyUpdateListener.remove();
    this.onPolicyErrorListener.remove();
    this.onAppConfigUpdateListener.remove();
  }

  addEventListeners() {
    // Event is fired when app-specific policy is updated
    this.onAppConfigUpdateListener = this.eventEmitter.addListener('onAppConfigUpdate', applicationConfig => {
      this.setState({ applicationConfig });
      console.log('onAppConfigUpdate event: ', JSON.stringify(applicationConfig));
    });
    // Event is fired when app-config policy is updated
    this.onAppPolicyUpdateListener = this.eventEmitter.addListener('onAppPolicyUpdate', applicationPolicy => {
      this.setState({ applicationPolicy });
      console.log('onAppPolicyUpdate event: ', JSON.stringify(applicationPolicy));
    });
    this.onPolicyErrorListener = this.eventEmitter.addListener('onError', error => {
      console.error('onError event: ', JSON.stringify(error));
    });

  }

  handlePolicyByType(policyType) {
    switch (policyType) {
      case 'config':
        this.getAppConfigPolicy();
        break;
      case 'app':
        this.getAppSpecificPolicy();
        break;
      default:
        break;
    }
  }

  async getAppConfigPolicy() {
    try {
      const applicationConfig = await BbdApplication.getApplicationConfig();
      this.setState({ applicationConfig });
      console.log('App-config policy received:', applicationConfig);
    } catch (error) {
      alert('Failed to get app-config policy!' + error.message);
    }
  }

  async getAppSpecificPolicy() {
    try {
      const applicationPolicy = await BbdApplication.getApplicationPolicy();
      this.setState({ applicationPolicy });
      console.log('App-specific policy received:', applicationPolicy);
    } catch (error) {
      alert('Failed to get app-specific policy!' + error.message);
    }

  }

  renderActiveTab() {
    let activeTab;

    switch (this.state.activeTab) {
      case 'config':
        activeTab = this.state.applicationConfig && (
          <ShowItemsList
            header='App-configuration policy'
            objectData={this.state.applicationConfig}>
          </ShowItemsList>
        );
        break;
      case 'app':
        activeTab = this.state.applicationConfig && (
          <ShowItemsList
            header='App-specific policy'
            objectData={this.state.applicationPolicy}>
          </ShowItemsList>
        );
        break;
      default:
        activeTab = null;
        break;
    }

    return activeTab;
  }

  selectActiveTab = tab => {
    this.handlePolicyByType(tab);
    this.setState({ activeTab: tab });
  }

  render() {
    const { activeTab } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ApplicationHeader name="Policy"></ApplicationHeader>
        <View style={styles.container}>
          {this.renderActiveTab()}
        </View>
        <View style={styles.tabsDelimiter}></View>
        <NavigationTab
          tabs={this.NAVIGATION_TABS}
          activeTab={activeTab}
          onChangeTab={this.selectActiveTab}
        >
        </NavigationTab>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 28
  },
  tabsDelimiter: {
    borderColor: '#edf6f9',
    borderWidth: 1
  }
});
