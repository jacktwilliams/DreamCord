import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Dimensions } from 'react-native'
import DreamStore from '../utility/DreamStore';
import DatePicker from 'react-native-datepicker';
import Dates from '../utility/Dates';
import { StackActions, NavigationActions } from 'react-navigation';

const DreamListKey = "dreamList";

export default class SaveRecording extends Component {
  constructor(props) {
    super(props);
    let today = new Date();

    this.state = { 
      title: '',
      recordId: this.props.navigation.getParam("recordId", -1),  
      date: Dates.dateToPickerFormat(today),
      people: '',
    };

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    try {
      //update our dream record list with a new record corresponding with the recording we saved.
      AsyncStorage.getItem(DreamListKey)
      .then((DList) => {
        let DreamList = JSON.parse(DList);
        let record = DreamStore.makeRecord(this.state.recordId, this.state.title, Dates.formattedToDate(this.state.date), this.state.people);
        DreamList.unshift(record);

        AsyncStorage.setItem(DreamListKey, JSON.stringify(DreamList));
        //head back to home and wipe our actions
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Record' })],
        });
        this.props.navigation.dispatch(resetAction);
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