import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebaseConfig";

function App({navigation}) { 
  const handleLogout = () => {
    auth
      .signOut()
      .then((userCredential) => {
        console.log("LogOut successful");
        navigation.navigate("Login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  return (
    <View>
    </View>
  );
}


export default App;