import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getDocById } from "../Api/FirebaseDb";

const PostDetails = ({ route, navigation }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [src, setSrc] = useState("");
  const { postId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      console.log("postId?::" + postId);
      let data = await getDocById("post", postId);
      setTitle(data.title);
      setPrice(data.price);
      setCategory(data.category);
      setDescription(data.description);
      setSrc(data.image);

      /*
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
*/
      // console.log(itemsData);

      //setItems(itemsData);
      //setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    };

    fetchData();
  }, []);

  const handleSave = () => {
    // Implement save logic here
  };

  const handleCancel = () => {
    // Implement cancel logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Price:</Text>
          <TextInput
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            style={[styles.input, styles.priceInput]}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category:</Text>
          <TextInput
            placeholder="Enter price"
            value={category}
            style={[styles.input, styles.priceInput]}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: src }} style={styles.image} />
          <Text style={styles.imageLabel}>{description}</Text>
          <View style={styles.images}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    flexGrow: 1,
  },
  headerButtons: {
    flexDirection: "row",
  },
  saveButton: {
    backgroundColor: "#0000FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    borderRadius:25,
  },
  cancelButton: {
    backgroundColor: "#EF5350",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  priceInput: {
    flexGrow: 1,
  },
  imageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
  },
  imageLabel: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 200,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  addImageButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
});

export default PostDetails;
