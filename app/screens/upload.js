import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { f, auth, database, storage } from "../config/config";

import { Permissions, ImagePicker } from "expo";
// import console = require("console");

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      imageId: this.uniqueId()
    };
    // alert(this.uniqueId());
  }

  _checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      camera: status
    });

    // take permission for Gallery, aka CameraRoll
    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      cameraRoll: statusRoll
    });
  };

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1); // substring return all chars except char at index=0;
  };
  uniqueId = () => {
    // create uniqueId for image as Alphabetical
    return (
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4()
    );
  };

  findNewImage = async () => {
    this._checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true, // square image
      quality: 1 // 1 means 100%
    });
    console.log(result);

    if (!result.cancelled) {
      // if it's not cancelled, means chosen photo
      // process image and upload to firebase database.
      console.log("uploaded image");
      this.uploadImage(result.uri);
    } else {
      console.log("cancelled");
    }
  };

  uploadImage = () => {
    // add logic to upload photo to firebase
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
