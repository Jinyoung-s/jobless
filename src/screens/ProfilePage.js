import 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from "galio-framework";
import { db, auth, storage } from "../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore"; 
import { Ionicons } from "@expo/vector-icons";
import defaultImage from '../assets/default-image.png';

function App ({navigation}) {
  const [profileImg, setprofileImg] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    profilePicture: null,
  });  

  const getUserData = async () => {
    try {
      const userId = auth.currentUser.uid;
      const q = query(collection(db, "users"), where("uid", "==", userId));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUser(prevState => ({...prevState, ...doc.data()})); 
        });

      });

      // Get the profile picture URL from storage
      const qu = query(collection(db, "profileimages"), where("owner", "==", userId));
      getDocs(qu).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setprofileImg(doc.data().imageURI);  
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F505205",
    },
    
    editProf: {
      position: "absolute",
      bottom: 80,
    },
    signOut: {
      position: "absolute",
      bottom: 20,
    },
    profilePicture: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginBottom: 100,
      marginTop: -200,
      borderColor: 'black',
      borderWidth: 1,
      overflow: 'hidden',
    },
  });


  return (
    <View style={styles.container}>

      <Image source={profileImg ? { uri: profileImg } : defaultImage} style={styles.profilePicture} />  
      <Text size={30}>{user.firstName} {user.lastName}</Text>
      <Text size={20} style={styles.text}><Ionicons name="ios-mail" size={20} color="black"/> {user.email}</Text>
      <Text size={20}><Ionicons name="egg" size={20} color="black"/> {user.birthdate}</Text>
      
      {/* Add any other relevant data */}
      <Button style={styles.editProf} round size="small" color="#4682B4" onPress={editProfile}>
          Edit Profile
      </Button>
      <Button style={styles.signOut} round size="small" color="#FF4500" onPress={handleLogout}>
          Sign Out
      </Button>

    </View>
  );
}

export default App;
