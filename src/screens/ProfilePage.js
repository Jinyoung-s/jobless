import "firebase/firestore";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text, Card } from "galio-framework";
import { db, auth, storage } from "../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import defaultImage from "../assets/default-image.png";
import { Dimensions } from 'react-native';

function App({ navigation }) {
  const [profileImg, setprofileImg] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    profilePicture: null,
  });
  const screenWidth = Dimensions.get('window').width;

  const getUserData = async () => {
    try {
      // get the name of the current user
      const userId = auth.currentUser.uid;
      const q = query(collection(db, "users"), where("uid", "==", userId));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUser((prevState) => ({ ...prevState, ...doc.data() }));
        });
      });

      // Get the profile picture URL from storage
      const qu = query(
        collection(db, "profileimages"),
        where("owner", "==", userId)
      );

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
      padding: 1,   
      // borderColor: '#	#000000', // black   
      // borderWidth: '5px',
    },

    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      top: 5,
      width: '99%',
      // borderColor: '#FF0000', //red
      // borderWidth: '5px',
      
    },

    cardProfile: {
      margin: 10,
      borderRadius: 10,
      width: '96%',
      // borderColor: '#0000FF', // blue
      // borderWidth: '5px',
      backgroundColor: 'white',
      
    },

    profilePicture: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderColor: 'black',
      borderWidth: 1,
      overflow: 'hidden',
      marginLeft: 100,
    },
    profileInfo: {
      marginLeft: 10,
      marginTop: 20,
      marginBottom: 20,
      flex: 1,
    },

    edit: {
      marginLeft: 'auto',
      width: '30%',
    },

    text: {
      fontSize: 16,
      marginBottom: 10,
    },

    optionContainer: {
      flex: 1,
      justifyContent: 'top',
      alignItems: 'center',
    },
    cardOption: {
      borderRadius: 10,
      width: '95%',
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: 'white',
    },
    options: {
      flexDirection: 'row',
    },

    icon: {
      flex: 1,
      marginLeft: 40,
      marginBottom: 20,
    },

    signOut: {
      position: 'absolute',
      bottom: 20,
      left: '8%', 
      width: '80%',
      backgroundColor: '#FF4500',
    },

    separator: {
      fontSize: 40, 
      opacity: 0.1,
    },


  });

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Card style={styles.cardProfile}>
            <Image
              source={profileImg ? { uri: profileImg } : defaultImage}
              style={styles.profilePicture}
            />
            <View style={styles.profileInfo}>
              <Text size={20}>
              <Ionicons name="person" size={20} color="black" /> {user.firstName} {user.lastName}
              </Text>
              <Text size={20}>
                <Ionicons name="ios-mail" size={20} color="black" /> {user.email}
              </Text>
              <Text size={20}>
                <Ionicons name="egg" size={20} color="black" /> {user.birthdate}
              </Text>
            </View>
            <Button style={styles.edit} onPress={editProfile}>
                Edit
            </Button>
        </Card>
      </View>

      <View style={styles.optionContainer}>
        <Card style={styles.cardOption}>
            <View style={styles.options}>
              <Ionicons name="list" size={50} color="black" style={styles.icon} /> 
              <Text style={styles.separator}>|</Text>
              <Ionicons name="infinite" size={50} color="black" style={styles.icon} />
              <Text style={styles.separator}>|</Text>
              <Ionicons name="timer" size={50} color="black" style={styles.icon} />
            </View>
        </Card>
      </View>

      <View>
        <Button style={styles.signOut} onPress={handleLogout}>
          Sign Out
        </Button>
      </View>

    </View>
    
  );
}

export default App;
