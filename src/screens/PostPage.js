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
import defaultImage from "../assets/post-logo-removebg-preview.png";
import { Card } from "galio-framework";

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
        profileImg:
          userData && userData.profileImgURI
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

        <TextInput
          style={styles.input_title}
          placeholder="Title"
          onChangeText={(text) => setTitle(text)}
          value={title}
        />

        <View style={styles.inputPriceCategoryContainer}>
          <TextInput
            style={styles.input_width50}
            placeholder="Price"
            onChangeText={(text) => setPrice(text)}
            value={price}
          />
          <TextInput
            style={styles.input_width50}
            placeholder="Category"
            onChangeText={(text) => setCategory(text)}
            value={category}
          />
        </View>

        <TextInput
          style={styles.description}
          multiline={true}
          numberOfLines={100}
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

      {/* <View style={styles.container}>
        
      </View> */}
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
    bottom: 105,
    left: 50,
    backgroundColor: "#D3D3D3",
    padding: 10,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 1,
  },
  containerImage: {
    flex: 1,
    alignItems: "center",
  },
  inputContainer: {
    width: 300,
    alignItems: "center",
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
    bottom: 80,
    marginTop: 50,
    borderRadius: 10,
  },
  addpostPicture: {
    width: 190,
    height: 200,
    borderRadius: 10,
    marginBottom: 80,
    marginTop: 50,
    left: 100,
  },
  input_title: {
    borderColor: "transparent",
    borderWidth: 1,
    width: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 42,
  },
  inputPriceCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    left: 35,
  },
  input_width50: {
    width: '50%',
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    marginLeft: 10,
  },
  description: {
    borderColor: "transparent",
    borderWidth: 1,
    width: 300,
    height: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 42,
  },
  createPostButton: {
    backgroundColor: "#4682B4",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    width: 300,
    marginLeft: 42,
  },
  createPostButtonText: {
    fontSize: 16,
    color: "white", 
    textAlign: 'center',  
  },
  backgroundWhite: {
    backgroundColor: "#F505205",
  },
});

export default App;
