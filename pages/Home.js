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
      refresh: false, //tells flatList to re-render
      selectedDreams: new Set(),
      playbackObject: null, //so we can do operations like pause
    };

    this.refresh(); // load dream list

    this._renderRecord = this._renderRecord.bind(this);
    this.handleRecordPress = this.handleRecordPress.bind(this);
    this.playback = this.playback.bind(this);
    this.pausePlayback = this.pausePlayback.bind(this);
    this.stopPlayback = this.stopPlayback.bind(this);
    this.navigationRefresh = this.navigationRefresh.bind(this);

  }

  refresh() {
    DreamStore.getDreamList()
    .then((list) => {
      this.setState({
        dreamList: list,
        refresh: !this.state.refresh
      });
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

  _renderRecord(record) {
    if(this.state.selectedDreams.has(record.item.id)) {
      let peopleTags = [];
      for(let i = 0; i < record.item.people.length; ++i) {
        let name=record.item.people[i];
        let touchable = (
          <TouchableOpacity key={i}>
            <Text>{name}</Text>
          </TouchableOpacity>
        );
        peopleTags.push(touchable);
      }

      return (
        <View style={styles.recordCont}>
          <TouchableOpacity onPress={() => {this.handleRecordPress(record.item.id)}}>
            <Text>{record.item.title}</Text>
          </TouchableOpacity>
          <View style={styles.infoCont}>
            <Text>{record.item.date.toDateString()}</Text>
            {peopleTags}
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
      this.refresh();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        { /*if this page was navigated to and the refresh argument was passed, reload the FlatList */ }
        <NavigationEvents onDidFocus={this.navigationRefresh} />
        <View style={styles.listCont}>
          <FlatList 
            data={this.state.dreamList} 
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
});