import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, TextInput, Text } from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles/styles";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "1019762770862-sgetkkudg7pv9vg5a4dfskqlkp5g63lf.apps.googleusercontent.com", 
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Main");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
      console.log("Google login successful");
    } catch (error) {
      console.error("Google login failed:", error.message);
    }
  };

  const handleAppleLogin = async () => {
    console.log("Apple Login Clicked");

  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleReset = () => {
    navigation.navigate("Reset");
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/logo.png")} />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity onPress={handleReset}>
        <Text style={{ color: "#4169E1", fontWeight: "bold" }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.mediumButton, { backgroundColor: "#006A79" }]}
        onPress={handleLogin}
      >
        <Text style={[styles.mediumFont, { color: "#ffffff" }]}>Login</Text>
      </TouchableOpacity>

      <Text style={[styles.mediumFont, { textAlign: "center", marginVertical: 30 }]}>or</Text>

      <TouchableOpacity
        style={[styles.mediumButton, { backgroundColor: "#ffffff" }]}
        onPress={handleGoogleLogin}
      >
        <Text style={[styles.mediumFont, { color: "#000000" }]}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.mediumButton, { backgroundColor: "#000000" }]}
        onPress={handleAppleLogin}
      >
        <Text style={[styles.mediumFont, { color: "#ffffff" }]}>Sign in with Apple</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text>Don't have an account yet?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={{ color: "#4169E1", fontWeight: "bold" }}> Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
