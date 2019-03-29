import React, { Component } from "react";
import {
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet
} from "react-native";
import { f, auth, database, storage } from "../config/config";

class UserAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authStep: 0,
      email: "",
      pass: "",
      moveScreen: false
    };
  }
  componentDidMount = () => {
    console.log("cdm");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>You are not-Logged in, can't post your comments</Text>
        <Text>{this.props.message}</Text>
      </View>
    );
  } // end of render()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default UserAuth;
