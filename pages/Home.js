import React, {Component} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import DreamStore from '../utility/DreamStore';


export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      dreamList: [],
      refresh: false, //tells flatList to re-render
      selectedDreams: new Set(),
    };

    DreamStore.getDreamList()
    .then((list) => {
      this.setState({
        dreamList: list,
        refresh: !this.state.refresh
      });
    });

    this._renderRecord = this._renderRecord.bind(this);
    this.handleRecordPress = this.handleRecordPress.bind(this);

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

  _renderRecord(record) {
    if(this.state.selectedDreams.has(record.item.id)) {
      return (
        <View style={styles.recordCont}>
          <TouchableOpacity onPress={() => {this.handleRecordPress(record.item.id)}}>
            <Text>{record.item.title}</Text>
          </TouchableOpacity>
          <Text>HEY TEST</Text>
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

  render() {
    return (
      <View style={styles.container}>
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

  }
});