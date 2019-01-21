import React, { Component } from 'react';

import { Home } from './components/home';
import { ScanFingerprint } from './components/scanFingerprint';
import { RegisterDevice } from './components/registerDevice';

import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
  {
    Home,
    RegisterDevice ,
    ScanFingerprint ,
  },
  {
    initialRouteName: "Home"
  }
);
const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}