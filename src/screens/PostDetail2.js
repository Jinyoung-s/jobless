import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  query,
  getDocs,
  where,
  collection,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { FontAwesome } from "react-native-vector-icons";
import { getDocById } from "../Api/FirebaseDb";
import { Dimensions } from "react-native";

const PostDetail = ({ route, navigation }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [profileImg, setProfileImg] = useState("");
  const [photos, setPhotos] = useState([]);
  const [userName, setUserName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post data
        let data = await getDocById("post", postId);
        setPost(data);
        setPhotos(data.images ?? [data.image]);
        setIsOwner(data.owner === auth.currentUser.uid);

        if (data.owner) {
          // Fetch profile image
          const profileImgQuery = query(
            collection(db, "profileimages"),
            where("owner", "==", data.owner)
          );
          const profileImgSnapshot = await getDocs(profileImgQuery);
          profileImgSnapshot.forEach((doc) => {
            setProfileImg(doc.data().imageURI);
          });

          // Fetch user name
          const userQuery = query(
            collection(db, "users"),
            where("uid", "==", data.owner)
          );
          const userSnapshot = await getDocs(userQuery);
          userSnapshot.forEach((doc) => {
            const userData = doc.data();
            setUserName(
              `${userData.firstName || "Unknown"} ${userData.lastName || ""}`
            );
          });
        }

        // Fetch replies
        const replyQuery = query(
          collection(db, "replies"),
          where("postId", "==", postId)
        );
        const replySnapshot = await getDocs(replyQuery);
        const repliesData = [];
        const userPromises = [];

        replySnapshot.forEach((doc) => {
          const replyData = doc.data();
          if (replyData.createdAt?.toDate) {
            replyData.createdAt = replyData.createdAt.toDate();
          } else {
            replyData.createdAt = new Date(replyData.createdAt);
          }

          // Fetch user details for each reply
          const userPromise = getDocs(
            query(collection(db, "users"), where("uid", "==", replyData.userId))
          ).then((userSnapshot) => {
            userSnapshot.forEach((userDoc) => {
              const userData = userDoc.data();
              replyData.user = `${userData.firstName || "Unknown"} ${
                userData.lastName || ""
              }`;
            });
          });

          userPromises.push(userPromise);
          repliesData.push({ ...replyData, id: doc.id });
        });

        // Wait for all user data to be fetched and then update state
        await Promise.all(userPromises);
        setReplies(repliesData);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchData();
  }, [postId]);

  const handleReplySubmit = async () => {
    if (replyText.trim() === "") {
      Alert.alert("Error", "Reply cannot be empty");
      return;
    }
    try {
      const newReply = {
        postId,
        text: replyText,
        userId: auth.currentUser.uid, // Assuming you store userId for replies
        createdAt: new Date(),
      };
      await addDoc(collection(db, "replies"), newReply);
      setReplies([
        ...replies,
        { ...newReply, user: auth.currentUser.displayName || "Anonymous" },
      ]);
      setReplyText("");
    } catch (error) {
      console.error("Error adding reply:", error);
      Alert.alert("Error", "Failed to add reply");
    }
  };

  const goChat = () => {
    navigation.navigate("Chat", {
      postId: postId,
      receiverId: post?.owner,
      title: post?.title,
    });
  };

  const deletePost = async () => {
    console.log("Delete function called");
    try {
      if (Platform.OS === "web") {
        if (window.confirm("Are you sure you want to delete this post?")) {
          try {
            await deleteDoc(doc(db, "post", postId));
            window.alert("Success: Post deleted successfully");
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting post:", error);
            window.alert("Error: Failed to delete post");
          }
        }
      } else {
        Alert.alert(
          "Delete Post",
          "Are you sure you want to delete this post?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              onPress: async () => {
                try {
                  await deleteDoc(doc(db, "post", postId));
                  Alert.alert("Success", "Post deleted successfully");
                  navigation.goBack();
                } catch (error) {
                  console.error("Error deleting post:", error);
                  Alert.alert("Error", "Failed to delete post");
                }
              },
              style: "destructive",
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Error in deletePost function:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        {/* Images Section */}
        <ScrollView horizontal style={styles.imageContainer}>
          {photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.photo} />
          ))}
        </ScrollView>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: profileImg }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileLocation}>
              TO-DO: Location Place {post?.userLocation}
            </Text>
          </View>
        </View>

        {/* Post Details Section */}
        <View style={styles.postDetailsSection}>
          {isOwner ? (
            <TouchableOpacity style={styles.deleteButton} onPress={deletePost}>
              <FontAwesome name="trash" size={12} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.chatButton} onPress={goChat}>
              <FontAwesome name="comment" size={12} color="#fff" />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.postTitle}>{post?.title}</Text>
          <Text style={styles.postPrice}>Price: ${post?.price}</Text>
          <Text style={styles.postDescription}>{post?.description}</Text>
        </View>
        <View style={styles.postDetailsSection}></View>

        {/* Replies Section */}
        <View style={styles.repliesSection}>
          <Text style={styles.repliesTitle}>Replies</Text>
          {replies.map((reply, index) => (
            <View key={index} style={styles.reply}>
              <Text style={styles.replyUser}>{reply.user}</Text>
              <Text style={styles.replyText}>{reply.text}</Text>
              <Text style={styles.replyDate}>
                {reply.createdAt instanceof Date
                  ? reply.createdAt.toLocaleString()
                  : new Date(reply.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Add Reply Section */}
        <View style={styles.addReplySection}>
          <TextInput
            style={styles.replyInput}
            placeholder="Add a reply..."
            value={replyText}
            onChangeText={setReplyText}
          />
          <Button title="Reply" onPress={handleReplySubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {},
  photo: {
    width: Dimensions.get("window").width,
    height: 300,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileLocation: {
    color: "#666",
  },
  postDetailsSection: {
    padding: 15,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postPrice: {
    fontSize: 16,
    color: "#007AFF", // Blue color
    marginBottom: 10,
    fontWeight: "bold",
  },
  postDescription: {
    fontSize: 16,
    color: "#333",
  },
  repliesSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reply: {
    marginBottom: 10,
  },
  replyUser: {
    fontSize: 16,
    fontWeight: "bold",
  },
  replyText: {
    fontSize: 16,
    color: "#333",
  },
  replyDate: {
    fontSize: 14,
    color: "#999",
  },
  addReplySection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },
  replyInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  chatButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF", // Blue color
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },
  deleteButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30", // Red color
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
});

export default PostDetail;
