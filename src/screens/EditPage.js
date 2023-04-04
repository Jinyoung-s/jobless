import React, { useState, useEffect } from "react";
import { Button, Text, Input } from "galio-framework";
import {
  doc,
  getDocs,
  collection,
  where,
  updateDoc,
  query,
} from "firebase/firestore";
import { db, auth, storage } from "../../firebaseConfig";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import defaultImage from "../assets/default-image.png";
import { saveDataWithId } from "../Api/FirebaseDb";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";

function App({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthday] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [image, setImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [profileImg, setprofileImg] = useState("");
  const [imgSuccessUpload, setImgSuccessUpload] = useState("");

  useEffect(() => {
    const userId = auth.currentUser.uid;
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
  }, []);

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

    navigation.navigate("Profile");
  };

  const postImage = async (result) => {
    if (!result) {
      return;
    }

    const userid = auth.currentUser.uid;
    const storageRef = ref(storage, `userImages/IMG-${userid}`);

    try {
      const response = await fetch(result.uri);
      const blob = await response.blob();

      const snapshot = await uploadBytes(storageRef, blob);
      console.log("Image uploaded successfully");
      const downloadURL = await getDownloadURL(snapshot.ref);

      const postData = {
        created: new Date(),
        imageURI: result.uri,
        imageURL: downloadURL,
        owner: userid,
      };

      saveDataWithId("profileimages", postData, userid);
      setprofileImg(result.uri);
    } catch (error) {
      console.log("Error uploading image: ", error);
    }
  };

  const updateUserData = async () => {
    // const auth = getAuth(app);
    // Get the uid of the currently signed-in user
    const uid = auth.currentUser.uid;
    // Query the users collection to get the document with the matching uid
    const userDocs = await getDocs(
      collection(db, "users"),
      where("uid", "==", uid)
    );
    // Check if there is a matching document
    if (userDocs.empty) {
      console.log("No matching documents.");
    } else {
      // Get the document id of the first (and only) matching documents
      const docId = userDocs.docs[0].id;
      console.log("Document id:", docId);

      //Update the user information
      const userRef = doc(db, "users", docId);
      try {
        if (firstName == "" || lastName == "" || birthdate == "") {
          console.log("Update Error!");
        } else {
          await updateDoc(userRef, {
            firstName: firstName,
            lastName: lastName,
            birthdate: birthdate,
          });
        }
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  };

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result);
      postImage(result);
    }

    if (postImage(result)) {
      setImgSuccessUpload("Image Uploaded!");
    } else {
      setImgSuccessUpload("");
    }

    //navigation.navigate("Profile");
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Profile', key: 'Profile' }],
    // });
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
  };

  const handlePasswordUpdate = async () => {
    // Perform update action
    const user = auth.currentUser;
    const email = user.email;
    signInWithEmailAndPassword(auth, email, oldPassword)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            console.log("Update successful!");
            setIsModalVisible(false);
          })
          .catch((error) => {
            console.log("Error!");
          });
      })
      .catch((error) => {
        console.error(error);
        setOldPasswordError("Current Password is wrong!");
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
      backgroundColor: "#F505205",
    },
    resetPasswordContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    containerImage: {
      flex: 1,
      alignItems: "center",
    },
    previewImage: {
      position: "absolute",
      width: 200,
      height: 200,
      bottom: 123,
      marginTop: 50,
      borderRadius: 10,
    },
    textInput: {
      height: 40,
      width: "80%",
      borderColor: "transparent",
      borderWidth: 1,
      padding: 10,
      margin: 10,
      borderRadius: 20,
      backgroundColor: "white",
    },
    profilePicture: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginBottom: 80,
      marginTop: 50,
    },
    containerCamera: {
      position: "absolute",
      bottom: 130,
      left: 45,
      backgroundColor: "#D3D3D3",
      padding: 10,
      borderRadius: 20,
      borderColor: "black",
      borderWidth: 1,
    },
    passwordinput: {
      width: 250,
      height: 50,
      borderRadius: 25,
      borderColor: "transparent",
      backgroundColor: "white",
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

      <Image
        source={profileImg ? { uri: profileImg } : defaultImage}
        style={styles.profilePicture}
      />
      <View style={styles.containerImage}>
        {image && (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        )}
      </View>

      <TouchableOpacity
        style={styles.chooseImageButton}
        onPress={handleChooseImage}
      >
        <View style={styles.containerCamera}>
          <MaterialIcons name="camera-alt" size={30} color="black" />
        </View>
      </TouchableOpacity>

      {imgSuccessUpload !== "" && (
        <Text
          color="#191970"
          style={{
            fontSize: 18,
            fontWeight: 700,
            position: "absolute",
            bottom: 420,
          }}
        >
          {imgSuccessUpload}
        </Text>
      )}

      <TouchableOpacity onPress={showDialog}>
        <Text
          color="#4B0082"
          style={{
            fontSize: 15,
            marginBottom: 20,
          }}
        >
          Change Password
        </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <View
          style={[
            styles.resetPasswordContainer,
            { backgroundColor: "#E8ECED" },
          ]}
        >
          <Text style={{ fontSize: 20 }}>Reset Password</Text>
          <Input
            password
            viewPass
            style={styles.passwordinput}
            placeholder="Old Password"
            value={oldPassword}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => setOldPassword(text)}
          />
          {oldPasswordError !== "" && (
            <Text color="red">{oldPasswordError}</Text>
          )}

          <Input
            password
            viewPass
            style={styles.passwordinput}
            placeholder="New Password"
            value={newPassword}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => setNewPassword(text)}
          />
          {newPasswordError !== "" && (
            <Text color="red">{newPasswordError}</Text>
          )}

          <Input
            password
            viewPass
            style={styles.passwordinput}
            placeholder="Confirm New Password"
            autoCapitalize="none"
            autoCorrect={false}
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
          />
          {confirmNewPasswordError !== "" && (
            <Text color="red">{confirmNewPasswordError}</Text>
          )}

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Button
              style={{ backgroundColor: "#4682B4" }}
              round
              size="small"
              onPress={handlePassUpdateVal}
            >
              Save
            </Button>
            <Button
              style={{ backgroundColor: "#808080" }}
              round
              size="small"
              onPress={handleCancel}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.textInput}
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      {firstNameError !== "" && <Text color="red">{firstNameError}</Text>}

      <TextInput
        style={styles.textInput}
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      {lastNameError !== "" && <Text color="red">{lastNameError}</Text>}

      <TextInput
        style={styles.textInput}
        placeholder="Enter birthdate (MM/DD/YYYY)"
        value={birthdate}
        onChangeText={(text) => setBirthday(text)}
        maxLength={10}
      />
      {birthDateError !== "" && <Text color="red">{birthDateError}</Text>}

      <Button round size="small" color="#4682B4" onPress={handleUpdate}>
        Update
      </Button>

      <Button round size="small" color="#FF4500" onPress={handleClear}>
        Clear
      </Button>
    </View>
  );
}

export default App;
