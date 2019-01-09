import React, {Component} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import DreamStore from '../utility/DreamStore';
import AudioStore from '../utility/AudioStore';
import Sound from 'react-native-sound';
import { NavigationEvents, withNavigation } from 'react-navigation';
import NavigationService from '../utility/NavigationService';

//TODO: get rid of HeaderBar class. Instead of overriding whole header of react navigation, use headerRight static option
//https://reactnavigation.org/docs/en/header-buttons.html#customizing-the-back-button
class HeaderBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let styles = headStyles;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Dreams</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton} onPress={() => {NavigationService.navigate("Filtering")}}>
            <Text>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => {NavigationService.navigate("Record")}}>
            <Text>Record</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var headStyles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: '2%',
  },
  navButtons: {
    flexDirection: 'row',
  },
  navButton: {
    borderColor: 'black',
    borderWidth: 2,
    marginRight: '2%',
  }
});

export default class Home extends Component {
  
  static navigationOptions = {
    headerTitle: HeaderBar,
  }

  constructor(props) {
    super(props);
    this.state = {
      dreamList: [],
      filteredList: [],
      refresh: false, //tells flatList to re-render
      selectedDreams: new Set(),
      playbackObject: null, //so we can do operations like pause
    };

    console.log("HOME PROPS: \n" + JSON.stringify(this.props));

    this.refreshList(); // load dream list


    this._renderRecord = this._renderRecord.bind(this);
    this.handleRecordPress = this.handleRecordPress.bind(this);
    this.playback = this.playback.bind(this);
    this.pausePlayback = this.pausePlayback.bind(this);
    this.stopPlayback = this.stopPlayback.bind(this);
    this.navigationRefresh = this.navigationRefresh.bind(this);
    this.editRecord = this.editRecord.bind(this);
  }

  refreshList() {
    DreamStore.getDreamList()
    .then((list) => {
      this.setState({
        dreamList: list,
        filteredList: list,
        refresh: !this.state.refresh
      });
    });
  }

  filterBySingleFieldValue(field, fieldVal) {
    /* This method is for the quick filtering functionality on the homepage.
       For example, when the user clicks the name of a person who was in a dream.
       The touchtarget will pass in the 'field' which is 'people' in this instance 
       This field name maps to a function which says whether to include the record in the filtered list */
    let byPeople = function (record, name) {
      return record.people.includes(name);
    }
    let byDate = function (record, date) {
      return record.date.toDateString() === date.toDateString()
    }
    //closest thing to Map literal syntax
    let inclusionFuncPerField = new Map([
      ['people', byPeople],
      ['date', byDate],
    ]);

    //console.log(inclusionFuncPerField.get('people'));
 
    let filtered = [];
    let full = this.state.dreamList;
    full.forEach((record) => {
      if(inclusionFuncPerField.get(field)(record, fieldVal)) {
        filtered.push(record);
      }
    });

    
    this.setState({
      filteredList: filtered,
      refresh: !this.state.refresh
    });
  }

  handleRecordPress(id) {
    //toggle record id's inclusion in set of selected records
    let selected = this.state.selectedDreams;

    if(selected.has(id)) {
      selected.delete(id);
    }
    else {
      selected.add(id);
    }

    this.setState({
      refresh: !this.state.refresh
    });
  }

  playback(id) {
    let name = AudioStore.getFileNameById(id);
    console.log(name);
    let play = this.state.playbackObject;

    if(play === null) {
      // These timeouts are a hacky workaround for some issues with react-native-sound.
      // See https://github.com/zmxv/react-native-sound/issues/89.
      setTimeout(() => {
        play = new Sound(name, '', (error) => {
          if (error) {
            console.log('failed to load the sound: \n' +  error);
          }
        });

        this.setState({playbackObject: play})

        setTimeout(() => {
          play.play((success) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }, 100);
      }, 100);
    }
    else {
      //if not null, then just play(). TODO: look at refactoring.
      setTimeout(() => {
        play.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }
  }

  pausePlayback() {
    this.state.playbackObject.pause();
  }

  stopPlayback() {
    this.state.playbackObject.stop();
    this.setState({playbackObject: null});
  }

  editRecord(record) {
    this.props.navigation.navigate({routeName: "SaveRecording", params: {record: record}});
  }

  _renderRecord(record) {
    record = record.item;
    if(this.state.selectedDreams.has(record.id)) {
      let peopleTags = [];
      let thereArePeople = false;
      for(let i = 0; i < record.people.length; ++i) {
        let name=record.people[i];
        //for now it is simpler to have the people list's initial state in SaveRecording be '' instead of null
        //and to handle this here.
        if(name != ['']) {
          thereArePeople = true; // there is at least one person.
          let touchable = (
            <TouchableOpacity style={styles.personTag} key={i} onPress={() => {this.filterBySingleFieldValue('people', name)}}>
              <Text>{name}</Text>
            </TouchableOpacity>
          );
          peopleTags.push(touchable);
        }
      }

      return (
        <View style={styles.recordCont}>
          <View style={styles.recordTopBarCont}>
            <TouchableOpacity onPress={() => {this.handleRecordPress(record.id)}}>
              <Text>{record.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {this.editRecord(record)}}>
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoCont}>
            <View style={styles.dateCont}>
              <TouchableOpacity style={styles.dateButton} onPress={() => {this.filterBySingleFieldValue('date', record.date)}}>
                <Text>{record.date.toDateString()}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.peopleCont}>
              <Text key={-1} style={{marginRight: '2%'}}>{thereArePeople ? "People: " : ""}</Text>
              {peopleTags}
            </View>
          </View> 
          <View style={styles.playbackCont}>
            <TouchableOpacity style={styles.playbackButtons} onPress={() => {this.playback(record.id)}}>
              <Text>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playbackButtons} onPress={this.pausePlayback}>
              <Text>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playbackButtons} onPress={this.stopPlayback}>
              <Text>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.recordCont}>
          <TouchableOpacity onPress={() => {this.handleRecordPress(record.id)}}>
            <Text>{record.title}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  navigationRefresh() {
    console.log("FOCUS on HOME. PARAMS: ");
    console.log(JSON.stringify(this.props.navigation.state));
    //when page focuses, see if a filtered List was passed
    let filteredList = this.props.navigation.getParam("filteredList", null);
    if(filteredList) {
      console.log("HOME PAGE: Filtered list has been provided: \n" + JSON.stringify(filteredList));
      this.setState({
        filteredList: filteredList,
        refresh: !this.state.refresh,
      });
    }
    else {
      console.log("Refreshing list.");
      this.refreshList();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        { /*if this page was navigated to and the refresh argument was passed, reload the FlatList */ }
        <NavigationEvents onDidFocus={this.navigationRefresh} />
        <View style={styles.listCont}>
          <FlatList 
            data={this.state.filteredList} 
            extraData={this.state.refresh}
            keyExtractor = {(item) => {return item.id.toString()}}
            renderItem={this._renderRecord} 
          />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    alignItems: 'stretch',
    alignSelf: 'center',
  },
  listCont: {
    marginTop: '5%',
    borderColor: 'black',
    borderWidth: 2,
    borderBottomWidth: 0,
    height: '100%'
  },
  recordCont: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    padding: '3%',
  },
  playbackCont: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  playbackButtons: {
    marginRight: '2%',
    borderColor: 'black',
    borderWidth: 2,
  },
  peopleCont: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '2%',
  },
  personTag: {
    paddingLeft: '1%',
    paddingRight: '1%',
    borderWidth: 1,
    borderColor: 'grey',
    marginRight: '2%',
  },
  dateButton: {
    borderWidth: 2,
    borderColor: 'black',
  },
  recordTopBarCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});