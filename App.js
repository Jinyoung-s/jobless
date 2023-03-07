import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./src/screens/LoginPage";
import MainPage from "./src/screens/MainPage";
import RegisterPage from "./src/screens/RegisterPage";
import ProfilePage from "./src/screens/ProfilePage";
import EditPage from "./src/screens/EditPage";
import PostDetails from "./src/screens/PostDetails";
import ResetPage from "./src/screens/ResetPage";

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
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Edit" component={EditPage} />
        <Stack.Screen name="Reset" component={ResetPage} />
        <Stack.Screen name="Details" component={PostDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
