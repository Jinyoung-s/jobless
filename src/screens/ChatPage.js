import { View, StyleSheet, TextInput, Button } from "react-native";
import { Text, Block } from "galio-framework";
import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "../../firebaseConfig";
import { saveDataWithId } from "../Api/FirebaseDb";
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
} from "firebase/firestore";
import { async } from "@firebase/util";

function Chat({ route, navigation }) {
  const [messages, setMessges] = useState([]);
  const [message, setMessage] = useState("");

  const { receiverId, title, postId } = route.params;
  const currentUserUid = auth.currentUser.uid;

  const setDate = async (newArr) => {
    setMessges(newArr);
  };

  useEffect(() => {
    let messages = [];
    const unsub = onSnapshot(doc(db, "chats", currentUserUid), (doc) => {
      messages.push({ ...doc.data(), id: doc.id });
      setMessges(messages);
      //setMessges(newArr);

      console.log(messages);
    });

    return () => unsub();
  }, []);

  const sendMessage = () => {
    const chatData = {
      senderUid: currentUserUid,
      recipientUid: receiverId,
      message,
      created: new Date(),
    };

    saveDataWithId("chats", chatData, currentUserUid);
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
            <Text
              style={[
                styles.messageText,
                message.senderUid === currentUserUid &&
                  styles.currentUserMessageText,
              ]}
            >
              {message.message}
            </Text>
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

export default Chat;

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
    backgroundColor: "#EAEAEA",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  currentUserMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
  },
  messageText: {
    fontSize: 16,
  },
  currentUserMessageText: {
    color: "#fff",
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