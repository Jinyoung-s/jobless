import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, TextInput, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

import { styles } from "../styles/styles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const unscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Main");
      }
    });

    return unscribe;
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
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
        email
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        password
        viewPass
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity onPress={handleReset}>
        <Text style={{ color: "#4169E1", fontWeight: "bold" }}>
          {" "}
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.mediumButton,
          {
            backgroundColor: "#006A79",
          },
        ]}
        onPress={handleLogin}
      >
        <Text style={[{ color: "#ffffff" }, styles.mediumFont]}>Login</Text>
      </TouchableOpacity>
      <Text
        style={[
          { color: "#000000", textAlign: "center", marginVertical: 30 },
          styles.mediumFont,
        ]}
      >
        or
      </Text>
      <TouchableOpacity
        style={[
          styles.mediumButton,
          {
            backgroundColor: "#ffffff",
          },
        ]}
      >
        <Text style={[{ color: "#000000" }, styles.mediumFont]}>
          Sign in with Google
        </Text>
      </TouchableOpacity>{" "}
      <TouchableOpacity
        style={[
          styles.mediumButton,
          {
            backgroundColor: "#000000",
          },
        ]}
      >
        <Text style={[{ color: "#ffffff" }, styles.mediumFont]}>
          Sign in with Apple
        </Text>
      </TouchableOpacity>
      <Text>
        Don't have an account yet?
        <TouchableOpacity onPress={handleRegister}>
          <Text style={{ color: "#4169E1", fontWeight: "bold" }}>
            {" "}
            Register
          </Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default Login;
