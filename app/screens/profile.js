import React, { Component } from "react";
import {
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  View,
  Text,
  StyleSheet
} from "react-native";
import PhotoList from "../components/photoList";
import { f, auth, database, storage } from "../config/config";

class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      editProfile: false
    };
  }

  fetchUserInfo = userId => {
    var that = this;
    database
      .ref("users")
      .child(userId)
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;

        if (exists) {
          data = snapshot.val();
          // data = one userObject
          that.setState({
            username: data.username,
            name: data.name,
            avatar: data.avatar,
            loggedin: true,
            userId: userId
          });
        }
      });
  };
  componentDidMount = () => {
    // set variable that=this, for binding
    var that = this;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        // Loggedin
        that.fetchUserInfo(user.uid);
      } else {
        // Not-Loggedin
        that.setState({
          loggedin: false
        });
      }
    });
  };

  logOut = () => {
    f.auth().signOut();
    alert("logout");
  };

  editProfile = () => {
    this.setState({
      editingProfile: true
    });
    // alert("editProfile");
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
                  uri: this.state.avatar
                }}
                style={styles.profilePicture}
              />

              <View style={styles.profileDetails}>
                <Text>Name: {this.state.name} </Text>
                <Text>Username: {this.state.username}</Text>
              </View>
            </View>

            {this.state.editingProfile == true ? (
              // editing is true, show page to edit profile.

              <View style={styles.editProfileView}>
                {/* View for Buttons Name and Username */}
                <View style={styles.editUserInfoName}>
                  <Text style={styles.inputLabelText}>Name:</Text>
                  <TextInput
                    style={styles.textInputArea}
                    editable={true}
                    placeholder={"Enter your Name"}
                    value={this.state.name}
                    onChangeText={text => {
                      this.setState({ name: text });
                    }}
                  />
                </View>
                <View style={styles.editUserInfoName}>
                  <Text style={styles.inputLabelText}>Username:</Text>
                  <TextInput
                    style={styles.textInputArea}
                    editable={true}
                    placeholder={"Enter your Username"}
                    value={this.state.username}
                    onChangeText={text => {
                      this.setState({ username: text });
                    }}
                  />
                </View>

                {/* view for two buttons */}
                <View style={styles.editAndCancellBtnView}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => this.setState({ editingProfile: false })}
                  >
                    <Text style={{ color: "white" }}>Cancel Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => this.saveProfile()}
                  >
                    <Text style={{ color: "white" }}>Save Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // if editing is false, then show buttons, else if true, show edit-page
              /* // LogOut, Edit, UploadPhoto => 3 buttons */
              <View style={styles.buttonsView}>
                <TouchableOpacity
                  style={styles.buttons}
                  onPress={() => this.logOut()}
                >
                  <Text style={styles.labels}>LogOut</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttons}
                  onPress={() => this.editProfile()}
                >
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
            )}

            <PhotoList
              isUser={true}
              userId={this.state.userId}
              navigation={this.props.navigation}
            />
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
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    height: 50,
    paddingTop: 20,
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
    marginRight: 10,
    alignItems: "flex-start"
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
    paddingVertical: 15,
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
  buttonsView: {
    paddingBottom: 20,
    borderBottomWidth: 1
  },
  editProfileView: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    borderBottomWidth: 1
  },
  textInputArea: {
    width: 250,
    marginVertical: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: "grey",
    marginLeft: "auto"
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 10,
    fontWeight: "bold",
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  saveButton: {
    flex: 1,
    marginHorizontal: 5,
    fontWeight: "bold",
    backgroundColor: "green",
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },

  editAndCancellBtnView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  editUserInfoName: {
    flexDirection: "row"
  },

  inputLabelText: {
    alignSelf: "center"
  }
});
export default profile;
