import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomHeader = ({ title, time }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  time: {
    fontSize: 14,
    color: "gray",
  },
});

export default CustomHeader;
