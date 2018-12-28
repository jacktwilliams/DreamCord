import React, {Component} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import DreamStore from '../utility/DreamStore';
import AudioStore from '../utility/AudioStore';
import Sound from 'react-native-sound';
import { NavigationEvents } from 'react-navigation';


export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      dreamList: [],
      filteredList: [],
      refresh: false, //tells flatList to re-render
      selectedDreams: new Set(),
      playbackObject: null, //so we can do operations like pause
    };

    this.refreshList(); // load dream list


    this._renderRecord = this._renderRecord.bind(this);
    this.handleRecordPress = this.handleRecordPress.bind(this);
    this.playback = this.playback.bind(this);
    this.pausePlayback = this.pausePlayback.bind(this);
    this.stopPlayback = this.stopPlayback.bind(this);
    this.navigationRefresh = this.navigationRefresh.bind(this);
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
    let inclusionFuncPerField = new Map([
      ['people', byPeople],
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

  //TODO: immediately simplify record.item.x
  _renderRecord(record) {
    if(this.state.selectedDreams.has(record.item.id)) {
      //for now it is simpler to have the people list's initial state in SaveRecording be '' instead of null
      //and to handle this here.
      let peopleTags = [];
      let thereArePeople = false;
      for(let i = 0; i < record.item.people.length; ++i) {
        let name=record.item.people[i];
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
          <TouchableOpacity onPress={() => {this.handleRecordPress(record.item.id)}}>
            <Text>{record.item.title}</Text>
          </TouchableOpacity>
          <View style={styles.infoCont}>
            <Text>{record.item.date.toDateString()}</Text>
            <View style={styles.peopleCont}>
              <Text key={-1} style={{marginRight: '2%'}}>{thereArePeople ? "People: " : ""}</Text>
              {peopleTags}
            </View>
          </View> 
          <View style={styles.playbackCont}>
            <TouchableOpacity style={styles.playbackButtons} onPress={() => {this.playback(record.item.id)}}>
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
          <TouchableOpacity onPress={() => {this.handleRecordPress(record.item.id)}}>
            <Text>{record.item.title}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  //when page focuses, decide whether a refresh is needed.
  navigationRefresh() {
    if(this.props.navigation.getParam('refresh', false)) {
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
});