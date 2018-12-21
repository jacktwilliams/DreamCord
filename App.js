import React, {Component} from 'react';
import { AppRegistry, View } from 'react-native'
import Nav from './navigator';
import {createAppContainer} from 'react-navigation';
import { Home } from './pages/Home.js';
import AudioStore from './utility/AudioStore';

const Navi = createAppContainer(Nav);

 export default class App extends Component {
  constructor() {
    super();
    AudioStore.initializeDir();
  }
  
  render() {
     return <Navi />;
    }
  }

  AppRegistry.registerComponent('AwesomeProject', () => App);

