import React, { Component } from "react";
import {
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  FlatList
} from "react-native";
import { f, auth, database, storage } from "../config/config";

class userAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: true,
      comments_list: []
    };
  }

  checkParams = () => {
    // check if username is passed through userProfile.js or not.
    let params = this.props.navigation.state.params;
    // console.log("params =", params);
    // console.log(" params= ", params);

    if (params) {
      if (params.photoId) {
        // console.log("params.photoId in comments.js", params.photoId);
        this.setState({
          photoId: params.photoId
        });
        // if params are reveived as userId, then fetch user's profile using userId
        this.fetchComments(params.photoId);
        // console.log("params.userId ", params.userId);
      }
    }
  };

  addCommentToList = (comments_list, data, comment) => {
    // console.log("comments_list, data, comment", comments_list, data, comment);

    var that = this;
    var commentObj = data[comment];
    database
      .ref("users")
      .child(commentObj.author)
      .child("username")
      .once("value")
      .then(snapshot => {
        // console.log("snapshot is username \n ", snapshot);
        // here, snapshot = username
        const exists = snapshot.val() != null;
        if (exists) data = snapshot.val();
        comments_list.push({
          id: comment,
          comment: commentObj.comment,
          timestamp: that.timeConverter(commentObj.posted),
          author: data,
          authorId: commentObj.author
        });

        // console.log("addCommentToList, comment is commentObj.comment", comment);

        that.setState({
          refresh: false,
          loading: false
        });
      })
      .catch(error =>
        console.log("error in addCommentToList in comments", error)
      );
  };

  fetchComments = photoId => {
    let that = this;
    database
      .ref("comments")
      .child(photoId)
      .orderByChild("posted")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) {
          // console.log("snapshot = comment-object", snapshot.val());
          // add comments to flatList
          data = snapshot.val();
          var comments_list = that.state.comments_list;

          for (var comment in data) {
            that.addCommentToList(comments_list, data, comment);
          }
        } else {
          // no any comment found
          this.setState({
            comments_list: []
          });
        }
      })
      .catch(error =>
        console.log("error in comment.js file in fetchComments", error)
      );
  }; // fetching comments.f

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
  // timeConverter-function ends here.

  componentDidMount = () => {
    // set variable that=this, for binding
    var that = this;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log("User Loggedin in comments.js");

        // Loggedin
        that.setState({
          loggedin: true
        });
      } else {
        // console.log("User Not Loggedin in comments.js");
        // Not-Loggedin
        that.setState({
          loggedin: false
        });
      }
    });

    this.checkParams();
  };

  postComment = () => {
    // console.log("posting post");
    let comment = this.state.comment;
    if (comment != "") {
      // process comment
      let imageId = this.state.photoId;
      let userId = f.auth().currentUser.uid;
      let commentId = this.uniqueId();
      let dateTime = Date.now();
      let timestamp = Math.floor(dateTime / 1000);

      this.setState({
        comment: "" // clear comment after posting,
      });
      let commentObj = {
        posted: timestamp,
        author: userId,
        comment: comment
      };

      database.ref("/comments/" + imageId + "/" + commentId).set(commentObj);

      // reload all comments after adding
      this.reloadCommentList();
    } else {
      alert("Sorry empty comment can't be posted");
    }
  };

  reloadCommentList = () => {
    this.setState({
      comments_list: []
    });
    this.fetchComments(this.state.photoId);
  };

  render() {
    return (
      <View style={styles.container}>
            <Text>You are not-Logged in, can't post your comments</Text>
            <Text>Please Logged in</Text>
          </View>
    );
  } // end of render()
}

const styles = StyleSheet.create({
  flatlistView: {
    width: "100%",
    overflow: "hidden"
  },
  container: {
    flex: 1,
    backgroundColor: "#eee"
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
  }
}


export default userAuth;
