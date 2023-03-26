/**
 * the page for creating a post
 * 2/13/2023 created - jys
 * 2/23/2023 modified - jys
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage, auth } from "../../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { saveData, getUserData } from "../Api/FirebaseDb";
import defaultImage from "../assets/post-add-icon.png";

function App({ navigation }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result);
    }
  };

  const handleCreatePost = async () => {
    let today = new Date();

    const storageRef = ref(storage, `postImages/IMG${today.getTime()}`);
    const userData = await getUserData(auth.currentUser.uid);
    try {
      const snapshot = await uploadBytes(storageRef, image.uri);
      console.log("Image uploaded successfully");
      const downloadURL = await getDownloadURL(snapshot.ref);

      const postData = {
        title: title,
        image: image.uri,
        description,
        price,
        category,
        created: new Date(),
        owner: auth.currentUser.uid,
        profileImg: userData.profileImgURI
          ? userData.profileImgURI
          : defaultImage,
      };

      saveData("post", postData);
      navigation.navigate("Home");
    } catch (error) {
      console.log("Error uploading image: ", error);
    }
  };

  return (
    <ScrollView style={styles.backgroundWhite}>
      <View>
        <Image source={defaultImage} style={styles.addpostPicture} />
        <View style={styles.containerImage}>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          )}
        </View>
        <TouchableOpacity
          style={styles.chooseImageButton}
          onPress={handleChooseImage}
        >
          <View style={styles.containerCa}>
            <MaterialIcons name="camera-alt" size={30} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input_title}
          placeholder="Title"
          onChangeText={(text) => setTitle(text)}
          value={title}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input_width100}
            placeholder="Price"
            onChangeText={(text) => setPrice(text)}
            value={price}
          />
          <TextInput
            style={styles.input_width100}
            placeholder="Category"
            onChangeText={(text) => setCategory(text)}
            value={category}
          />
        </View>
        <TextInput
          style={styles.description}
          placeholder="Description"
          onChangeText={(text) => setDescription(text)}
          value={description}
        />
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={handleCreatePost}
        >
          <Text style={styles.createPostButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerCa: {
    position: "absolute",
    bottom: 85,
    left: 45,
    backgroundColor: "#D3D3D3",
    padding: 10,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 1,
  },
  containerImage: {
    flex: 1,
    marginLeft: 30,
  },
  inputContainer: {
    width: 300,
    alignItems: "flex-start",
  },
  chooseImageButton: {
    backgroundColor: "#white",
    padding: 10,
    borderRadius: 5,
    left: 180,
  },
  chooseImageButtonText: {
    fontSize: 16,
    color: "white",
  },
  previewImage: {
    position: "absolute",
    width: 200,
    height: 200,
    bottom: 60,
  },
  addpostPicture: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 80,
    marginTop: 50,
    left: 100,
  },
  input: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    width: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
  input_title: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
  input_width100: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: 100,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    alignItems: "left",
    borderRadius: 20,
  },
  description: {
    height: 150,
    borderColor: "gray",
    borderWidth: 1,
    width: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
  createPostButton: {
    backgroundColor: "#0000FF",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  createPostButtonText: {
    fontSize: 16,
    color: "white",
  },
  backgroundWhite: {
    backgroundColor: "white",
  },
});

export default App;
