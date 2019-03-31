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

import PhotoList from "../components/photoList";

class profile extends Component {
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
        // console.log("params.userId ", params.userId);
      }
    }

    // const userId  = this.props.navigation.getParam("userId", "NO-ID received");
    // console.log("id received is = ", this.state.userId);
  };

  fetchUserInfo = userId => {
    //
    let that = this;

    database
      .ref("users")
      .child(userId)
      .child("username")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({
          username: data
        });
        console.log("username in UserProfile = ", this.state.username);
      })
      .catch(e => console.log(e));

    database
      .ref("users")
      .child(userId)
      .child("name")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({ name: data });
      })
      .catch(e => console.log(e));

    database
      .ref("users")
      .child(userId)
      .child("avatar")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({
          avatar: data,
          loaded: true
          // now we have fetched data and loaded page, now make loaded=true.
        });
      })
      .catch(e => console.log(e));
    // catch error if snapshot is not found through api
  };

  componentDidMount = () => {
    this.checkParams();
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
            <Text>Loading...</Text>
          </View>
        ) : (
          // else, pageLoaded=true, then display user's-profile

          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity
                style={{ width: 100 }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={styles.goBackLabel}> &lt;- Go Back</Text>
              </TouchableOpacity>
              <Text> Profile </Text>
              <Text style={{ width: 100 }}> </Text>
            </View>

            <View style={styles.profile}>
              <Image
                source={{
                  uri: this.state.avatar
                }}
                style={styles.profilePicture}
              />

              <View style={styles.profileDetails}>
                <Text>{this.state.name}</Text>
                {console.log(
                  "username before displaying is ",
                  this.state.username
                )}
                <Text>{this.state.username}</Text>
              </View>
            </View>
            <View style={{ paddingBottom: 20, borderBottomWidth: 1 }} />
            {console.log(
              "userId sent through userProfile =",
              this.state.userId
            )}

            <PhotoList
              isUser={true}
              userId={this.state.userId}
              navigation={this.props.navigation}
            />
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
    flexDirection: "row",
    height: 70,
    paddingTop: 30,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 1,
    justifyContent: "space-between",
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
  },
  goBackLabel: {
    fontSize: 13,
    fontWeight: "bold",
    paddingLeft: 5
  }
});
export default userProfile;
