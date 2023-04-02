import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { Button, Card, Header, Block } from "galio-framework";
import defaultImage from "../assets/default-image.png";
import CustomHeader from "./components/CustomHeader";
import { Image } from "react-native";

const ChatsPage = ({ navigation }) => {
  const currentUserUid = auth.currentUser.uid;
  const [chatMessages, setChatMessages] = useState([]);

  let messages1 = [];
  const fetchChatMessages = async () => {
    console.log(currentUserUid);
    const chatsCollection = collection(db, "chats");
    const chatMessagesQuery1 = query(
      chatsCollection,
      where("job_finder", "==", currentUserUid)
    );

    const chatMessagesQuery2 = query(
      chatsCollection,
      where("post_owner", "==", currentUserUid)
    );

    const senderSnapshot = await getDocs(chatMessagesQuery1);
    const recipientSnapshot = await getDocs(chatMessagesQuery2);

    const chatMessagesData = [
      ...senderSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      ...recipientSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    ];

    let listData = [];
    chatMessagesData.map((doc) => {
      const chat = doc.chats[doc.chats.length - 1];
      chat.avatarImg =
        doc.job_finder === currentUserUid ? doc.owerImg : doc.jobFinderImg;
      chat.cName =
        doc.job_finder === currentUserUid ? doc.ownerName : doc.jobFinderName;
      listData.push({ ...doc, ...chat });
    });

    messages1 = chatMessagesData[0].chats;
    setChatMessages(listData);
    console.log(messages1);
  };

  useEffect(() => {
    fetchChatMessages();
  }, [currentUserUid]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchChatMessages();
    });

    return unsubscribe;
  }, [navigation]);

  const goChat = (item) => {
    console.log(item);
    const receiverId =
      item.senderUid === currentUserUid ? item.recipientUid : item.senderUid;
    navigation.navigate("Conversation", {
      roomId: item.id,
      receiverId: receiverId,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.chatMessageContainer}>
      <TouchableOpacity onPress={() => goChat(item)}>
        <View style={styles.chatMessageRow}>
          <Image
            style={styles.avatar}
            source={item.avatarImg ? item.avatarImg : defaultImage}
          />
          <View style={styles.chatMessageContent}>
            <View style={styles.chatContainer}>
              <Text style={styles.chatMessage}>{item.cName}</Text>
              <Text style={styles.rightText}>
                {" "}
                {item.created.toDate().toLocaleString()}
              </Text>
            </View>
            <Text style={styles.chatMessageMeta}>{item.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.created}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F505205",
  },
  chatMessageContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  chatMessageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  chatMessageContent: {
    flex: 1,
  },
  chatMessage: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chatMessageMeta: {
    fontSize: 12,
    color: "#999",
  },
  chatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ChatsPage;
