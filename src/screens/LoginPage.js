import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, Block, Input } from "galio-framework";

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
    <Block flex>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../assets/Official-Jobless-logo-updated.png")}
        />
        <Input
          email
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          password
          viewPass
          style={styles.passwordinput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          style={styles.loginButton}
          round
          color="#4169E1"
          title="Login"
          onPress={handleLogin}
        >
          Login
        </Button>
        <Text color="#FFFFFF">
          Forgot Password?
          <TouchableOpacity onPress={handleReset}>
            <Text style={{ color: "#4169E1", fontWeight: "bold" }}> Reset</Text>
          </TouchableOpacity>
        </Text>
        <Text color="#FFFFFF">
          Don't have an account yet?
          <TouchableOpacity onPress={handleRegister}>
            <Text style={{ color: "#4169E1", fontWeight: "bold" }}>
              {" "}
              Register
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  image: {
    height: 200,
    width: 200,
    borderColor: "transparent",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    width: 250,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "transparent",
  },
  passwordinput: {
    width: 250,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "transparent",
  },
  loginButton: {
    backgroundColor: "#4682B4",
    padding: 10,
    width: 250,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
    borderColor: "transparent",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
  },
});

export default Login;
