/**
 * home page
 * 2/13/2023 created - jys
 * 2/23/2023 modified - jys..
 *
 */
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { auth } from "../../firebaseConfig";
import {
  getCollection,
  getCollectionByOrder,
  getCollectionByQuery,
} from "../Api/FirebaseDb";
import React, { useState, useEffect, useCallback } from "react";
import { db, collection } from "../../firebaseConfig";
import { Button, Card } from "galio-framework";
import { query, orderBy, startAfter, limit } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

function App({ navigation }) {
  const [items, setItems] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

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
    const itemsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(itemsData);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  */

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
      <Card
        flex
        borderless
        shadow
        style={styles.card}
        title={item.title}
        caption={item.description}
        avatar={item.image}
        image={item.image}
        location
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "white",
  },
  item: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 4,
    marginBottom: 16,
    elevation: 10,
    borderBottomWidth: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    left: 5,
  },
  itemDetails: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  contents: {
    fontSize: 14,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryButton: {
    backgroundColor: "#4169E1",
    borderRadius: 50,
    paddingHorizontal: 16,
  },
});

export default App;
