import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { auth } from '../../firebaseConfig';


export default class HomePage extends Component {  
  render() {
    const handleLogout = () => {
        auth.signOut()
            .then((userCredential) => {       
            console.log('LogOut successful');
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            });
    }; 
     
    return (
      <View>
        <Text> Home Screen </Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
      </View> 
    )
  }
}
