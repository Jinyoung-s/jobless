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
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.pictureContainer}>
          <Image source={defaultImage} style={styles.addpostPicture} resizeMode="contain"/>
        </View>
        <View style={styles.containerImage}>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          )}
        </View>

        <TouchableOpacity
          style={[styles.chooseImageButton, styles.containerCa]}
          onPress={handleChooseImage}
        >
          <MaterialIcons name="camera-alt" size={30} color="black" />
        </TouchableOpacity>

        <View>
          <TextInput
            style={styles.input_title}
            placeholder="Title"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
        </View>

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

        <View>
          <TextInput
            style={styles.description}
            multiline={true}
            numberOfLines={100}
            placeholder="Description"
            onChangeText={(text) => setDescription(text)}
            value={description}
          />
        </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F505205",
    padding: 20,   
  },
  pictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addpostPicture: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#FFFFFF',
  },
  containerImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  chooseImageButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    width: 50,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  containerCa: {
    position: 'absolute',
    bottom: 394,
    right: 80,
    backgroundColor: '#D3D3D3',
    borderRadius: 15,
    borderColor: '#4682B4',
    borderWidth: 2,
    padding: 5,
  },
  input_title: {
    width: '100%',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 10,
    marginBottom: 20,
  },
  inputPriceCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input_width50: {
    width: '48%',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 10,
  },
  description: {
    width: '100%',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 10,
    height: 200,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  createPostButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  createPostButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    },
  
  containerMargins: {
    marginHorizontal: 20,
    },
});

export default App;
