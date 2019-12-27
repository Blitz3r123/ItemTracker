import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import 'react-native-gesture-handler';

import AddItem from './containers/AddItem';
import AsyncStorage from '@react-native-community/async-storage';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
      textInputPlaceholder: 'Type something',
      itemContent: ''
    };

    this.handlePress = this.handlePress.bind(this);
  }

  getData = async () => {
    try{
      let value = await AsyncStorage.getItem('items');
      if(value != null){
        return value;
      }
    }catch(e){
      console.log(e);
    }
  }

  handleItem = (text) => {
    this.setState({itemContent: text});
  }

  handleSubmit = async () => {
      try{
          let currentItems = this.state.items;
          let newItem = this.state.itemContent;

          if(newItem == ''){
            alert("You didn't put anything in!");
            this.textInput.clear();
          }else{
            currentItems.push(newItem);
  
            await AsyncStorage.setItem('items', JSON.stringify(currentItems));
            this.setState({items: currentItems.reverse()});
            this.setState({itemContent: ''});
            this.textInput.clear();
          }

      }catch(e){
          console.log(e);
      }
  }

  setData = async (key, data) => {
    await AsyncStorage.setItem(key, data);
  }

  handlePress = (index) => {
    Alert.alert(
      '',
      'Delete ' +this.state.items[index]+ '?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes', onPress: () => {
            let itemsArray = this.state.items;
            itemsArray.splice(index, 1);
            this.setData('items', JSON.stringify(itemsArray));
            this.setState({items: itemsArray});
          }
        },
      ],
      {cancelable: true},
    );
  }

  async UNSAFE_componentWillMount(){
    // Set items in the state
    let items = await this.getData();
    let itemsArray = JSON.parse(items);
    this.setState({items: itemsArray.reverse()});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.items.map((item, index) => {
            return <Text onPress={() => {this.handlePress(index)}} key={index} style={styles.item}>{item}</Text>
          })}
        </ScrollView>
        <View style={styles.addButton}>
          <TextInput ref={input => { this.textInput = input }} autoFocus={false} placeholder={this.state.textInputPlaceholder} style={styles.input} onChangeText={this.handleItem} onEndEditing={ this.handleSubmit }/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    // borderWidth: 1,
    width: Dimensions.get('window').width,
    paddingLeft: 20,
    paddingRight: 10,
    fontSize: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#eee'
  },
  addButton: {
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
    height: Dimensions.get('window').height * 0.1,
  },
  input: {
    // borderWidth: 1,
    backgroundColor: '#3cb9d8',
    height: '100%'
  }
});

const AppNavigator = createStackNavigator({
  Home: {
    screen: App,
    navigationOptions: ({navigation}) => ({title: 'Home'}),
  },
  AddItem: {
    screen: AddItem,
    navigationOptions: ({navigation}) => ({title: 'Add an Item'}),
  }
},
{
  initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);