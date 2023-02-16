import 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text } from "galio-framework";
import { db, auth } from "../../firebaseConfig";
import { doc, getDocs, collection, query, where } from "firebase/firestore"; 

function App () {
  const [user, setUser] = useState("");

  const getUserData = async () => {
    try {
      const userId = auth.currentUser.uid;
      const q = query(collection(db, "users"), where("uid", "==", userId));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
          console.log(doc.data());    
        });

      });
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  };
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {    
        getUserData();  
      } 
    });
    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Text>First Name: {user.firstName}</Text>
      <Text>Last Name: {user.lastName}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Birth Date: {user.birthdate}</Text>
      
      {/* Add any other relevant data */}
    </View>
  );
}

export default App;
