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

class userProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  checkParams = () => {
    // check if username is passed through userProfile.js or not.
    let params = this.props.navigation.state.params;
    // console.log(" params= ", params);

    if (params) {
      if (params.userId) {
        this.setState({
          userId: params.userId
        });
        // if params are reveived as userId, then fetch user's profile using userId
        this.fetchUserInfo(params.userId);
        console.log("params.userId ", params.userId);
      }
    }

    // const userId  = this.props.navigation.getParam("userId", "NO-ID received");
    // console.log("id received is = ", this.state.userId);
  };

  fetchUserInfo = userId => {
    alert(userId);
  };

  componentDidMount = () => {
    this.checkParams(); // get userId of user through profile.js navigation
  };

  render() {
    // const { navigation } = this.props;
    // const itemId = navigation.getParam("userId2", "NO-ID");
    return (
      <View style={{ flex: 1 }}>
        {this.state.loaded == false ? (
          // means page hasn't loaded yet.
          <View>
            <Text>{this.state.userId}</Text>
          </View>
        ) : (
          // else, pageLoaded=true, then display user's-profile
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
            <View style={{ paddingBottom: 20, borderBottomWidth: 1 }} />
            <View style={styles.photoLoading}>
              <Text>Loading Photos</Text>
            </View>
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
export default userProfile;
