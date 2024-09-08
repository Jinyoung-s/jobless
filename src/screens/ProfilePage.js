import "firebase/firestore";
import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { db, auth } from "../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import defaultImage from "../assets/default-image.png";
import { Dimensions } from "react-native";
import { styles } from "../styles/styles";
import ProfileTab from "./profileTab";
function App({ navigation }) {
  const [profileImg, setprofileImg] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    profilePicture: null,
  });
  const screenWidth = Dimensions.get("window").width;

  const getUserData = async () => {
    try {
      // get the name of the current user
      const userId = auth.currentUser.uid;
      const q = query(collection(db, "users"), where("uid", "==", userId));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUser((prevState) => ({ ...prevState, ...doc.data() }));
        });
      });

      // Get the profile picture URL from storage
      const qu = query(
        collection(db, "profileimages"),
        where("owner", "==", userId)
      );

      getDocs(qu).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setprofileImg(doc.data().imageURI);
        });
      });
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  };

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

  const editProfile = () => {
    navigation.navigate("Edit");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getUserData();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View>
      <View style={styles.profileHeader}>
        <Image
          source={profileImg ? { uri: profileImg } : defaultImage}
          style={styles.profileHeader}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#3BA9B8",
            position: "absolute",
            top: 10,
            right: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={editProfile}
        >
          <Text style={[{ color: "#ffffff" }, styles.mediumFont]}>
            Edit profile
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardProfile}>
        <Image
          source={profileImg ? { uri: profileImg } : defaultImage}
          style={styles.profilePicture}
        />
        <Text style={{ fontSize: 40, fontWeight: "500", paddingTop: 10 }}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.mediumFont}>Guelph, ON</Text>

        <Text style={[styles.mediumFont, { paddingVertical: 10 }]}>
          This is my introduction, please read it before anythingelse
        </Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ fontSize: 40, fontWeight: "bold", marginRight: 5 }}>
            4.8
          </Text>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="star" size={15} color="orange" />
              <Ionicons name="star" size={15} color="orange" />
              <Ionicons name="star" size={15} color="orange" />
              <Ionicons name="star" size={15} color="orange" />
              <Ionicons name="star" size={15} color="gray" />
            </View>
            <Text>312 reviews</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* <View>
        <TouchableOpacity style={styles.signOut} onPress={handleLogout}>
          Sign Out
        </TouchableOpacity>
      </View> */}
      <View>
        <ProfileTab />
      </View>
    </View>
  );
}

export default App;
