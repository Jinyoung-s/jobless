import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { auth, db, collection, addDoc } from "../../firebaseConfig";

export default class HomePage extends Component {
  render() {
    const handleLogout = () => {
      auth
        .signOut()
        .then((userCredential) => {
          console.log("LogOut successful");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    };

    const handleDatabase = async () => {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    return (
      <View>
        <Text> Home Screen </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDatabase}>
          <Text>insert</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
