import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import AudioExample from '../pages/AudioExample';
import Home from '../pages/Home';
import SaveRecording from '../pages/SaveRecording';
import Filtering from '../pages/Filtering';
import { View} from 'react-native'

const RecordNav = createStackNavigator({
  Record: AudioExample,
  SaveRecording: SaveRecording,
},
{
  initialRouteName: "Record"
});

const HomeNav = createStackNavigator({
  Home: Home,
  Filtering: Filtering,
},
{
  initialRouteName: "Home"
});
const Nav = createBottomTabNavigator(
  {
    HomeTab: HomeNav,
    RecordTab: RecordNav,
  });
  
export default Nav;
