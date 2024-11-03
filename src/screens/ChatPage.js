import { View, StyleSheet, TextInput, Button, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { saveDataWithId, updateDataWithId, getUserData } from "../Api/FirebaseDb";
import { doc, onSnapshot, arrayUnion } from "firebase/firestore";

function Chat({ route, navigation }) {
  const [messages, setMessages] = useState([]); // Fixed spelling
  const [message, setMessage] = useState("");

  const [userData, setUserData] = useState({}); // Initialized as an object
  const [ownerData, setOwnerData] = useState({}); // Initialized as an object

  const { receiverId, postId } = route.params;
  const currentUserUid = auth.currentUser.uid;

  const getUser = async () => {
    const userData1 = await getUserData(currentUserUid);
    const ownerData1 = await getUserData(receiverId);
    setUserData(userData1);
    setOwnerData(ownerData1);
  };

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "chats", currentUserUid + postId),
      (doc) => {
        if (doc.data()) {
          const messagesData = doc.data().chats || [];
          setMessages(messagesData);
        }
      }
    );

    getUser();
    return () => unsub(); // Cleanup the listener
  }, []);

  const sendMessage = () => {
    const chatData = {
      senderUid: currentUserUid,
      recipientUid: receiverId,
      message,
      created: new Date(),
    };

    if (messages.length) {
      updateDataWithId(
        "chats",
        {
          chats: arrayUnion(chatData),
        },
        currentUserUid + postId
      );
    } else {
      const newChatData = {
        post_owner: receiverId,
        job_finder: currentUserUid,
        jobFinderImg: userData.profileImgURI || "",
        jobFinderName: userData.firstName || "",
        ownerName: ownerData.firstName || "",
        ownerImg: ownerData.profileImgURI || "",
        chats: [chatData],
      };
      saveDataWithId("chats", newChatData, currentUserUid + postId);
    }
    setMessage(""); // Clear the input field
  };

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((msg, index) => ( // Renamed inner variable for clarity
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.senderUid === currentUserUid && styles.currentUserMessageContainer,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.senderUid === currentUserUid && styles.currentUserMessageText,
              ]}
            >
              {msg.message}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type your message"
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
