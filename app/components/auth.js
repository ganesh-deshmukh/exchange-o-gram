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

  login = async () => {
    // force user to login, using try-cache
    try {
      // no errors,
      let user = await auth.signInWithEmailAndPassword(
        "test@user.com",
        "password"
      );
      // alert("user successfully loggedin");
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount = () => {
    // console.log("cdm");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>You are not-Logged in</Text>
        <Text>{this.props.message}</Text>
        {this.state.authStep == 0 ? (
          <View style={styles.btnList}>
            <TouchableOpacity onPress={() => this.setState({ authStep: 1 })}>
              <Text style={styles.loginLabel}>Login</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 10 }}> or</Text>
            <TouchableOpacity onPress={() => this.setState({ authStep: 2 })}>
              <Text style={styles.loginLabel}>SignUp</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginVertical: 20 }}>
            {this.state.login == 1 ? (
              // login user
              <Text>Login Page</Text>
            ) : (
              // signup user
              <Text>SignUp Page</Text>
            )}
          </View>
        )}
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
  },
  btnList: {
    flexDirection: "row",
    marginVertical: 20
  },
  loginLabel: {
    fontWeight: "bold",
    color: "green"
  },
  signUpLabel: {
    fontWeight: "bold",
    color: "blue"
  }
});

export default UserAuth;
