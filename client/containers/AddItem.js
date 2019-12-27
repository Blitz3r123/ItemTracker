import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Dimensions, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import App from './../App';

export default class AddItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            textInputPlaceholder: 'Type something',
            itemContent: '',
            items: []
        };
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

    async UNSAFE_componentWillMount(){
        let items = JSON.parse(await this.getData());
        this.setState({items: items});
    }


    handleItem = (text) => {
        this.setState({itemContent: text});
    }

    handleSubmit = async () => {
        try{
            let currentItems = this.state.items;
            let newItem = this.state.itemContent;

            currentItems.push(newItem);

            await AsyncStorage.setItem('items', JSON.stringify(currentItems));
            this.props.navigation.navigate('Home');
        }catch(e){
            console.log(e);
        }
    }

    render(){
        return(
            <View>
                <TextInput autoFocus={true} placeholder={this.state.textInputPlaceholder} style={styles.input} onChangeText={this.handleItem} onEndEditing={ this.handleSubmit }/>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    input: {
        borderWidth: 1,
    }
});