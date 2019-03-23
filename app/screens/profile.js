import React, { Component } from "react";
import {
  TouchableOpacity,
  FlatList,
  Image,
  View,
  Text,
  StyleSheet
} from "react-native";

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
      <View style={{ flex: 1 }}>
        {this.state.loggedin == true ? (
          // true-> you are loggedin
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <Text> Profile </Text>
            </View>

            <View style={styles.profile}>
              <Image
                source={{
                  uri: "https://api.adorable.io/avatars/285/test@user.i.png"
                }}
                style={styles.profilePicture}
              />

              <View style={styles.profileDetails}>
                <Text>Name </Text>
                <Text>@username </Text>
              </View>
            </View>
            <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
              <TouchableOpacity style={styles.buttons}>
                <Text style={styles.labels}>LogOut</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons}>
                <Text style={styles.labels}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Upload");
                }}
                style={styles.upload}
              >
                <Text style={styles.uploadText}>+ Upload New Photo </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.photoLoading}>
              <Text>Loading Photos</Text>
            </View>
          </View>
        ) : (
          // if user is not authenticated
          <View style={styles.container}>
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
  profile: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10
  },
  profilePicture: {
    marginLeft: 10,
    width: 100,
    height: 100,
    borderRadius: 50
  },
  profileDetails: {
    marginRight: 10
  },
  buttons: {
    marginTop: 10,
    marginHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    borderColor: "grey",
    borderWidth: 1.5
  },
  upload: {
    marginTop: 10,
    marginHorizontal: 40,
    paddingVertical: 35,
    borderRadius: 25,
    backgroundColor: "grey",
    borderColor: "grey",
    borderWidth: 1.5
  },
  labels: {
    textAlign: "center",
    color: "grey"
  },
  uploadText: {
    textAlign: "center",
    color: "white"
  },
  photoLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green"
  }
});
export default profile;
