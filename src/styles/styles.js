import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    color: "",
  },
  image: {
    height: 100,
  },
  input: {
    marginVertical: 10,
    paddingHorizontal: 10,

    height: 50,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D4D4D4",
  },

  mediumButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },

  customButton: {
    margin: 0,
    height: 50,
    borderRadius: 10,
    width: "100%",
    color: "#FFFFFF",
  },
  lightText: {
    color: "#ffffff",
  },
  mediumFont: {
    fontSize: 18,
  },
});
