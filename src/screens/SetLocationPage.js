import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { styles } from "../styles/styles";
import React, { useState, useEffect } from "react";
import { Slider } from "react-native-elements";

function SetLocation({ navigation, route }) {
  const [value, setValue] = useState(5);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searcBarContainer}>
        <TextInput style={styles.input} placeholder="Search" />
        <Slider
          value={value}
          onValueChange={(val) => setValue(val)}
          minimumValue={5}
          maximumValue={50}
          thumbTintColor="#ffffff"
          step={5}
          labelStyle={{ color: "#ffffff" }}
        />
        <Text
          style={{
            color: "#ffffff",
            fontWeight: "600",
            textAlign: "right",
            paddingHorizontal: 10,
            fontSize: 18,
          }}
        >
          {value}
        </Text>
      </View>
      {/* map */}
      <View style={{ flex: 3 }}>Map Goes Here</View>
      <TouchableOpacity
        style={[
          styles.mediumButton,
          {
            backgroundColor: "#006A79",
          },
        ]}
      >
        <Text style={[{ color: "#ffffff" }, styles.mediumFont]}>
          Set location
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SetLocation;
