import React, { useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./HomePage";
import PostPage from "./PostPage";
import ChatsPage from "./ChatsPage";
import ProfilePage from "./ProfilePage";
import { Ionicons, AntDesign, Foundation } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { Text, View, StyleSheet, Image } from "react-native";
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

    const unsub = onSnapshot(chatMessagesQuery1, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
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
        tabBarActiveTintColor: "#4682B4",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarStyle: { 
          backgroundColor: '#000000',
          height: 55 
        },
      })}
    >

      <Tab.Screen name="Home" component={HomePage} 
        options={{
          headerStyle: { 
            backgroundColor: '#000000' 
          }, 
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
              fontWeight: 'bold',
            },
          headerTitle: 'Home',
          headerTitleAlign: 'center',        
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Text style={[styles.headerText, {fontFamily: 'cursive'}]}>𝓦𝓮𝓵𝓬𝓸𝓶𝓮</Text>
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <View style={{ 
              flex: 1, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Text style={{ color: focused ? '#FFFFFF' : '#CCCCCC' }}>Home</Text>
            </View>
          ),
          headerRight: () => (
            <Image
              style={styles.tabBarIcon}
              source={require("../assets/Official-Jobless-logo-updated.png")}
            />
          ),
        }}
      />

      <Tab.Screen name="Post" component={PostPage} 
        options={{
          headerStyle: { 
            backgroundColor: '#000000' 
          }, 
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
              fontWeight: 'bold',
            },
          headerTitle: 'Post',
          headerTitleAlign: 'center',
          tabBarLabel: ({ focused }) => (
            <View style={{ 
              flex: 1, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Text style={{ color: focused ? '#FFFFFF' : '#CCCCCC' }}>Post</Text>
            </View>
          ),
          headerRight: () => (
            <Image
              style={styles.tabBarIcon}
              source={require("../assets/Official-Jobless-logo-updated.png")}
            />
          ),
        }}
      />

      <Tab.Screen name="Chats" component={ChatsPage} 
        options={{
          headerStyle: { 
            backgroundColor: '#000000' 
          }, 
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
              fontWeight: 'bold',
            },
          headerTitle: 'Chats',
          headerTitleAlign: 'center',
          tabBarLabel: ({ focused }) => (
            <View style={{ 
              flex: 1, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Text style={{ color: focused ? '#FFFFFF' : '#CCCCCC' }}>Chats</Text>
            </View>
          ),
          headerRight: () => (
            <Image
              style={styles.tabBarIcon}
              source={require("../assets/Official-Jobless-logo-updated.png")}
            />
          ),
        }}
      />

      <Tab.Screen name="Profile" component={ProfilePage} 
        options={{
          headerStyle: { 
            backgroundColor: '#000000' 
          }, 
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
              fontWeight: 'bold',
            },
          headerTitle: 'Profile',
          headerTitleAlign: 'center',
          tabBarLabel: ({ focused }) => (
            <View style={{ 
              flex: 1, 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Text style={{ color: focused ? '#FFFFFF' : '#CCCCCC' }}>Profile</Text>
            </View>
          ),
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
    marginRight:"20px"
  },

  headerLeft: {   
    flexDirection: "row",
    alignItems: "flex-end",
    margin: '10px'
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#FFFFFF',
    
  },
});

export default TabNavigator;
