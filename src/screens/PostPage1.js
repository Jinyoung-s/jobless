import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Card, Input, Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { saveData, getUserData } from "../Api/FirebaseDb";
import { storage, auth } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PostCreation = () => {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const selectPhotos = () => {
    const options = {
      title: "Select Photos",
      mediaType: "photo",
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        setPhotos([...photos, response]);
      }
    });
  };

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setPhotos([...photos, result]);
    }
  };

  const renderPhotos = () => {
    return photos.map((photo, index) => (
      <Image key={index} source={{ uri: photo.uri }} style={styles.photo} />
    ));
  };

  const submitPost = async () => {
    console.log("Title:", title);
    console.log("Price:", price);
    console.log("Description:", description);
    console.log("Photos:", photos);
    let today = new Date();
    const uploadPromises = [];

    for (let i = 0; i < photos.length; i++) {
      const response = await fetch(photos[i].uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `postImages/IMG${today.getTime()}_${i}`);
      uploadPromises.push(uploadBytes(storageRef, blob));
    }

    try {
      const snapshots = await Promise.all(uploadPromises);
      const downloadURLs = await Promise.all(
        snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
      );

      const userData = await getUserData(auth.currentUser.uid);
      const postData = {
        title: title,
        images: downloadURLs,
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
      // navigation.navigate("Home");
    } catch (error) {
      console.log("Error uploading image: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.uploadPhotosSection}>
        <View>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Upload Photos (Max 10)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Icon
              name="add-a-photo"
              type="material"
              size={70}
              onPress={handleChooseImage}
              containerStyle={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
              }}
            />
            {renderPhotos()}
          </ScrollView>
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Title</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Price</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter price"
          value={price}
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Category</Text>
        <Picker
          style={styles.input_width50}
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        ></Picker>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.inputField, styles.descriptionField]}
          placeholder="Enter description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
        />
      </View>

      <View style={styles.submitButtonSection}>
        <Button title="Submit" onPress={submitPost} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  uploadPhotosSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  addPhotoButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  addPhotoButtonText: {
    color: "#007AFF", // Blue color
  },
  inputSection: {
    marginBottom: 20,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  descriptionField: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButtonSection: {
    marginTop: 20,
  },
  input_width50: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 6,
    borderRadius: 5,
  },
});

export default PostCreation;
