import { StyleSheet } from "react-native";

export const primaryColor = "#006A79";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    color: "",
  },
  homeContainer: {
    flex: 1,
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
  searcBarContainer: {
    backgroundColor: primaryColor,
    paddingBottom: 10,
    paddingHorizontal: 10,
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
  postContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  postDetails: {
    paddingLeft: 10,
    flex: 1,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  profileHeader: {
    height: 200,
    margin: 0,
    padding: 0,
  },
  profilePicture: {
    borderColor: "#ffffff",
    borderWidth: 3,
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  cardProfile: {
    marginTop: -90,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
