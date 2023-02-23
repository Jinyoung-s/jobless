/**
 * the page for creating a post
 * 2/13/2023 created - jys
 * 2/23/2023 modified - jys
 */
import React, { useState } from "react";
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
import { storage } from "../../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { saveData } from "../Api/FirebaseDb";

const CreatePost = () => {
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

    const storageRef = ref(storage, `images/IMG${today.getTime()}`);
    //const uploadTask = uploadBytes(storageRef, image.path);
    //storageRef.putFile(image.path);

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
      };

      saveData("post", postData);
    } catch (error) {
      console.log("Error uploading image: ", error);
    }
  };

  return (
    <ScrollView style={styles.backgroundWhite}>
      <View>
        <TouchableOpacity
          style={styles.chooseImageButton}
          onPress={handleChooseImage}
        >
          <View style={styles.containerCa}>
            <MaterialIcons name="camera-alt" size={30} color="black" />
          </View>
        </TouchableOpacity>
        <View style={styles.containerImage}>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          )}
        </View>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerCa: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 70,
    marginLeft: 30,
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
  },
  chooseImageButtonText: {
    fontSize: 16,
    color: "white",
  },
  previewImage: {
    width: 300,
    height: 300,
    marginTop: 10,
  },
  input: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    width: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
  },
  input_title: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
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
  },
  description: {
    height: 150,
    borderColor: "gray",
    borderWidth: 1,
    width: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
  },
  createPostButton: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 5,
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

export default CreatePost;
