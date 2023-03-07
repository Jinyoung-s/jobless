/**
 * home page
 * 2/13/2023 created - jys
 * 2/23/2023 modified - jys.
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
import React, { useState, useEffect } from "react";
import { db, collection } from "../../firebaseConfig";
import { Button } from "galio-framework";
import { query, orderBy, startAfter, limit } from "firebase/firestore";

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

  useEffect(() => {
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

    fetchData();
  }, []);

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
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.itemDetails}>
        <TouchableOpacity onPress={() => openDetails(item.id)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.contents}>{item.description}</Text>
        </TouchableOpacity>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{item.price} CAD</Text>
          <Button style={styles.categoryButton}>{item.category}</Button>
        </View>
      </View>
    </View>
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
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 4,
    marginBottom: 16,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
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
    backgroundColor: "#fe5f55",
    borderRadius: 50,
    paddingHorizontal: 16,
  },
});

export default App;
