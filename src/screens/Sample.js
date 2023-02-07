import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "galio-framework";

export default class Sample extends Component {
  render() {
    return (
      <View>
        <Text p muted>
          Hi, component
        </Text>
      </View>
    );
  }
}
