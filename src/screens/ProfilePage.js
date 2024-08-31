import "firebase/firestore";
import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { db, auth } from "../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import defaultImage from "../assets/default-image.png";
import { Dimensions } from "react-native";
import { styles } from "../styles/styles";
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
      <View>
        {/* profile header */}
        <Image
          source={profileImg ? { uri: profileImg } : defaultImage}
          style={styles.profileHeader}
        />
        <View style={styles.cardProfile}>
          <View
            style={{
              flexDirection: "row",
              marginTop: -80,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Image
              source={profileImg ? { uri: profileImg } : defaultImage}
              style={styles.profilePicture}
            />
            <TouchableOpacity
              style={[
                styles.mediumButton,
                {
                  backgroundColor: "#006A79",
                },
              ]}
            >
              <Text style={[{ color: "#ffffff" }, styles.mediumFont]}>
                Message
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 40, fontWeight: "500" }}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.mediumFont}>Guelph, ON</Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={{ fontSize: 40, fontWeight: "bold", marginRight: 5 }}
              >
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
          <TouchableOpacity
            style={[
              styles.mediumButton,
              {
                backgroundColor: "#006A79",
              },
            ]}
            onPress={editProfile}
          >
            <Text style={{ color: "white" }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.optionContainer}>
        <View style={styles.cardOption}>
          <View style={styles.options}>
            <Ionicons name="list" size={50} color="black" style={styles.icon} />
            <Text style={styles.separator}>|</Text>
            <Ionicons
              name="infinite"
              size={50}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.separator}>|</Text>
            <Ionicons
              name="timer"
              size={50}
              color="black"
              style={styles.icon}
            />
          </View>
        </View>
      </View>

      <View>
        <TouchableOpacity style={styles.signOut} onPress={handleLogout}>
          Sign Out
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default App;
