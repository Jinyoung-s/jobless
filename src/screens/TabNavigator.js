import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./HomePage";
import PostPage from "./PostPage1";
import ChatsPage from "./ChatsPage";
import ProfilePage from "./ProfilePage";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { StyleSheet, Image, Alert } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import { primaryColor } from "../styles/styles";
import SetLocation from "./SetLocationPage";

const HomeStack = createNativeStackNavigator();

function HomeStackScreen({ navigation, route }) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="Set location" component={SetLocation} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabNavigator({ navigation }) {
  let isNew = true;
  const currentUserUid = auth.currentUser.uid;
  const [profileImg, setprofileImg] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    profilePicture: null,
  });

  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const chatsCollection = collection(db, "chats");
    const chatMessagesQuery1 = query(
      chatsCollection,
      where("post_owner", "==", currentUserUid)
    );

    // get the name of the current user
    const q = query(
      collection(db, "users"),
      where("uid", "==", auth.currentUser.uid)
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUser((prevState) => ({ ...prevState, ...doc.data() }));
      });
    });

    // Get the user URI from storage
    const qu = query(
      collection(db, "profileimages"),
      where("owner", "==", auth.currentUser.uid)
    );
    getDocs(qu).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setprofileImg(doc.data().imageURI);
        console.log(doc.data().imageURI);
      });
    });

    const unsub = onSnapshot(chatMessagesQuery1, (querySnapshot) => {
      querySnapshot.forEach((doc) => {});
    });
    return () => unsub();
  }, []);

  const handleSearch = () => {
    navigation.navigate("Home", { searchText });
  };

  const showAlert = () => {
    // Display an alert when this function is called
    Alert.alert(
      "Alert Title",
      "Alert Message",
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size, newMessage }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Chats") {
            if (isNew) {
              iconName = focused
                ? "chatbubble-ellipses-sharp"
                : "chatbubble-ellipses-outline";
            } else {
              iconName = "person";
            }
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: "#000000",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 60,
          padding: 5,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          // headerStyle: {
          //   backgroundColor: primaryColor,
          //   borderBottomWidth: 0,
          // },
          // headerTintColor: "#000000",
          // headerTitleStyle: {
          //   fontWeight: "500",
          // },
          headerShown: false,

          headerTitle: "",
          headerTitleAlign: "center",
          // headerRight: () => (
          //   <View style={[styles.headerLeft, { flexDirection: "column" }]}>
          //     <View style={[styles.avatarContainer, { flexDirection: "row" }]}>
          //       {/* <Image source={{ uri: profileImg.profilePicture }} style={styles.avatar} /> */}
          //       {profileImg ? (
          //         <Image source={{ uri: profileImg }} style={styles.avatar} />
          //       ) : null}
          //       <Text style={styles.headerText}>{user.firstName}</Text>
          //     </View>
          //   </View>
          // ),
          // headerLeft: () => (
          //   <View style={{ flexDirection: "row", marginRight: 10 }}>
          //     <TouchableOpacity onPress={showAlert}>
          //       <Ionicons name="notifications" size={24} color="#000000" />
          //     </TouchableOpacity>
          //   </View>
          // ),
        }}
      />

      <Tab.Screen
        name="Post"
        component={PostPage}
        options={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "Post",
          headerTitleAlign: "center",

          headerRight: () => (
            <Image
              style={styles.tabBarIcon}
              source={require("../assets/Official-Jobless-logo-updated.png")}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Chats"
        component={ChatsPage}
        options={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "Chats",
          headerTitleAlign: "center",

          headerRight: () => (
            <Image
              style={styles.tabBarIcon}
              source={require("../assets/Official-Jobless-logo-updated.png")}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "Profile",
          headerTitleAlign: "center",

          headerRight: () => (
            <Image
              style={styles.tabBarIcon}
              source={require("../assets/Official-Jobless-logo-updated.png")}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    height: 50,
    width: 50,
    alignItems: "flex-end",
    borderColor: "red",
    marginRight: 20,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 10,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    marginRight: 5,
    borderRadius: 5,
  },
});

export default TabNavigator;
