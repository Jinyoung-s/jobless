import 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Text } from "galio-framework";
import { db, auth } from "../../firebaseConfig";
import { doc, getDocs, collection, query, where } from "firebase/firestore"; 
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

function App ({navigation}) {
  const [user, setUser] = useState("");
  const [image, setImage] = useState(null);

  const getUserData = async () => {
    try {
      const userId = auth.currentUser.uid;
      const q = query(collection(db, "users"), where("uid", "==", userId));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
          // console.log(doc.data());    
        });

      });
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  };

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

  const editProfile = () => {
    navigation.navigate("Edit");
  };
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {    
        getUserData();  
      } 
    });
    return () => unsubscribe();
  }, []);

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
    },
    containerCamera: {
      flex: 1,
      backgroundColor: "gray",
      borderRadius: 10,
      padding: 20,
      width: 70,
    },
    editProf: {
      position: "absolute",
      bottom: 80,
    },
    signOut: {
      position: "absolute",
      bottom: 20,
    },
  });

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.chooseImageButton} onPress={handleChooseImage}>
          <View style={styles.containerCamera}>
            <MaterialIcons name="camera-alt" size={30} color="black" />
          </View>
        </TouchableOpacity>
      
      <Text size={30}>{user.firstName} {user.lastName}</Text>
      <Text size={30}><Ionicons name="ios-mail" size={30} color="black"/> {user.email}</Text>
      <Text size={30}><Ionicons name="egg" size={30} color="black"/> {user.birthdate}</Text>
      
      {/* Add any other relevant data */}
      <Button style={styles.editProf} round size="small" color="#0000FF" onPress={editProfile}>
          Edit Profile
      </Button>
      <Button style={styles.signOut} round size="small" color="#FF4500" onPress={handleLogout}>
          Sign Out
      </Button>

    </View>
  );
}

export default App;
