import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { f, auth, database, storage } from "../config/config";

class profile extends Component {
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
          <Text>Profile- Logged In User</Text>
        ) : (
          <View>
            <Text>You are not-Logged in</Text>
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
export default profile;
