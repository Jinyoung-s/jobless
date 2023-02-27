import React, { useEffect, useState } from "react";
import { Button, Text } from "galio-framework";
import { getAuth, updateEmail, updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDocs, collection, query, where, updateDoc } from "firebase/firestore"; 
import { db, auth, app  } from "../../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import defaultImage from '../assets/default-image.png'

import {
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image
  } from "react-native";

function App ({navigation}) {
 
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


    const handleUpdate = () => {
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

    // if (!validatePassword(password)) {
    //   setPasswordError(
    //     "Invalid password! Must have: \n\n At least one letter \n At least one number \n At least one special character @, $, !, %, *, #, ?, &"
    //   );
    // } else {
    //   setPasswordError("");
    // }

    if (!validateBirthDate(birthdate)) {
      setBirthDateError('Invalid Date! Must be in the format "MM/DD/YYYY"');
    } else {
      setBirthDateError("");
    }

    updateUserData();
  };
  
  const updateUserData = async () => {

        // const auth = getAuth(app);
        // Get the uid of the currently signed-in user
        const uid = auth.currentUser.uid;
        // Query the users collection to get the document with the matching uid
        const userDocs = await getDocs(collection(db, "users"), where("uid", "==", uid));
        // Check if there is a matching document
        if (userDocs.empty) {
        console.log("No matching documents.");
        } else {
        // Get the document id of the first (and only) matching document
        const docId = userDocs.docs[0].id;
        console.log("Document id:", docId);  

        //Update the user information
        const userRef = doc(db, 'users', docId);
            try {
                if(firstName == "" || lastName == "" || birthdate == ""){
                    console.log("Update Error!");
                }else{
                    await updateDoc(userRef, { 
                        firstName: firstName,
                        lastName: lastName,
                        birthdate: birthdate,
                        email: email, 
                    })
                    const newEmail = email;
                    console.log(newEmail);
                    // Create a credential with the user's current email and password
                    const userAuth = auth.currentUser;

                    if (userAuth) {
                        const { emailAuth, passwordAuth } = userAuth;
                        const cred = EmailAuthProvider.credential(emailAuth, passwordAuth);
                        reauthenticateWithCredential(userAuth, cred)
                          .then(() => {
                            user.updateEmail(newEmail)
                              .then(() => console.log('Email updated successfully'))
                              .catch((error) => console.error('Error updating email:', error));
                          })
                          .catch((error) => console.error('Error re-authenticating user:', error));
                      } else {
                        console.error('User is not signed in');
                      }


                    // const cred = EmailAuthProvider.credential(user.email, user.password);
                    // reauthenticateWithCredential(auth.currentUser, cred)
                    //     .then(() => {
                    //         updateEmail(auth.currentUser, newEmail).then(() => {
                    //             console.log(auth.currentUser);
                    //         }).catch((error) => {
                    //             console.log(error);
                    //         // ...
                    //         });
                    //     })
                    //     .catch((error) => {
                    //         console.error('Error re-authenticating user:', error);
                    //     });    

                    // console.log(auth.currentUser);
                    // console.log('Document updated successfully');
                };
            
            } catch (e) {
            console.error('Error updating document: ', e);
            }
        }
        
    };

    const handleChooseImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync();
  
      if (!result.canceled) {
        setImage(result);
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


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    textInput: {
      height: 40,
      width: "80%",
      borderColor: "gray",
      borderWidth: 1,
      padding: 10,
      margin: 10,
    },
    profilePicture: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginBottom: 80,
      marginTop: 50,
      // borderColor: 'black',
      // borderWidth: 1,
      // overflow: 'hidden',
    },
    containerCamera: {
      // flex: 1,
      // backgroundColor: "gray",
      // borderRadius: 10,
      // padding: 20,
      // width: 70,

      position: 'absolute',
      bottom: 85,
      left: 45,
      backgroundColor: '#D3D3D3',
      padding: 10,
      borderRadius: 20,
      borderColor: 'black',
      borderWidth: 1,
    },
  });

  // Return Content

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginTop: 10 }}>
          Update your profile
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "bold",
            fontStyle: "italic",
            marginBottom: 5,
          }}
        >
          You know what to do...
        </Text>

        <Image source={defaultImage} style={styles.profilePicture} />  

        <TouchableOpacity style={styles.chooseImageButton} onPress={handleChooseImage}>
          <View style={styles.containerCamera}>
            <MaterialIcons name="camera-alt" size={30} color="black" />
          </View>
        </TouchableOpacity>


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

        {/* <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Enter password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {passwordError !== "" && (
          <Text color = "red">{passwordError}</Text>
        )} */}

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

        <Button round size="small" color="#4169E1" onPress={handleUpdate}>
          Update
        </Button>

        <Button round size="small" color="#808080" onPress={handleClear}>
          Clear
        </Button>

      </View>
    </ScrollView>
  );
};

export default App;