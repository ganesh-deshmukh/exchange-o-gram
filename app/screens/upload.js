import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { f, auth, database, storage } from "../config/config";

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false
    };
  }

  findNewImage = () => {
    console.log("Selecting Image from photo picker");
  };

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
      <View style={{ flex: 1 }}>
        {this.state.loggedin == true ? (
          // true-> you are loggedin
          <View style={styles.container}>
            <Text style={styles.uploadText}>Upload</Text>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => {
                this.findNewImage();
              }}
            >
              <Text style={{ color: "white" }}>Select Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.container}>
            <Text>You are not-Logged in, can't upload photos</Text>
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
    alignItems: "center",
    justifyContent: "center"
  },
  uploadText: {
    fontSize: 28,
    paddingBottom: 15
  },
  uploadBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    borderRadius: 5
  }
});
export default upload;
