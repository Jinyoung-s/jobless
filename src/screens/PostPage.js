import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result);
    }
  };

  const handleUploadImage = () => {
    const storageRef = storage.ref(`images/${image.fileName}`);
    const uploadTask = storageRef.putFile(image.path);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        console.log(snapshot.bytesTransferred / snapshot.totalBytes);
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          const postData = {
            image: downloadURL,
            description,
            price,
            category,
          };
          firebase
            .database()
            .ref("posts/")
            .push(postData)
            .then(() => {
              Alert.alert("Success", "Post created successfully");
            });
        });
      }
    );
  };

  return (
    <View>
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
          style={styles.input}
          placeholder="Title"
          onChangeText={(text) => setPrice(text)}
          value={price}
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
          onPress={handleUploadImage}
        >
          <Text style={styles.createPostButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>
    </View>
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
});

export default CreatePost;
