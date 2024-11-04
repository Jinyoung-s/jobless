import React, {useEffect} from 'react';

import './gesture-handler';
import {View, ActivityIndicator, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {auth} from './firebaseConfig'; // Import your Firebase auth
import LoginPage from './src/screens/LoginPage';
import RegisterPage from './src/screens/RegisterPage';
import ProfilePage from './src/screens/ProfilePage';
import EditPage from './src/screens/EditPage';
import PostDetail from './src/screens/PostDetail2';
import ResetPage from './src/screens/ResetPage';
import Chat from './src/screens/ChatPage';
import Conversation from './src/screens/ChatRoomPage';
import TabNavigator from './src/screens/TabNavigator';
import {NavigationProp} from '@react-navigation/native';
import {User} from 'firebase/auth'; // Import User type from Firebase
import Home from './src/screens/HomePage';
import PostCreation from './src/screens/PostPage1';

// Enable screens for improved performance
enableScreens();

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Define the props type for the AuthLoadingScreen component
interface AuthLoadingScreenProps {
  navigation: NavigationProp<any>;
}

// function AuthLoadingScreen({navigation}: AuthLoadingScreenProps) {
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
//       // Explicitly typing user
//       if (user) {
//         navigation.replace('Main'); // Navigate to Main if the user is logged in
//       } else {
//         navigation.replace('Login'); // Navigate to Login if the user is not logged in
//       }
//     });

//     return () => unsubscribe();
//   }, [navigation]);

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <ActivityIndicator size="large" color="#0000ff" />
//     </View>
//   );
// }

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Profile" component={ProfilePage} />
    </Stack.Navigator>
  );
}
function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Post" component={PostCreation} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="BottomNav" component={BottomTabNavigator} />
      <Drawer.Screen name="Home2" component={HomeStack} />
      <Drawer.Screen name="Chat" component={Chat} />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}

export default App;
