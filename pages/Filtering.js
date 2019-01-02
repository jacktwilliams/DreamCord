import React, {Component} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, TextInput, Button } from 'react-native'
import NavigationService from '../utility/NavigationService';
import DreamStore from '../utility/DreamStore';
import DatePicker from 'react-native-datepicker';
import Dates from '../utility/Dates';

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
    console.log("OLDEST MILIS: " + oldest);
    console.log("NEWEST MILIS: " + newest);
    
    for(let i = 0; i < list.length; ++i) {
      let dreamDate = Date.parse(list[i].date.toUTCString());
      console.log("DREAM DATE: " + dreamDate);
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

  filterList() {
    let filteredList = [];
    let fullDreamList = this.state.dreamList;
    let names = this.state.people.split(',');
    console.log("FILTER PAGE: Names to filter on: " + JSON.stringify(names));
    console.log("FULL DREAM LIST: " + JSON.stringify(fullDreamList));
    for(let i = 0; i < fullDreamList.length; ++i) {
      let dream = fullDreamList[i];
      console.log("DREAM: " + JSON.stringify(dream));
      let holdsSome = false;
      let holdsAll = true;
      for (let x = 0; x < names.length; ++x) {
        console.log("NAME: " + names[x]);
        let dreamHasPerson = dream.people.includes(names[x].toLowerCase());
        holdsSome = holdsSome || dreamHasPerson;
        holdsAll = holdsAll && dreamHasPerson;
      }

      if(!this.state.peopleOr && holdsAll) {
        //AND selector flipped on for people field and dream holds all people in text input
        console.log("Dream has all names. ");
        filteredList.push(dream);
      }
      else if(this.state.peopleOr && holdsSome) {
        //OR selector flipped on for people field and dream holds some people in text input
        console.log("Dream has at least one name.");
        filteredList.push(dream);
      }
    }
    
    console.log("FINAL FILTERED LIST: \n" + JSON.stringify(filteredList));
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

  applyFilter() {
    let filteredList = this.filterList();
    console.log("FILTER PAGE: Applying filters. Navigating home. Filtered list: \n" + JSON.stringify(this.state.filteredList));
    NavigationService.navigate("Home", {filteredList: filteredList});
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