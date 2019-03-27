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

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      comment_list: []
    };
  }
  checkParams = () => {
    // check if username is passed through userProfile.js or not.
    let params = this.props.navigation.state.params;
    // console.log(" params= ", params);

    if (params) {
      if (params.photoId) {
        this.setState({
          photoId: params.photoId
        });
        // if params are reveived as userId, then fetch user's profile using userId
        this.fetchComments(params.photoId);
        // console.log("params.userId ", params.userId);
      }
    }

    fetchComments =  (photoId) =>{

    }// fetching comments.f


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

  // check singular or plural time for "ago"
  pluralCheck = s => {
    if (s == 1) return " ago";
    else return "s ago";
  };

  // function to convert timestamp to readable time
  timeConverter = timestamp => {
    let t = new Date(timestamp * 1000);
    let seconds = Math.floor((new Date() - t) / 1000);

    // check this interval is in years/months/days/hours/minutes?
    // total no of seconds in year are 31536000
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " year" + this.pluralCheck(interval);
    }

    // for months
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " month" + this.pluralCheck(interval);
    }
    // for days
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " day" + this.pluralCheck(interval);
    }
    // for hours
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hour" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minute" + this.pluralCheck(interval);
    }

    // for seconds
    return Math.floor(seconds) + " second" + this.pluralCheck(seconds);
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

    this.checkParams();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ width: 100 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.goBackLabel}> &lt;- Go Back</Text>
          </TouchableOpacity>
          <Text> Comments Header </Text>
          <Text style={{ width: 100 }}> </Text>
        </View>

        {
          this.state.comment_list.length == 0 ?

          (
            // no comments
          ) :(
            // comments can be present
            <FlatList
            data = {this.state.comment_list.length == 0 }


            />
          )
        }


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
    backgroundColor: "#fff"
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
  goBackLabel: {
    fontSize: 13,
    fontWeight: "bold",
    paddingLeft: 5
  }
});
export default upload;
