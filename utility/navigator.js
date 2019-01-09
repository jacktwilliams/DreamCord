import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import AudioExample from '../pages/AudioExample';
import Home from '../pages/Home';
import SaveRecording from '../pages/SaveRecording';
import Filtering from '../pages/Filtering';
import { View} from 'react-native'

const Nav = createStackNavigator({
  Home: Home,
  Filtering: Filtering,
  Record: AudioExample,
  SaveRecording: SaveRecording,
},
{
  initialRouteName: "Home"
});
  
export default Nav;
