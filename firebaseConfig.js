import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOYMN0CiXA6kKcqhrt0lo394zav_U8aEM",
  authDomain: "com.unemployed.jobless",
  databaseURL: "https://jobless-1ad8f.firebaseio.com",
  projectId: "jobless-1ad8f",
  storageBucket: "jobless-1ad8f.appspot.com",
  messagingSenderId: "938814888188",
  appId: "1:938814888188:android:e81823d91f203e6d671f79",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, collection, addDoc, storage };

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
