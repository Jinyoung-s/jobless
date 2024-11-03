import { View, StyleSheet, TextInput, Button, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { saveDataWithId, updateDataWithId, getUserData } from "../Api/FirebaseDb";
import { doc, onSnapshot, arrayUnion } from "firebase/firestore";

function Conversation({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [avatarImg, setAvatarImg] = useState("");

  const { roomId, receiverId } = route.params;
  const currentUserUid = auth.currentUser.uid;

  const formatMessageTime = (timestamp) => {
    const date = timestamp.toDate();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}/${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", roomId), (doc) => {
      if (doc.data()) {
        const uData = doc.data();
        const avatarImage =
          uData.job_finder === currentUserUid
            ? uData.owerImg
            : uData.jobFinderImg;
        setAvatarImg(avatarImage);
        setMessages(uData.chats);
      }
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

    if (messages.length > 0) {
      updateDataWithId(
        "chats",
        {
          chats: arrayUnion(chatData),
        },
        roomId
      );
    } else {
      const newChatData = {
        post_owner: receiverId,
        job_finder: currentUserUid,
        chats: [chatData],
      };
      saveDataWithId("chats", newChatData, roomId);
    }
    
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.senderUid === currentUserUid && styles.currentUserMessageContainer,
            ]}
          >
            {msg.senderUid !== currentUserUid && (
              <View style={styles.avatarContainer}>
                <Image source={{ uri: avatarImg }} style={styles.avatar} />
              </View>
            )}
            <View style={msg.senderUid === currentUserUid ? styles.messageContentContainer1 : styles.messageContentContainer}>
              {msg.senderUid !== currentUserUid && (
                <Text style={styles.usernameText}>{msg.username}</Text>
              )}
              <Text style={[styles.messageText, msg.senderUid === currentUserUid && styles.currentUserMessageText]}>
                {msg.message}
              </Text>
              <Text style={msg.senderUid === currentUserUid ? styles.timeText1 : styles.timeText}>
                {formatMessageTime(msg.created)}
              </Text>
            </View>
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
