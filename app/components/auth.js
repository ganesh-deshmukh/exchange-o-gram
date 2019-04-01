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
      password: "",
      moveScreen: false
    };
  }

  login = async () => {
    let email = this.state.email;
    let password = this.state.password;
    // console.log(password);
    if (email != "" && password != "") {
      try {
        let user = await auth.signInWithEmailAndPassword(email, password); //'test@user.com', 'password');
      } catch (err) {
        console.log("error in auth.js in signInWithEmail&Password");
        alert(err);
      }
    } else {
      alert("Please fill both details, it can't be empty ");
    }
  };

  createUserObj = (userObj, email) => {
    // console.log(userObj, email, userObj.uid);
    let uObj = {
      name: "Enter your name",
      username: "@username",
      avatar: "https://www.gravatar.com/avatar",
      email: email
    };
    database
      .ref("users")
      .child(userObj.uid)
      .set(uObj);
  };

  signUp = async () => {
    let email = this.state.email;
    let password = this.state.password;
    if (email != "" && password != "") {
      try {
        let user = await auth
          .createUserWithEmailAndPassword(email, password)
          .then(userObj => this.createUserObj(userObj.user, email))
          .catch(e => alert(e));
      } catch (err) {
        console.log("error in auth in creating User");
        alert(err);
      }
    } else {
      alert("Please fill both details, it can't be empty ");
    }
  };

  componentDidMount = () => {
    if (this.props.moveScreen == true) {
      this.setState({
        moveScreen: true
      });
    }
  };

  showLogin = () => {
    if (this.state.moveScreen == true) {
      this.props.navigation.navigate("Upload");
      return false;
    }
    this.setState({ authStep: 1 });
  };

  showSignUp = () => {
    if (this.state.moveScreen == true) {
      this.props.navigation.navigate("Upload");
      return false;
    }
    this.setState({ authStep: 2 });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>You are not-Logged in</Text>
        <Text>{this.props.message}</Text>
        {this.state.authStep == 0 ? (
          <View style={styles.btnList}>
            <TouchableOpacity onPress={() => this.showLogin()}>
              <Text style={styles.loginLabel}>Login</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 10 }}> or</Text>
            <TouchableOpacity onPress={() => this.showSignUp()}>
              <Text style={styles.loginLabel}>SignUp</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginVertical: 20 }}>
            {this.state.authStep == 1 ? (
              // login user
              <View>
                <TouchableOpacity
                  onPress={() => this.setState({ authStep: 0 })}
                  style={styles.cancelBtn}
                >
                  <Text style={{ fontWeight: "bold" }}> &lt;- Cancel</Text>
                </TouchableOpacity>

                <Text>Email Address: </Text>
                <TextInput
                  editable={true}
                  keyboardType={"email-address"}
                  placeholder={"Your email id goes here..."}
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  style={styles.emailInputButton}
                />
                <Text>Password</Text>
                <TextInput
                  editable={true}
                  secureTextEntry
                  placeholder={"Your password is here"}
                  onChangeText={input => this.setState({ password: input })}
                  value={this.state.password}
                  style={styles.emailInputButton}
                />

                <TouchableOpacity
                  onPress={() => this.login()}
                  style={styles.loginButtonWithEmailPass}
                >
                  <Text style={{ color: "white" }}>Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // signup user
              <View>
                <TouchableOpacity
                  onPress={() => this.setState({ authStep: 0 })}
                  style={styles.cancelBtn}
                >
                  <Text style={{ fontWeight: "bold" }}> &lt;- Cancel</Text>
                </TouchableOpacity>

                <Text>Email Address: </Text>
                <TextInput
                  editable={true}
                  keyboardType={"email-address"}
                  placeholder={"Your email id goes here..."}
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  style={styles.emailInputButton}
                />
                <Text>Password</Text>
                <TextInput
                  editable={true}
                  secureTextEntry
                  placeholder={"Your password is here"}
                  onChangeText={input => this.setState({ password: input })}
                  value={this.state.password}
                  style={styles.emailInputButton}
                />

                <TouchableOpacity
                  onPress={() => this.signUp()}
                  style={styles.loginButtonWithEmailPass}
                >
                  <Text style={{ color: "white" }}>SignUp</Text>
                </TouchableOpacity>
              </View>
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
  },
  cancelBtn: {
    borderBottomWidth: 1,
    paddingVertical: 5,
    marginBottom: 10,
    borderBottomColor: "black",
    fontWeight: "bold",
    marginBottom: 20
  },
  emailInputButton: {
    width: 250,
    marginVertical: 10,
    padding: 5,
    borderColor: "grey",
    borderRadius: 3,
    borderWidth: 1
  },
  loginButtonWithEmailPass: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15
  }
});

export default UserAuth;
