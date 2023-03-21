import React, { useState } from "react";
import { Button, Text, Input } from "galio-framework";
import { doc, getDocs, collection, where, updateDoc } from "firebase/firestore"; 
import { db, auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import defaultImage from '../assets/default-image.png'

import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal 
  } from "react-native";

function App () {
 
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthdate, setBirthday] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [birthDateError, setBirthDateError] = useState("");    
    const [image, setImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');


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
        // Get the document id of the first (and only) matching documents
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
                    })
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
    setPassword("");
    setFirstNameError("");
    setLastNameError("");
    setPasswordError("");
    setBirthDateError("");
  };

  const handleModalClear = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmNewPasswordError("");
  };

  const showDialog = () => {
    handleModalClear();
    setIsModalVisible(true);
  };

  const handlePassUpdateVal = () => {

    if (!validatePassword(newPassword)) {
      setNewPasswordError(
        "Invalid password! Must have: \n\n At least one letter \n At least one number \n At least one special character @, $, !, %, *, #, ?, &"
      );
    } else {
      setNewPasswordError("");
    }

    if (confirmNewPassword != newPassword) {
      setConfirmNewPasswordError(
        "Please ensure that new and confirm password match!"
      );
    } else {
      setConfirmNewPasswordError("");
      handlePasswordUpdate();
    }    
  }

  const handlePasswordUpdate = async () => {
    // Perform update action
    const user = auth.currentUser;
    const email = user.email;
    signInWithEmailAndPassword(auth, email, oldPassword)
    .then(() => {
      updatePassword(user, newPassword).then(() => {
        console.log("Update successful!")
        setIsModalVisible(false);
      }).catch((error) => {
        console.log("Error!")
      });
    })
    .catch((error) => { 
        console.error(error);
        setOldPasswordError(
          "Current Password is wrong!"
        );
    });
  };

  const handleCancel = () => {
    // Perform cancel action
    setIsModalVisible(false);
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
      backgroundColor:"white"
    },
    textInput: {
      height: 40,
      width: "80%",
      borderColor: "gray",
      borderWidth: 1,
      padding: 10,
      margin: 10,
      borderRadius:20
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
    passwordinput:{
      width:250,
      height:50,
      borderRadius:25
    },
  });


  // Return Content

  return (

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

        <TouchableOpacity onPress={showDialog}>
          <Text color="#4B0082"
                style={{
                  fontSize: 15,
                  marginBottom: 20,
                }}>Change Password</Text>           
        </TouchableOpacity>

        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.container}>
            <Text style={{ fontSize: 20 }}>Reset Password</Text>
            <Input password viewPass
              style={styles.passwordinput}
              placeholder="Old Password"
              value={oldPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => setOldPassword(text)}
            />
            {oldPasswordError !== "" && (
            <Text color = "red">{oldPasswordError}</Text>
            )}

            <Input password viewPass
              style={styles.passwordinput}
              placeholder="New Password"
              value={newPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => setNewPassword(text)}
            />
            {newPasswordError !== "" && (
            <Text color = "red">{newPasswordError}</Text>
            )}

            <Input password viewPass
              style={styles.passwordinput}
              placeholder="Confirm New Password"
              autoCapitalize="none"
              autoCorrect={false}
              value={confirmNewPassword}
              onChangeText={(text) => setConfirmNewPassword(text)}
            />
            {confirmNewPasswordError !== "" && (
            <Text color = "red">{confirmNewPasswordError}</Text>
            )}

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Button style={{ backgroundColor: "#0000FF"}} round size="small" onPress={handlePassUpdateVal}>Save</Button> 
              <Button style={{ backgroundColor: "#808080"}} round size="small" onPress={handleCancel}>Cancel</Button>
            </View>
          </View>
        </Modal>

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
          placeholder="Enter birthdate (MM/DD/YYYY)"
          value={birthdate}
          onChangeText={(text) => setBirthday(text)}
          maxLength={10}
        />
        {birthDateError !== "" && (
          <Text color = "red">{birthDateError}</Text>
        )}

        <Button round size="small" color="#0000FF" onPress={handleUpdate}>
          Update
        </Button>

        <Button round size="small" color="#FF4500" onPress={handleClear}>
          Clear
        </Button>
      </View>
   
  );
};

export default App;