import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage } from 'react-native'
import DreamStore from '../utility/DreamStore';
import DatePicker from 'react-native-datepicker'

const DreamListKey = "dreamList";

export default class SaveRecording extends Component {
  constructor(props) {
    super(props);
    let today = new Date();

    this.state = { 
      title: '',
      recordId: this.props.navigation.getParam("recordId", -1),  
      date: today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(),
    };

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    try {
      //update our dream record list with a new record corresponding with the recording we saved.
      AsyncStorage.getItem(DreamListKey)
      .then((DList) => {
        let DreamList = JSON.parse(DList);
        let dreamDate = this.state.date.split("-");
        let dateForRecord = new Date((dreamDate[0] - 1), dreamDate[1], dreamDate[2]);
        let record = DreamStore.makeRecord(this.state.recordId, this.state.title, dateForRecord);
        DreamList.unshift(record)

        AsyncStorage.setItem(DreamListKey, JSON.stringify(DreamList));
        this.props.navigation.navigate("Home", {refresh: true});
      });
    }
    catch(e) {
      console.log("Error saving recording record: \n" + e);
      //TODO: Maybe move the recording to purgatory.
      this.props.navigation.navigate("HOME", {refresh: true});
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Text>Title</Text>
        <TextInput
          style={styles.textIn}
          onChangeText={(text) => this.setState({title: text})}
          placeholder="Give your dream a title"
          value={this.state.title}
        />
        
        <DatePicker
          format="YYYY-MM-DD"
          style={{width: 200}}
          date={this.state.date}
          onDateChange={(newD) => {this.setState({date: newD})}}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }}}
        />

        <Button
          onPress={() => {this.handlePress()}}
          title="Save"
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