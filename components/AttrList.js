import React, {Component} from 'react';
import {Dimensions, View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import indexer from 'react-key-index';

export default class AttrList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagList: [],
      refreshTagList: false, //for making sure the flatlist re-renders
    };
  }

  _addTags(noun, removeTagFunc) {
    // let newTag = (
    //   <TouchableOpacity
    //     onPress = {() => {removeTagFunc(noun)}}
    //   >
    //     <Text>{noun}</Text>
    //   </TouchableOpacity>
    // );
    let newItem = {noun: noun, removeTagFunc: removeTagFunc}
    this.state.tagList.push(newItem)
    this.setState({
      refreshTagList: !this.state.refreshTagList,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tagSpace} >
          <FlatList horizontal={true}
            data = {this.state.tagList}
            extraData = {this.state.refreshTagList}
            keyExtractor={(item, index) => {return item.noun}}
            renderItem = {(item) => {
              console.log(JSON.stringify(item));
              return (
                <TouchableOpacity style={styles.nounBox}
                  onPress={() => {
                    console.log("Clicked noun: " + JSON.stringify(item));
                    item.item.removeTagFunc(item.item.noun);
                    let tagList = this.state.tagList;
                    let index = tagList.indexOf(item.item);
                    if (index > -1) {
                      tagList.splice(index, 1);
                    }
                    this.setState({
                      tagList: tagList,
                      refreshTagList: !this.state.refreshTagList
                    });
                  }}>
                  <Text>{item.item.noun}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={styles.textSpace} >
          <TextInput
            style={styles.textIn}
            onChangeText={(text) => this.props.inputHandler(text, this._addTags.bind(this))}
            placeholder="People who were involved"
            value={this.props.displayText}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  tagSpace: {
    width: '100%',
    height: '49%',
    marginBottom: '1%',
  },
  textSpace: {
    width: '100%',
    height: '50%',
  },
  textIn: {
    height: 40, 
    borderColor: 'black', 
    borderWidth: 2,
    padding: '1%',
  },
  nounBox: {
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5,
    justifyContent:'center',
    alignItems: 'center',
  }
});



