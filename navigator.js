import {createBottomTabNavigator, createAppContainer} from 'react-navigation';
import AudioExample from './pages/AudioExample';
import Home from './pages/Home';
import { View} from 'react-native'


const Nav = createBottomTabNavigator(
  {
    Home: Home,
    Record: AudioExample
  });
  
export default Nav;
