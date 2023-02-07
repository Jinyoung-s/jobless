import ImagePicker from "react-native-image-picker";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [birthdate, setBirthday] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [image, setImage] = useState(null);

  // Validator upon clicking the Submit button
  const handleSubmit = () => {
    if (!isValidFirstName(firstName)) {
      setFirstNameError("Invalid First Name");
    } else {
      setFirstNameError("");
    }

    if (!isValidLastName(lastName)) {
      setLastNameError("Invalid Last Name");
    } else {
      setLastNameError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email");
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Invalid password! Must have: \n\n At least one letter \n At least one number \n At least one special character @, $, !, %, *, #, ?, &"
      );
    } else {
      setPasswordError("");
    }

    if (!validateBirthDate(birthdate)) {
      setBirthDateError('Invalid Date! Must be in the format "MM/DD/YYYY"');
    } else {
      setBirthDateError("");
    }
  };

  // Clear Text Input

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setStreet("");
    setCity("");
    setProvince("");
    setPostalCode("");
    setBirthday("");
    setEmail("");
    setPassword("");
    setFirstNameError("");
    setLastNameError("");
    setPasswordError("");
    setEmailError("");
    setBirthDateError("");
  };

  // Regex Expression

  const isValidFirstName = (firstName) => {
    const regexFirstName = /^[a-zA-Z]+$/;
    return regexFirstName.test(firstName);
  };

  const isValidLastName = (lastName) => {
    const regexLastName = /^[a-zA-Z]+$/;
    return regexLastName.test(lastName);
  };

  const validateEmail = (email) => {
    var regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexEmail.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const regexPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regexPassword.test(password);
  };

  const validateBirthDate = (birthdate) => {
    const regexBirthDate =
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/;
    return regexBirthDate.test(birthdate);
  };

  const handleLogin = () => {
    navigation.navigate("LoginPage");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    addressContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    btnContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    textInput: {
      height: 40,
      width: "80%",
      borderColor: "gray",
      borderWidth: 1,
      padding: 10,
      margin: 10,
    },
    btnAddress: {
      height: 40,
      width: "80%",
      borderColor: "gray",
      borderWidth: 1,
      padding: 10,
      margin: 10,
      marginLeft: 37,
    },
    btnButtons: {
      height: 40,
      width: "80%",
      borderColor: "gray",
      borderWidth: 1,
      padding: 10,
      margin: 10,
    },
  });

  // Return Content

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginTop: 100 }}>
          Sign Up Now
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "bold",
            fontStyle: "italic",
            marginBottom: 5,
          }}
        >
          You know what to do...
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        {firstNameError !== "" && (
          <Text style={{ color: "red" }}>{firstNameError}</Text>
        )}

        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        {lastNameError !== "" && (
          <Text style={{ color: "red" }}>{lastNameError}</Text>
        )}

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          // style={{borderWidth: 1, borderColor: 'black'}}
        />
        {emailError !== "" && (
          <Text style={{ color: "red" }}>{emailError}</Text>
        )}

        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Enter password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {passwordError !== "" && (
          <Text style={{ color: "red" }}>{passwordError}</Text>
        )}

        <TextInput
          style={styles.textInput}
          placeholder="Enter birthdate (MM/DD/YYYY)"
          value={birthdate}
          onChangeText={(text) => setBirthday(text)}
          keyboardType="default"
          maxLength={10}
        />
        {birthDateError !== "" && (
          <Text style={{ color: "red" }}>{birthDateError}</Text>
        )}

        {/* <Button
          title="Upload"
          onPress={() => {
            ImagePicker.showImagePicker({}, response => {
              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
              } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
              } else {
                const source = { uri: response.uri };
                setImage(source);
              }
            });
          }}
        >
          Select an Image
        </Button>

        {image && <Image source={image} style={styles.image}/>} */}
      </View>

      <TouchableOpacity onPress={() => setIsHidden(!isHidden)}>
        <Text style={styles.btnAddress}>
          {isHidden ? "Address (+)" : "Address (-)"}
        </Text>
      </TouchableOpacity>
      {!isHidden && (
        <View style={styles.addressContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Street"
            value={street}
            onChangeText={(text) => setStreet(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="City"
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Province"
            value={province}
            onChangeText={(text) => setProvince(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Postal code"
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            keyboardType="numeric"
            maxLength={7}
          />
        </View>
      )}

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#4681f4",
            padding: 10,
            alignItems: "center",
            borderRadius: 5,
            marginBottom: 5,
          }}
        >
          <Text style={{ color: "white" }}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleClear}
          style={{
            backgroundColor: "#708090",
            padding: 10,
            alignItems: "center",
            borderRadius: 5,
            marginBottom: 5,
          }}
        >
          <Text style={{ color: "white" }}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleClear}
          style={{
            backgroundColor: "#FF6347",
            padding: 10,
            alignItems: "center",
            borderRadius: 5,
            marginBottom: 5,
          }}
        >
          <Text style={{ color: "white" }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
