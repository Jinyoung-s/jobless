import React, { useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity  } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { enableScreens } from 'react-native-screens';
import { auth } from "./firebaseConfig"; 
import LoginPage from "./src/screens/LoginPage";
import RegisterPage from "./src/screens/RegisterPage";
import ProfilePage from "./src/screens/ProfilePage";
import EditPage from "./src/screens/EditPage";
import PostDetail from "./src/screens/PostDetail2";
import ResetPage from "./src/screens/ResetPage";
import Chat from "./src/screens/ChatPage";
import Conversation from "./src/screens/ChatRoomPage";
import TabNavigator from "./src/screens/TabNavigator";
import DrawerBar from "./src/screens/DrawerBar"; // Optional custom drawer
import { NavigationProp } from '@react-navigation/native';
import { User } from 'firebase/auth';
import Icon from "react-native-vector-icons/MaterialIcons";
import { primaryColor } from "./src/styles/styles";

enableScreens();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator(); // Drawer Navigator

interface AuthLoadingScreenProps {
  navigation: NavigationProp<any>;
}

function AuthLoadingScreen({ navigation }: AuthLoadingScreenProps) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        navigation.replace("Main");
      } else {
        navigation.replace("Login");
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

// Drawer Navigator with screens
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={({ navigation }) => ({
        headerShown: true, // Changed to true to show the header
        headerStyle: {
          backgroundColor: primaryColor,
          borderBottomWidth: 0,
        },
        headerTintColor: "#ffffff",
          headerTitleStyle: {
          fontWeight: "500",
        },        
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Icon 
              name="menu"  // Changed to lowercase
              size={24}
              color="#ffffff"
            />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ 
          headerTitle: "Home",  // Added a title
        }} 
      />
      <Drawer.Screen name="Profile" component={ProfilePage} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Settings" component={ResetPage} />
    </Drawer.Navigator>
  );
}

function App({ navigation }: any) {
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
          component={DrawerNavigator} // Embed DrawerNavigator here
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Edit" component={EditPage} />
        <Stack.Screen name="Details" component={PostDetail} />
        <Stack.Screen name="Conversation" component={Conversation} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Reset" component={ResetPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;