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
      filteredList: [],
    };

    DreamStore.getDreamList()
    .then((list) => {
      this.setState({
        dreamList: list,
        filteredList: list,
      });
    });

    this.selectorPress = this.selectorPress.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  filterList() {
    let filteredList = [];
    let fullDreamList = this.state.dreamList;
    let names = this.state.people.split(',');
    for(let i = 0; i < fullDreamList; ++i) {
      let dream = fullDreamList[i];
      let holdsSome = false;
      let holdsAll = true;
      for (let x = 0; x < names.length; ++i) {
        let dreamHasPerson = dream.people.includes(names[i].toLowerCase());
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

    this.setState({
      filteredList: filteredList
    });
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
    this.filterList();
    NavigationService.navigate("Home", {filteredList: this.state.filteredList});
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