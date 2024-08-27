import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { styles } from "../styles/styles";
import {
  getCollection,
  getCollectionByOrder,
  getCollectionByQuery,
} from "../Api/FirebaseDb";
import React, { useState, useEffect, useCallback } from "react";
import { db, collection, auth } from "../../firebaseConfig";
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

function Home({ navigation, route }) {
  const [items, setItems] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [profileImg, setprofileImg] = useState("");
  const [searchText, setSearchText] = useState("");

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

  const fetchData = async (userId, searchText) => {
    var q = null;
    if (searchText) {
      q = query(
        collection(db, "post"),
        where("title", ">=", searchText.toLowerCase()),
        where("title", "<=", searchText.toLowerCase() + "\uf8ff")
      );
    } else {
      q = query(collection(db, "post"));
    }

    const snapshot = await getDocs(q);

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
      getDocs(qu).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setprofileImg(doc.data().imageURI);
          console.log(doc.data());
        });
      });
    }
  };

  useEffect(() => {
    fetchData(auth.currentUser.uid, route.params?.searchText);
  }, [navigation, route.params?.searchText]); // Include route.params?.searchText to listen for changes in searchText

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
        <Image
          style={styles.postImage}
          source={{ uri: item.images ? item.images[0] : item.image }}
        />
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
    <View style={styles.homeContainer}>
      <View style={styles.searcBarContainer}>
        <TextInput style={styles.input} placeholder="Search" />
        <TouchableOpacity styles={styles.locationButton}>
          <Text
            style={{
              color: "#ffffff",
              fontWeight: "600",
              textAlign: "right",
              paddingHorizontal: 10,
              fontSize: 18,
            }}
          >
            Guelph, ON - 10km
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={() => (
          <Text
            style={{
              paddingTop: 10,
              paddingStart: 10,
              fontSize: 30,
              fontWeight: "500",
            }}
          >
            Search results
          </Text>
        )}
      />
    </View>
  );
}

export default Home;
