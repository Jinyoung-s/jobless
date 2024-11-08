import React, {useEffect, useState} from 'react';

import './gesture-handler';
import {View, ActivityIndicator, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {auth} from './firebaseConfig'; // Import your Firebase auth
import LoginPage from './src/screens/LoginPage';
import {NavigationProp} from '@react-navigation/native';
import {User} from 'firebase/auth'; // Import User type from Firebase
import BottomTabNavigator from './src/screens/BottomTabNavigator';
import CustomDrawerContent from './src/screens/CustomDrawerContent';

// Enable screens for improved performance
enableScreens();

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Define the props type for the AuthLoadingScreen component
interface AuthLoadingScreenProps {
  navigation: NavigationProp<any>;
}

function AuthLoadingScreen({navigation}: AuthLoadingScreenProps) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      // Explicitly typing user
      if (user) {
        navigation.replace('Main'); // Navigate to Main if the user is logged in
      } else {
        navigation.replace('Login'); // Navigate to Login if the user is not logged in
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="Login"
        component={LoginPage}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Main"
        component={BottomTabNavigator} // Assuming TabNavigator is your main navigation
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

function App() {
  const [user, setUser] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user.uid);
    });
    console.log('USER ALERT', user);
    return () => unsubscribe();
  }, []);

  console.log('USER ALERT', user);
  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <LoginPage />}
    </NavigationContainer>
  );
}

export default App;
