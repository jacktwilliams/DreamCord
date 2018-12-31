import React, {Component} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, TextInput, Button } from 'react-native'
import NavigationService from '../utility/NavigationService';
import DreamStore from '../utility/DreamStore';

export default class Filtering extends Component {

  constructor() {
    super();
    this.state = {
      people: '',
      peopleOr: false,
      dreamList: [],
    };

    DreamStore.getDreamList()
    .then((list) => {
      this.setState({
        dreamList: list,
      });
    });

    this.selectorPress = this.selectorPress.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.filterList = this.filterList.bind(this);
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