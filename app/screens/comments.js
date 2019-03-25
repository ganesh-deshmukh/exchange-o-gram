import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { f, auth, database, storage } from "../config/config";

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false
    };
  }

  componentDidMount = () => {
    // set variable that=this, for binding
    var that = this;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        // Loggedin
        that.setState({
          loggedin: true
        });
      } else {
        // Not-Loggedin
        that.setState({
          loggedin: false
        });
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loggedin == true ? (
          // true-> you are loggedin
          <Text>Your comments...</Text>
        ) : (
          <View>
            <Text>You are not-Logged in, can't post your comments</Text>
            <Text>Please Logged in</Text>
          </View>
        )}
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
