import { auth } from "../../firebaseConfig";
import { Button, Text } from "galio-framework";
import React, { useState } from "react";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";

function App() {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleResetPassword = async () => {
        try {
            setErrorMessage('');
            setSuccessMessage('');

            await fetchSignInMethodsForEmail(auth, email)
            .then((signInMethods) => {
            if (signInMethods.length > 0) {
                console.log("Email is registered");
            } else {
                console.log("Email is not registered");
                setErrorMessage(`Email address you've entered is not registered!`);
            }
            })
            .catch((error) => {
            console.log(error);
            setErrorMessage(`This is not a valid email address!`);
            });

            await sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent successfully
                setSuccessMessage('Password reset email sent. Please check your email.');
            })
            .catch((error) => {
                // Error sending password reset email
                console.error("Error resetting password:", error.message);
            });       
        } catch (error) {
            setErrorMessage(`Error resetting password: ${error.message}`);
        }
    }

    const handleClear = () => {
        setEmail("");
        setSuccessMessage("");
        setErrorMessage("");
      };
      
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#F505205"
      },
      textInput: {
        height: 40,
        width: "80%",
        borderColor: "transparent",
        backgroundColor: "white",
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 25,
      },
      errorStyle: {
        color: "red"
      },
  });

  // Return Content

  return (
    <View style={styles.container}>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginTop: 10 }}>
          Reset your Password
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "bold",
            fontStyle: "italic",
            marginBottom: 5,
          }}
        >Please provide the email address you used to register</Text>
        <TextInput
        style={styles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={(value) => setEmail(value)}
        />

        {successMessage ? <Text>{successMessage}</Text> : null}
        {errorMessage ? <Text style={styles.errorStyle}>{errorMessage}</Text> : null}

        <Button round size="small" color="#4682B4" onPress={handleResetPassword}>
        Submit
        </Button>

        <Button round size="small" color="#FF4500" onPress={handleClear}>
          Clear
        </Button>
    </View>
  );
}

export default App;
