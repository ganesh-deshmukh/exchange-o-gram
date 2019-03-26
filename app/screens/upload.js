import React, { Component } from "react";
import {
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from "react-native";
import { f, auth, database, storage } from "../config/config";

import { Permissions, ImagePicker } from "expo";
console.disableYellowBox = true;

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      imageId: this.uniqueId(),
      imageSelected: false,
      uploading: false,
      caption: ""
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

  findNewImage = async uri => {
    this._checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true, // square image
      quality: 1 // 1 means 100%
    });
    console.log(result);

    // if it's not cancelled, means chosen photo
    // process image and upload to firebase database.
    if (!result.cancelled) {
      console.log("uploaded image");
      this.setState({
        imageSelected: true,
        imageId: this.uniqueId(),
        uri: result.uri // uri to show preview of img
      });
      // this.uploadImage(result.uri);
    } else {
      console.log("Image selection is cancelled");
      this.setState({
        imageSelected: false
      });
    }
  };

  uploadImage = async uri => {
    let that = this;
    let userid = f.auth().currentUser.uid;
    let imageId = this.state.imageId; // imgId = uniqueIdGenerated()

    // check file extension ofo uploaded img
    let re = /(?:\.([^.]+))?$/; // filename, regular-expression
    let ext = re.exec(uri)[1]; // extension

    this.setState({
      currentFileType: ext
    });

    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    let FilePath = imageId + "." + that.state.currentFileType; // imageId.ext

    const ref = storage.ref("user/" + userid + "/img").child(FilePath);

    const snapshot = await ref.put(blob).on("state_changed", snapshot => {
      console.log("Progress", snapshot.bytesTransferred, snapshot.totalBytes);
    });
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

          <View style={{ flex: 1 }}>
            {/*  check if image is selected or not? */}
            {this.state.imageSelected == true ? (
              // yes img selected then choose caption & upload it now.
              <View style={{ flex: 1 }}>
                <View style={styles.header}>
                  <Text> Upload </Text>
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ marginTop: 5 }}>Choose Caption:</Text>
                  <TextInput
                    editable={true}
                    placeholder={"Enter your caption..."}
                    maxLength={100}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => this.setState({ caption: text })}
                    style={styles.textInput}
                  />
                </View>
              </View>
            ) : (
              // no, img is not selected yet, show menu to upload

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
            )}
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
  },
  header: {
    height: 70,
    paddingTop: 30,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    marginVertical: 10,
    height: 100,
    padding: 5,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: "white"
  }
});
export default upload;
