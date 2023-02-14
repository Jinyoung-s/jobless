import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import 'firebase/firestore';
import { Button, Text } from "galio-framework";
import { db, auth } from "../../firebaseConfig";

export default function App () {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection('users')
          .doc(user.uid)
          .get()
          .then((doc) => {
            setUserData(doc.data());
          });
      } else {
        setUserData({});
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Text>First Name: {userData.firstName}</Text>
      <Text>Last Name: {userData.lastName}</Text>
      <Text>Email: {userData.email}</Text>
      
      {/* Add any other relevant data */}
    </View>
  );
}


