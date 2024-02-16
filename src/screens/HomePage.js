import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

import {
  getCollection,
  getCollectionByOrder,
  getCollectionByQuery,
} from "../Api/FirebaseDb";
import React, { useState, useEffect, useCallback } from "react";
import { db, collection, auth } from "../../firebaseConfig";
import { Button, Card } from "galio-framework";
import {
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import defaultImage from "../assets/default-image.png";
import { useFocusEffect } from "@react-navigation/native";

function App({ navigation }) {
  const [items, setItems] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [profileImg, setprofileImg] = useState("");

  const handleLogout = () => {
    auth
      .signOut()
      .then((userCredential) => {
        console.log("LogOut successful");
        navigation.navigate("Login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const openDetails = (postingId) => {
    navigation.navigate("Details", { postId: postingId });
  };

  const fetchData = async () => {
    let snapshot = await getCollectionByOrder("post", "created", 20);
    console.log(snapshot);
    const itemsData = await snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(itemsData);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    console.log("This: " + itemsData.owner);

    // Get the profile picture in the profileimages collection
    if (itemsData.owner != undefined) {
      const userId = auth.currentUser.uid;
      const qu = query(
        collection(db, "profileimages"),
        where("owner", "==", itemsData.owner)
      );
      getDocs(qu).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setprofileImg(doc.data().imageURI);
          console.log(doc.data());
        });
      });
    }
  };

  useEffect(() => {
    fetchData(auth.currentUser.uid);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData(auth.currentUser.uid);
    });

    return unsubscribe;
  }, [navigation]);

  const fetchMore = () => {
    if (!lastVisible) return;

    const itemsRef = collection(db, "post");
    const q = query(
      itemsRef,
      orderBy("created"),
      startAfter(lastVisible),
      limit(20)
    );
    let snapshot = getCollectionByQuery(q);

    if (!snapshot) {
      const newItemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems((prevItems) => [...prevItems, ...newItemsData]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openDetails(item.id)}>
      <View style={styles.postContainer}>
        <Image style={styles.postImage} source={{ uri: item.image }} />
        <View style={styles.postDetails}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text>
            {item.description.length > 40
              ? item.description.split("\n")[0].slice(0, 40) + "..."
              : item.description}
          </Text>
          <Text>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    
  },
  postContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  postDetails: {
    marginLeft: 12,
    flex: 1,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default App;
