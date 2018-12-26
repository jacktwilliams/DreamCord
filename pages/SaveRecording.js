import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage } from 'react-native'
import DreamStore from '../utility/DreamStore';

const DreamListKey = "dreamList";

export default class SaveRecording extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      title: 'Useless Placeholder',
      recordId: this.props.navigation.getParam("recordId", -1),     
    };

    console.log("Record ID: " + this.state.recordId);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    try {
      //update our dream record list with a new record corresponding with the recording we saved.
      AsyncStorage.getItem(DreamListKey)
      .then((DList) => {
        let DreamList = JSON.parse(DList);
        console.log("DREAM LIST: " + JSON.stringify(DreamList));

        let record = DreamStore.makeRecord(this.state.recordId, this.state.title);
        DreamList.unshift(record)
        console.log("newDL: " + JSON.stringify(DreamList));

        AsyncStorage.setItem(DreamListKey, JSON.stringify(DreamList));
        this.props.navigation.navigate("Home", {refresh: true});
      });
    }
    catch {
      console.log("Error saving recording record.");
      //TODO: Maybe move the recording to purgatory.
      this.props.navigation.navigate("HOME", {refresh: true});

    }
  }


  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textIn}
          onChangeText={(text) => this.setState({title: text})}
          value={this.state.title}
        />

        <Button
          onPress={() => {this.handlePress()}}
          title="Press Me"
        />
      </View>
    );
    }
   }

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textIn: {
    marginTop: 20, 
    height: 40, 
    borderColor: 'black', 
    borderWidth: 2,
  },
  });