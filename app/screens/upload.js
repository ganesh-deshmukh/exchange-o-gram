import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { f, auth, database, storage } from "../config/config";

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> upload files here </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
export default upload;
