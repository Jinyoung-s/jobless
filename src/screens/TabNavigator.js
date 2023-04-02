import React, { useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./HomePage";
import PostPage from "./PostPage";
import ChatsPage from "./ChatsPage";
import ProfilePage from "./ProfilePage";
import { Ionicons, AntDesign, Foundation } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
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

const Tab = createBottomTabNavigator();

function TabNavigator() {
  let isNew = true;
  const currentUserUid = auth.currentUser.uid;

  useEffect(() => {
    const chatsCollection = collection(db, "chats");
    const chatMessagesQuery1 = query(
      chatsCollection,
      where("post_owner", "==", currentUserUid)
    );

    let messages1 = [];
    const unsub = onSnapshot(chatMessagesQuery1, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
    return () => unsub();
  }, []);

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
        tabBarActiveTintColor: "#0000FF",
        tabBarInactiveTintColor: "#000000",
      })}
    >
      <Tab.Screen name="Home" component={HomePage} 
      options={{
        headerStyle: { backgroundColor: '#0000FF' }, // replace with your desired color
      }} 
      />
      <Tab.Screen name="Post" component={PostPage} />
      <Tab.Screen name="Chats" component={ChatsPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
