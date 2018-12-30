import React, {Component} from 'react';
import { AppRegistry, View, AsyncStorage } from 'react-native'
import Nav from './utility/navigator';
import {createAppContainer} from 'react-navigation';
import { Home } from './pages/Home.js';
import AudioStore from './utility/AudioStore';
import DreamStore from './utility/DreamStore';
import NavigationService from './utility/NavigationService';

const Navi = createAppContainer(Nav);

 export default class App extends Component {
  constructor() {
    super();
    //this.clear();
    AudioStore.initializeDir();
    DreamStore.initializeDreamList();
  }

  clear() {
    DreamStore.clearDreamList();
    AudioStore.clearRecordings();
  }
  
  //NavigationService allows you to navigate from anywhere, without the nav prop.
  render() {
    return (
      <Navi ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }} />
    );
  }
}

  AppRegistry.registerComponent('AwesomeProject', () => App);

