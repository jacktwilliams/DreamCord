import React, {Component} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, TextInput, Button, AsyncStorage } from 'react-native'
import NavigationService from '../utility/NavigationService';
import DreamStore from '../utility/DreamStore';
import DatePicker from 'react-native-datepicker';
import Dates from '../utility/Dates';

const FILTERSTATEKEY = "FILTERSTATE";
export default class Filtering extends Component {

  constructor() {
    super();
    this.state = {
      people: '',
      peopleOr: false,
      dreamList: [],
      lowDate: new Date(0), //start as 1970
      highDate: new Date(0),
    };

    //first set our state with the persistent data we have saved. 
    let setStateWithParams = (params) => {
      this.setState({
        people: params.people,
        peopleOr: params.peopleOr,
      });
    };
    setStateWithParams = setStateWithParams.bind(this);
    this.getParameters()
    .then((params) => {
      setStateWithParams(params);
    });

    //load dream list (will be ready to be filtered), and find the default values for the datepickers.
    DreamStore.getDreamList()
    .then((list) => {
      let {oldest, newest} = this.getOldestAndNewestDates(list);
      console.log(oldest);
      this.setState({
        dreamList: list,
        lowDate: oldest,
        highDate: newest,
      });
    });

    this.selectorPress = this.selectorPress.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  getOldestAndNewestDates(list) {
    //note that we are comparing numericals. oldest and newest hold milleseconds
    let oldest = Date.now(); 
    let newest = Date.parse(new Date(0).toUTCString()); //TODO: look at better ways to get milliseconds
    
    for(let i = 0; i < list.length; ++i) {
      let dreamDate = Date.parse(list[i].date.toUTCString());
      if (dreamDate < oldest) {
        oldest = dreamDate;
      }
      if(dreamDate > newest) {
        newest = dreamDate;
      }
    }
    console.log("OLDEST FINAL: " + oldest + "\nOLDEST OBJ: " + Dates.dateToPickerFormat(new Date(oldest)));
    //was having trouble returning Date objects and working with them. Return as strings already in picker format, ready for state assignment
    return {oldest: Dates.dateToPickerFormat(new Date(oldest)), newest: Dates.dateToPickerFormat(new Date(newest))};
  }

  filterOnDate(fullDreamList) {
    let filteredList = [];
    let ceiling = Date.parse(Dates.formattedToDate(this.state.highDate).toUTCString());
    let floor = Date.parse(Dates.formattedToDate(this.state.lowDate).toDateString());

    for(let i = 0; i < fullDreamList.length; ++i) {
      let dreamDate = Date.parse(fullDreamList[i].date.toUTCString());
      if(floor <= dreamDate && dreamDate <= ceiling) {
        filteredList.push(fullDreamList[i]);
      }
    }

    return filteredList;
  }

  filterList(fullDreamList) {
    let filteredList = [];
    let names = this.state.people.split(',');

    for(let i = 0; i < fullDreamList.length; ++i) {
      let dream = fullDreamList[i];
      let holdsSome = false;
      let holdsAll = true;

      for (let x = 0; x < names.length; ++x) {
        let dreamHasPerson = dream.people.includes(names[x].toLowerCase());
        holdsSome = holdsSome || dreamHasPerson;
        holdsAll = holdsAll && dreamHasPerson;
      }

      if(!this.state.peopleOr && holdsAll) {
        //AND selector flipped on for people field and dream holds all people in text input
        filteredList.push(dream);
      }
      else if(this.state.peopleOr && holdsSome) {
        //OR selector flipped on for people field and dream holds some people in text input
        filteredList.push(dream);
      }
    }
    
    return filteredList;
  }

  //solely for handling OR/AND selectors
  selectorPress() {
    this.setState({
      peopleOr: !this.state.peopleOr
    });
  }

  _renderOrAndSelector() {
    return (
      <View style={styles.selectorCont}>
        <TouchableOpacity style={this.state.peopleOr ? [styles.selectorButtons, styles.selectedButton] : styles.selectorButtons} onPress={this.selectorPress}>
          <Text style={this.state.peopleOr ? {color: 'white'} : {color: 'black'}}>Or</Text>
        </TouchableOpacity>
        <TouchableOpacity style={this.state.peopleOr ? styles.selectorButtons : [styles.selectorButtons, styles.selectedButton]} onPress={this.selectorPress}>
          <Text style={this.state.peopleOr ? {color: 'black'} : {color: 'white'}}>And</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  //go back to home. Send filtered list. We will save our filter parameters to be persistent.
  applyFilter() {
    let fullList = this.state.dreamList;
    let filteredList = this.filterList(fullList);
    filteredList = this.filterOnDate(filteredList);
    console.log("FILTER PAGE: Applying filters. Navigating home. Filtered list: \n" + JSON.stringify(filteredList));
    NavigationService.navigate("Home", {filteredList: filteredList});
    this.saveParameters();
  }

  saveParameters() {
    AsyncStorage.setItem(FILTERSTATEKEY, JSON.stringify({
      people: this.state.people,
      peopleOr: this.state.peopleOr,
    }));
  }

  async getParameters() {
    let stringParams = await AsyncStorage.getItem(FILTERSTATEKEY);
    return await JSON.parse(stringParams); 
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputCont}>
          <Text style={styles.labelText}>People</Text>
          <View style={styles.innerInputCont}>
            <TextInput
              style={[styles.textIn, styles.inputObj]}
              onChangeText={(text) => this.setState({people: text})}
              placeholder="Filter based on people involved"
              value={this.state.people}
            />
            {this._renderOrAndSelector()}
          </View>
        </View>
        <View style={styles.inputCont}>
          <Text style={styles.labelText}>Occured After: </Text>
          <DatePicker
            format="YYYY-MM-DD"
            style={{width: 200}}
            date={this.state.lowDate}
            onDateChange={(newD) => {this.setState({lowDate: newD})}}
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
          <Text style={styles.labelText}>Date</Text>
          <DatePicker
            format="YYYY-MM-DD"
            style={{width: 200}}
            date={this.state.highDate}
            onDateChange={(newD) => {this.setState({highDate: newD})}}
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
        <Button title="Apply Filter" onPress={this.applyFilter} />
      </View>
    );
  }
}
var {height, width} = Dimensions.get('window');
var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    alignItems: 'stretch',
    alignSelf: 'center',
    marginTop: height * .03,
  },
  textIn: {
    height: 40, 
    borderColor: 'black', 
    borderWidth: 2,
    padding: '1%',
  },
  labelText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: height * .01,
    left: -5
  },
  inputCont: {
    marginBottom: height * .03,
  
  },
  selectorButtons: {
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'black',
  },
  selectorCont: {
    height: 40,
    marginLeft: width * .02,
    marginRight: width * .02

  },
  innerInputCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});