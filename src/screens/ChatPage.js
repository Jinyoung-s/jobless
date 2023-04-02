import { View, StyleSheet, TextInput, Button } from "react-native";
import { Text, Block } from "galio-framework";
import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "../../firebaseConfig";
import { saveDataWithId, updateDataWithId } from "../Api/FirebaseDb";
import { getUserData } from "../Api/FirebaseDb";
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
import { connectStorageEmulator } from "firebase/storage";

function Chat({ route, navigation }) {
  const [messages, setMessges] = useState([]);
  const [message, setMessage] = useState("");

  const [userData, setUserData] = useState("");
  const [ownerData, setOwnerData] = useState("");

  const { receiverId, title, postId } = route.params;
  const currentUserUid = auth.currentUser.uid;

  const setDate = async (newArr) => {
    setMessges(newArr);
  };

  const getUser = async () => {
    const userData1 = await getUserData(auth.currentUser.uid);
    const ownerData1 = await getUserData(receiverId);
    setUserData(userData1);
    setOwnerData(ownerData1);
  };

  useEffect(() => {
    let messages1 = [];
    const unsub = onSnapshot(
      doc(db, "chats", currentUserUid + postId),
      (doc) => {
        if (doc.data()) {
          messages1 = doc.data().chats;
          console.log(messages1);
          setMessges(messages1);
        }
      }
    );

    getUser();
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
        currentUserUid + postId
      );
    } else {
      const chatData = {
        post_owner: receiverId,
        job_finder: currentUserUid,
        jobFinderImg:
          userData && userData.profileImgURI ? userData.profileImgURI : "",
        jobFinderName: userData && userData.firstName ? userData.firstName : "",
        ownerName: ownerData && ownerData.firstName ? ownerData.firstName : "",
        owerImg:
          ownerData && ownerData.profileImgURI ? ownerData.profileImgURI : "",
        chats: [
          {
            senderUid: currentUserUid,
            recipientUid: receiverId,
            message,
            created: new Date(),
          },
        ],
      };
      saveDataWithId("chats", chatData, currentUserUid + postId);
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
    backgroundColor: "#4682B4",
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
