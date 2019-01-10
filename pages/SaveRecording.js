import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Dimensions } from 'react-native'
import DreamStore from '../utility/DreamStore';
import DatePicker from 'react-native-datepicker';
import Dates from '../utility/Dates';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import NavigationService from '../utility/NavigationService';

const DREAMLISTKEY = "dreamList";

export default class SaveRecording extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: -1,
      title: '',
      date: Dates.dateToPickerFormat(new Date()),
      people: '',
      places: '',
      things: '',
      flags: '',
      editMode: false, //indicates that we are editing an existing record. Matters for saving. (handlePress).
    }
    //navigationRefresh does constructor-like functionality based on which page navigated here.

    this.handlePress = this.handlePress.bind(this);
    this.navigationRefresh = this.navigationRefresh.bind(this);
  }

  //TODO: refactor?
  handlePress() {
    try {
      let newRecord = DreamStore.makeRecord(this.state.recordId, this.state.title, Dates.formattedToDate(this.state.date), this.state.people, 
        this.state.places, this.state.things, this.state.flags);
      if(this.state.editMode) {
        console.log("USER IS SAVING THEIR EDITS.");
        AsyncStorage.getItem(DREAMLISTKEY)
        .then((DList) => {
          let DreamList = JSON.parse(DList);
          let recordId = this.state.recordId;
          let indexToReplace = DreamList.findIndex(function (record) { return record.id === recordId; });
          console.log("INDEX TO REPLACE: \n" + indexToReplace);
          DreamList[indexToReplace] = newRecord;
          saveDL(DreamList);
        });
      }
      else {
        console.log("USER IS SAVING A DREAM CORRESPONDING TO RECORDING");
        //update our dream record list with a new record corresponding with the recording we saved.
        AsyncStorage.getItem(DREAMLISTKEY)
        .then((DList) => {
          let DreamList = JSON.parse(DList);
          DreamList.unshift(newRecord);
          saveDL(DreamList);
        });
      }
      let saveDL = function(DL) {
        AsyncStorage.setItem(DREAMLISTKEY, JSON.stringify(DL))
        .then(() => {
          //head back to home and wipe our actions
          console.log("Heading home. Page should reset.");
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home', params: {refresh: true} })],
          });
          this.props.navigation.dispatch(resetAction);
        })
      }.bind(this);
    }
    catch(e) {
      console.log("Error saving recording record: \n" + e);
      //TODO: Maybe move the recording to purgatory that indicates no dream corresponds to audio.
      this.props.navigation.navigate("Home", {refresh: true});
    }
  }

  navigationRefresh() {
    console.log("Made it to SaveRecording page.");
    //will either arrive here after saving recording (from recordPage),
    let recordId = this.props.navigation.getParam("recordId", null);
    if(recordId) {
      console.log("Dream has been recorded. User shall enter data.");
      let today = new Date();
      this.setState({
        title: '',
        recordId: recordId,  
        date: Dates.dateToPickerFormat(today),
        people: '',
      });
    }

    //OR from 'edit' button on home page
    let recordToEdit = this.props.navigation.getParam("record", null);
    if(recordToEdit) {
      let record = recordToEdit;
      console.log("Editing dream. Record sent to edit: \n" + JSON.stringify(record));

      function transformTextInputs(list) {
        return list.join(", ");
      }

      this.setState({
        title: record.title,
        recordId: record.id,
        date: Dates.dateToPickerFormat(record.date),
        people: transformTextInputs(record.people),
        places: transformTextInputs(record.places),
        things: transformTextInputs(record.things),
        flags: transformTextInputs(record.flags),
        editMode: true,
      });
    }
  }

  //TODO: refactor with a method "_renderNounTextInput"
  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.navigationRefresh} />
        <View style={[styles.titleCont, styles.inputCont]}>
          <Text style={styles.labelText}>Title</Text>
          <TextInput
            style={[styles.textIn, styles.inputObj]}
            onChangeText={(text) => this.setState({title: text})}
            placeholder="Give your dream a title"
            value={this.state.title}
          />
        </View>
        
        <View style={styles.inputCont}>
          <Text style={styles.labelText}>Date</Text>
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
        </View>

        <View style={styles.inputCont}>
          <Text style={styles.labelText}>People</Text>
          <TextInput
            style={[styles.textIn, styles.inputObj]}
            onChangeText={(text) => this.setState({people: text})}
            placeholder="People who were involved"
            value={this.state.people}
          />
          <TextInput
            style={[styles.textIn, styles.inputObj]}
            onChangeText={(text) => this.setState({places: text})}
            placeholder="Places in dream"
            value={this.state.places}
          />
          <TextInput
            style={[styles.textIn, styles.inputObj]}
            onChangeText={(text) => this.setState({things: text})}
            placeholder="Things in dream"
            value={this.state.things}
          />
          <TextInput
            style={[styles.textIn, styles.inputObj]}
            onChangeText={(text) => this.setState({flags: text})}
            placeholder="Flags to attach to record. (ex. 'Lucid')."
            value={this.state.flags}
          />
        </View>

        <Button
          onPress={() => {this.handlePress()}}
          title="Save"
        />
      </View>
    );
  }
}
var {height, width} = Dimensions.get('window');
var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  textIn: {
    height: 40, 
    borderColor: 'black', 
    borderWidth: 2,
    padding: '1%',
  },
  inputCont: {
    marginBottom: height * .03,
  },
  titleCont: {
    marginTop: height * .01,
  },
  labelText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: height * .01,
    left: -5
  }
  });