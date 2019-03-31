import React, { Component } from "react";
import {
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image
} from "react-native";
import { f, auth, database, storage } from "../config/config";

import UserAuth from "../components/auth";

class comments extends Component {
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

    if (params.photoId) {
      // console.log("params.photoId in comments.js", params.photoId);

      this.setState({
        photoId: params.photoId
      });
      // if params are reveived as userId, then fetch user's profile using userId

      this.fetchComments(params.photoId);
      // console.log("params.userId ", params.userId);
    }
  };

  addCommentToList = (comments_list, data, comment) => {
    // console.log("comments_list, data, comment", comments_list, data, comment);

    let that = this;
    let commentObj = data[comment];
    database
      .ref("users")
      .child(commentObj.author)
      .child("username")
      .once("value")
      .then(snapshot => {
        // console.log("snapshot is username \n ", snapshot);
        // here, snapshot = username
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();

        comments_list.push({
          id: comment,
          comment: commentObj.comment,
          posted: that.timeConverter(commentObj.posted),
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
        const exists = snapshot.val() !== null;
        if (exists) {
          // console.log("snapshot = comment-object", snapshot.val());
          // add comments to flatList
          data = snapshot.val();
          let comments_list = that.state.comments_list;

          for (let comment in data) {
            that.addCommentToList(comments_list, data, comment);
          }
        } else {
          // no any comment found
          that.setState({
            comments_list: []
          });
        }
      })
      .catch(error =>
        console.log("error in comment.js file in fetchComments", error)
      );
  }; // fetching comments.f

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
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

    let that = this;
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
        <View style={styles.header}>
          <TouchableOpacity
            style={{ width: 100 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.goBackLabel}> &lt;- Go Back</Text>
          </TouchableOpacity>
          <Text>Comments </Text>
          <Text style={{ width: 100 }} />
        </View>
        {/* {console.log("this.state.comments_list =", this.state.comments_list)} */}
        {this.state.comments_list.length == 0 ? (
          //no comments show empty state
          <Text style={{ backgroundColor: "#eee" }}>
            No Comments found in DB.
          </Text>
        ) : (
          // <Text>comments</Text>
          <FlatList
            refreshing={this.state.refresh}
            data={this.state.comments_list}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1, backgroundColor: "#eee" }}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.flatListViewItems}>
                <View
                  style={{
                    padding: 5,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text>time :{item.posted}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("User", {
                        userId: item.authorId
                      })
                    }
                  >
                    <Text style={{ paddingRight: 5 }}>{item.author}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ padding: 5 }}>
                  <Text>{item.comment}</Text>
                </View>
              </View>
            )}
          />
        )}
        {this.state.loggedin == true ? (
          //are logged in
          <KeyboardAvoidingView
            behavior="padding"
            enabled
            style={status.keyboardView}
          >
            <Text style={{ fontWeight: "bold" }}>Post Your Comment.</Text>
            <View>
              <TextInput
                editable={true}
                placeholder={"enter your comment here.."}
                onChangeText={text => this.setState({ comment: text })}
                value={this.state.comment}
                style={{
                  marginVertical: 10,
                  height: 50,
                  padding: 5,
                  borderColor: "grey",
                  borderRadius: 3,
                  backgroundColor: "white",
                  color: "black"
                }}
              />

              <TouchableOpacity
                style={styles.postBtn}
                onPress={() => this.postComment()}
              >
                <Text style={{ color: "white" }}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          // if user is not authenticated

          <UserAuth
            message={"Please Login to Comment on Photo"}
            moveScreen={true}
            navigation={this.props.navigation}
          />
        )}
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
    borderBottomWidth: 0.5,
    justifyContent: "center",
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
    fontSize: 12,
    fontWeight: "bold",
    paddingLeft: 10
  },
  keyboardView: {
    borderTopWidth: 1,
    borderTopColor: "grey",
    padding: 10,
    marginBottom: 15
  },
  textInputColor: {
    padding: 5,
    marginVertical: 10,
    height: 50,
    borderColor: "red",
    borderRadius: 3,
    backgroundColor: "white",
    color: "black"
  },
  postBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    borderRadius: 5
  },
  timeAuthorView: {
    padding: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  flatListViewItems: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 5,
    justifyContent: "space-between",
    borderColor: "grey",
    borderBottomWidth: 3
  }
});
export default comments;
