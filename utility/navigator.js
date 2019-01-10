import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import Recording from '../pages/Recording';
import Home from '../pages/Home';
import SaveRecording from '../pages/SaveRecording';
import Filtering from '../pages/Filtering';
import { View} from 'react-native'

const Nav = createStackNavigator({
  Home: Home,
  Filtering: Filtering,
  Record: Recording,
  SaveRecording: SaveRecording,
},
{
  initialRouteName: "Home"
});
  
export default Nav;
