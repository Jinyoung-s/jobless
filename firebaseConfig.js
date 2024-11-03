import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGAnjTwj2LqVRY_F3QMS0BNMBadvqHVYc",
  authDomain: "com.jobless",
  databaseURL: "https://jobless2-561cd.firebaseio.com",
  projectId: "jobless2-561cd",
  storageBucket: "jobless2-561cd.appspot.com",
  appId: "1:1019762770862:android:4b8945a5ab670c96353e3f",
};

const app = initializeApp(firebaseConfig);

// Use initializeAuth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, collection, addDoc, storage, app };


// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
