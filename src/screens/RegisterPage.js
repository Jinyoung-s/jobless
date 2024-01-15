import { db } from "../../firebaseConfig";
import { collection, addDoc, doc, setDoc, updateDoc  } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Button, Text } from "galio-framework";
import React, { useState, useEffect } from "react";
import { Switch } from 'react-native-switch';
import Geolocation from 'react-native-geolocation-service';
import { Ionicons, AntDesign, Foundation } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image
} from "react-native";

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthday] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [image, setImage] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Validator upon clicking the Submit button
  const handleSubmit = () => {
    if (!isValidFirstName(firstName)) {
      setFirstNameError("Invalid First Name");
    } else {
      setFirstNameError("");
    }

    if (!isValidLastName(lastName)) {
      setLastNameError("Invalid Last Name");
    } else {
      setLastNameError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email");
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Invalid password! Must have: \n\n At least one letter \n At least one number \n At least one special character @, $, !, %, *, #, ?, &"
      );
    } else {
      setPasswordError("");
    }

    if (!validateBirthDate(birthdate)) {
      setBirthDateError('Invalid Date! Must be in the format "MM/DD/YYYY"');
    } else {
      setBirthDateError("");
    }

    const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          addUserData();
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
  };

  
  const addUserData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const docRef = await addDoc(collection(db, "users"), {
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthdate: birthdate,        
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Clear Text Input

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setBirthday("");
    setEmail("");
    setPassword("");
    setFirstNameError("");
    setLastNameError("");
    setPasswordError("");
    setEmailError("");
    setBirthDateError("");
  };

  // Regex Expression

  const isValidFirstName = (firstName) => {
    const regexFirstName = /^[a-zA-Z]+$/;
    return regexFirstName.test(firstName);
  };

  const isValidLastName = (lastName) => {
    const regexLastName = /^[a-zA-Z]+$/;
    return regexLastName.test(lastName);
  };

  const validateEmail = (email) => {
    var regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexEmail.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const regexPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regexPassword.test(password);
  };

  const validateBirthDate = (birthdate) => {
    const regexBirthDate =
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
    return regexBirthDate.test(birthdate);
  };

  // Handle Functions
  const handleLogin = () => {
    navigation.navigate("LoginPage");
  };

  useEffect(() => {
    if (locationEnabled) {
      // Request location permission and start tracking
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('Current Position:', position);
          // Do something with the location data
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      // Stop tracking or perform any cleanup when location is disabled
    }
  }, [locationEnabled]);

  const handleToggle = () => {
    setLocationEnabled(!locationEnabled);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:"#F505205"
    },
    textInput: {
      height: 40,
      width: "80%",
      borderColor: "transparent",
      borderWidth: 1,
      padding: 10,
      margin: 10,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
    },

    header: {
      width: '100%',
      borderWidth: 1,
      borderColor: 'red',
    },

    headerSub: {
      flexDirection: 'row-reverse',
      marginRight: 50,
    },

    optional: {
      fontSize: 12,
      flexDirection: 'row',
      marginLeft: 50,
    },

    icon: {
      marginRight: 5,
    },

  

    image:{
      height:150,
      width:150,
      borderColor: 'transparent',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 5,
      
    },

    button:{
      borderColor: 'transparent',
      borderRadius: 50,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 5,
  },
  });

  // Return Content

  return (
      <View style={styles.container}>
        <Image style={styles.image} source={require("../assets/Official-Jobless-logo-updated.png")}/>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginTop: 10 }}>
          Sign Up Now
        </Text>
       

        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        {firstNameError !== "" && (
          <Text color = "red">{firstNameError}</Text>
        )}

        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        {lastNameError !== "" && (
          <Text color = "red">{lastNameError}</Text>
        )}

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {emailError !== "" && (
          <Text color = "red">{emailError}</Text>
        )}

        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Enter password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {passwordError !== "" && (
          <Text color = "red">{passwordError}</Text>
        )}

        <TextInput
          style={styles.textInput}
          placeholder="Enter birthdate (MM/DD/YYYY)"
          value={birthdate}
          onChangeText={(text) => setBirthday(text)}
          // keyboardType="default"
          maxLength={10}
        />
        {birthDateError !== "" && (
          <Text color = "red">{birthDateError}</Text>
        )}

        

        <View style={styles.header}>
          <Text style={styles.optional}>(optional)</Text> 
          <View style={styles.headerSub}> 
            <Ionicons name="md-help-circle" size={24} color="black" style={styles.icon} />
            <Ionicons name="md-information-circle" size={24} color="black" style={styles.icon} />
          </View>
         
        </View>

        <Text>
        Allow app to activate location while using it?
        </Text>

        <Switch
          value={locationEnabled}
          onValueChange={handleToggle}
          disabled={false}
          activeText={'Yes'}
          inActiveText={'No'}
          backgroundActive={'green'}
          backgroundInactive={'gray'}
          circleActiveColor={'#30a566'}
          circleInActiveColor={'#000000'}
        />    

        <Button round style={styles.button} size="small" color="#4682B4" onPress={handleSubmit}>
          Submit
        </Button>

        <Button round style={styles.button} size="small" color="#FF4500" onPress={handleClear}>
          Clear
        </Button>

        
        <Text>
          Go back to
          <TouchableOpacity onPress={handleLogin}>
            <Text color="#4169E1"> Login</Text>
          </TouchableOpacity>
        </Text>        
        </Text>       
      </View>
  );
}

export default App;
