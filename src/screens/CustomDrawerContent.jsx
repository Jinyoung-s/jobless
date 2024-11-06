import * as React from 'react';
import {View, Button} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

const handleSignOut = () => {
  auth
    .signOut()
    .then(userCredential => {
      console.log('Sign out successful');
      navigation.navigate('Login');
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Settings"
        onPress={() => {
          props.navigation.navigate('Settings');
        }}
      />
      <View style={{flex: 1}} />
      <Button
        title="Logout"
        onPress={() => {
          handleSignOut();
        }}
      />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
