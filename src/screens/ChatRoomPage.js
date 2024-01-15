import { View, StyleSheet, TextInput, Button, Image } from "react-native";
import { Text, Block } from "galio-framework";
import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "../../firebaseConfig";
import { saveDataWithId, updateDataWithId } from "../Api/FirebaseDb";
import {
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  startAfter,
  limit,
  where,
  doc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { async } from "@firebase/util";

function Conversation({ route, navigation }) {
  const [messages, setMessges] = useState([]);
  const [message, setMessage] = useState("");
  const [avataImg, setAvataImg] = useState("");

  const { roomId, receiverId } = route.params;
  const currentUserUid = auth.currentUser.uid;

  const setDate = async (newArr) => {
    setMessges(newArr);
  };

  const formatMessageTime = (timestamp) => {
    const date = timestamp.toDate();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}/${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    let messages1 = [];
    const unsub = onSnapshot(doc(db, "chats", roomId), (doc) => {
      if (doc.data()) {
        const uData = doc.data();
        const avatarImage =
          uData.job_finder === currentUserUid
            ? uData.owerImg
            : uData.jobFinderImg;
        setAvataImg(avatarImage);
        messages1 = doc.data().chats;
        console.log(messages1);
        setMessges(messages1);
      }
    });
    return () => unsub();
  }, []);

  const sendMessage = () => {
    if (messages && messages.length != 0) {
      const chatData = {
        senderUid: currentUserUid,
        recipientUid: receiverId,
        message,
        created: new Date(),
      };

      updateDataWithId(
        "chats",
        {
          chats: arrayUnion(chatData),
        },
        roomId
      );
    } else {
      const chatData = {
        post_owner: receiverId,
        job_finder: currentUserUid,
        chats: [
          {
            senderUid: currentUserUid,
            recipientUid: receiverId,
            message,
            created: new Date(),
          },
        ],
      };
      saveDataWithId("chats", chatData, roomId);
    }
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.senderUid === currentUserUid &&
                styles.currentUserMessageContainer,
            ]}
          >
            {message.senderUid !== currentUserUid && (
              <View style={styles.avatarContainer}>
                <Image source={{ uri: avataImg }} style={styles.avatar} />
              </View>
            )}
            {message.senderUid !== currentUserUid && (
              <View style={styles.messageContentContainer}>
                {message.senderUid !== currentUserUid && (
                  <Text style={styles.usernameText}>{message.username}</Text>
                )}
                <Text
                  style={[
                    styles.messageText,
                    message.senderUid === currentUserUid &&
                      styles.currentUserMessageText,
                  ]}
                >
                  {message.message}
                </Text>
                <Text style={styles.timeText}>
                  {formatMessageTime(message.created)}
                </Text>
              </View>
            )}
            {message.senderUid === currentUserUid && (
              <View style={styles.messageContentContainer1}>
                {message.senderUid !== currentUserUid && (
                  <Text style={styles.usernameText}>{message.username}</Text>
                )}
                <Text
                  style={[
                    styles.messageText,
                    message.senderUid === currentUserUid &&
                      styles.currentUserMessageText,
                  ]}
                >
                  {message.message}
                </Text>
                <Text style={styles.timeText1}>
                  {formatMessageTime(message.created)}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Button title="Send" onPress={sendMessage} disabled={!message} />
      </View>
    </View>
  );
}

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
    maxWidth: "80%",
  },
  currentUserMessageContainer: {
    alignSelf: "flex-end",
  },
  messageContentContainer: {
    flex: 1,
    backgroundColor: "#EAEAEA",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  messageContentContainer1: {
    flex: 1,
    backgroundColor: "#0084ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  usernameText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currentUserMessageText: {
    color: "#fff",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "bold",
    marginTop: 5,
  },
  timeText1: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
  },
});
