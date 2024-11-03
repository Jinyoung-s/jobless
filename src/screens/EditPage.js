import React, { useState, useEffect } from "react";
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
import { launchImageLibrary } from "react-native-image-picker";
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
  Text,
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
  const [profileImg, setProfileImg] = useState("");
  const [imgSuccessUpload, setImgSuccessUpload] = useState("");

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const qu = query(
      collection(db, "profileimages"),
      where("owner", "==", userId)
    );
    getDocs(qu).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setProfileImg(doc.data().imageURI);
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
      setProfileImg(result.uri);
    } catch (error) {
      console.log("Error uploading image: ", error);
    }
  };

  const updateUserData = async () => {
    const uid = auth.currentUser.uid;
    const userDocs = await getDocs(
      collection(db, "users"),
      where("uid", "==", uid)
    );
    if (userDocs.empty) {
      console.log("No matching documents.");
    } else {
      const docId = userDocs.docs[0].id;
      console.log("Document id:", docId);

      const userRef = doc(db, "users", docId);
      try {
        if (firstName === "" || lastName === "" || birthdate === "") {
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

  const handleChooseImage = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
        return;
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
        return;
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];

        setImage(selectedImage);
        postImage(selectedImage);

        if (postImage(selectedImage)) {
          setImgSuccessUpload("Image Uploaded!");
        } else {
          setImgSuccessUpload("");
        }
      }
    });
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setBirthday("");
    setOldPassword("");
    setFirstNameError("");
    setLastNameError("");
    setOldPasswordError("");
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

    if (confirmNewPassword !== newPassword) {
      setConfirmNewPasswordError(
        "Please ensure that new and confirm password match!"
      );
    } else {
      setConfirmNewPasswordError("");
      handlePasswordUpdate();
    }
  };

  const handlePasswordUpdate = async () => {
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
            console.log("Error!", error);
          });
      })
      .catch((error) => {
        console.error(error);
        setOldPasswordError("Current Password is wrong!");
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
    },
    text: {
      color: "black",
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
    },
    textInput: {
      height: 40,
      borderColor: "black",
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
      width: "80%",
    },
    buttonContainer: {
      flexDirection: "row",
      marginTop: 20,
      width: "80%",
      justifyContent: "space-between",
    },
    button: {
      backgroundColor: "#007bff",
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "80%",
    },
    modalTextInput: {
      height: 40,
      borderColor: "black",
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    modalButton: {
      backgroundColor: "#007bff",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    modalButtonText: {
      color: "white",
    },
    profileImage: {
      width: 200,
      height: 200,
      borderRadius: 100,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Profile</Text>
      <View style={styles.containerImage}>
        <TouchableOpacity onPress={handleChooseImage}>
          <Image
            source={profileImg ? { uri: profileImg } : defaultImage}
            style={styles.previewImage}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={{ color: "red" }}>{firstNameError}</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <Text style={{ color: "red" }}>{lastNameError}</Text>

      <TextInput
        style={styles.textInput}
        placeholder="MM/DD/YYYY"
        value={birthdate}
        onChangeText={setBirthday}
      />
      <Text style={{ color: "red" }}>{birthDateError}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={showDialog}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Change Password</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Old Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <Text style={{ color: "red" }}>{oldPasswordError}</Text>

            <TextInput
              style={styles.modalTextInput}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Text style={{ color: "red" }}>{newPasswordError}</Text>

            <TextInput
              style={styles.modalTextInput}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            <Text style={{ color: "red" }}>{confirmNewPasswordError}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handlePassUpdateVal}
              >
                <Text style={styles.modalButtonText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {imgSuccessUpload && <Text>{imgSuccessUpload}</Text>}
    </View>
  );
}

export default App;
