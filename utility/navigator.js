import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import AudioExample from '../pages/AudioExample';
import Home from '../pages/Home';
import SaveRecording from '../pages/SaveRecording';
import { View} from 'react-native'

const RecordNav = createStackNavigator({
  Record: AudioExample,
  SaveRecording: SaveRecording,
},
{
  initialRouteName: "Record"
});
const Nav = createBottomTabNavigator(
  {
    Home: Home,
    Record: RecordNav,
  });
  
export default Nav;
