import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./src/screens/LoginPage";
import MainPage from "./src/screens/MainPage";
import RegisterPage from "./src/screens/RegisterPage";
import ProfilePage from "./src/screens/ProfilePage";
import EditPage from "./src/screens/EditPage";
import PostDetails from "./src/screens/PostDetails";
import ResetPage from "./src/screens/ResetPage";
import Chat from "./src/screens/ChatPage";
import ChatRoom from "./src/screens/ChatRoomPage";
import { Text, View, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginPage}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Main"
          component={MainPage}
        />
        
        <Stack.Screen 
          name="Edit" 
          component={EditPage}
          options={{
            title: 'Edit',
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        
        <Stack.Screen 
          name="Details" 
          component={PostDetails}
          options={{
            title: 'Job Details',
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        
        />
        <Stack.Screen 
          name="ChatRoom" 
          component={ChatRoom}
          options={{
            title: 'Conversation',
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />

        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Reset" component={ResetPage} />
        <Stack.Screen name="Chat" component={Chat} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

  headerLeft: {   
    flexDirection: "row",
    alignItems: "flex-end",
    margin: '10px'
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#FFFFFF',
    
  },
});

export default App;
