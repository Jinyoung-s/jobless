import { View, StyleSheet } from "react-native";
import { Text, Block } from "galio-framework";

function App() {
  return (
    <Block flex safe>
      <View style={styles.container}>
        <Text>This is the chat space...</Text>
      </View>
    </Block>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
