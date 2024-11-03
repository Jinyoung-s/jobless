import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { auth } from "./firebaseConfig"; // Import your Firebase auth
import LoginPage from "./src/screens/LoginPage";
import RegisterPage from "./src/screens/RegisterPage";
import ProfilePage from "./src/screens/ProfilePage";
import EditPage from "./src/screens/EditPage";
import PostDetail from "./src/screens/PostDetail2";
import ResetPage from "./src/screens/ResetPage";
import Chat from "./src/screens/ChatPage";
import Conversation from "./src/screens/ChatRoomPage";
import TabNavigator from "./src/screens/TabNavigator";
import { NavigationProp } from '@react-navigation/native';
import { User } from 'firebase/auth'; // Import User type from Firebase

// Enable screens for improved performance
enableScreens();
const Stack = createNativeStackNavigator();

// Define the props type for the AuthLoadingScreen component
interface AuthLoadingScreenProps {
  navigation: NavigationProp<any>;
}

function AuthLoadingScreen({ navigation }: AuthLoadingScreenProps) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => { // Explicitly typing user
      if (user) {
        navigation.replace("Main"); // Navigate to Main if the user is logged in
      } else {
        navigation.replace("Login"); // Navigate to Login if the user is not logged in
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator} // Assuming TabNavigator is your main navigation
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Edit" component={EditPage} />
        <Stack.Screen name="Details" component={PostDetail} />
        <Stack.Screen name="Conversation" component={Conversation} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Reset" component={ResetPage} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
