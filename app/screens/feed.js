import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList
} from "react-native";
import { f, auth, database, storage } from "../config/config";
console.disableYellowBox = true;

class feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true
    };
  }
  componentDidMount = () => {
    // Load Feed function
    this.loadFeed();
  };

  // check singular or plural time for "ago"
  pluralCheck = s => {
    if (s == 1) return " ago";
    else return "s ago";
  };

  // function to convert timestamp to readable time
  timeConverter = timestamp => {
    var t = new Date(timestamp * 1000);
    var seconds = Math.floor((new Date() - t) / 1000);

    // check this interval is in years/months/days/hours/minutes?
    // total no of seconds in year are 31536000
    var interval = Math.floor(seconds / 31536000);
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

  //***** */ display flatlist main function *****

  addToFlatList = (photo_feed, data, photo) => {
    // photo is index eg. for i in array
    var that = this;

    var photoObj = data[photo];

    // for each photo(photoObj) in data(snapshot-value),
    // get details of ea  ch user then push details to photo-feed-array
    database
      .ref("users")
      .child(photoObj.author)
      .child("username") // now taking whole data as username
      .once("value")
      .then(snapshot => {
        // now we have access to userdetails of author of each-photo
        // we can directly show all photos.

        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val(); // assign data=snapshot, only if it is not empty

        photo_feed.push({
          id: photo, // photo is like iterable=index eg. for i in array.
          url: photoObj.url,
          caption: photoObj.caption,
          posted: that.timeConverter(photoObj.posted),
          author: data,
          authorId: photoObj.author
        });

        that.setState({
          refresh: false,
          loading: false
        });
      }) // end of then(snapshot=> function)
      .catch(e => {
        console.log(e);
      });
  };

  loadFeed = () => {
    this.setState({
      refresh: true,
      photo_feed: []
    });

    var that = this; // to refere local object using this.

    database
      .ref("photos")
      .orderByChild("posted")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val(); // assign data=snapshot, only if it is not empty

        var photo_feed = that.state.photo_feed;

        for (var photo in data) {
          that.addToFlatList(photo_feed, data, photo);
        } // end of for loop
      }) // end of then(snapshot=> function)
      .catch(e => {
        console.log(e);
      });
  };

  loadNew = () => {
    console.log("LoadNew() is called");
    this.loadFeed();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text> Feed </Text>
        </View>

        {this.state.loading === true ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Loading Screen</Text>
          </View>
        ) : (
          <FlatList
            refreshing={this.state.refresh}
            onRefresh={this.loadNew}
            data={this.state.photo_feed}
            keyExtractor={(item, index) => index.toString()}
            style={{
              backgroundColor: "#eee",
              flex: 1
            }}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.flatlistImage}>
                <View style={styles.postDetails}>
                  {/* <Text>@{JSON.stringify(item.author)}</Text> */}
                  {console.log(item.author)}
                  <Text>{item.posted} </Text>

                  <TouchableOpacity
                    onPress={() => {
                      console.log("item.authorId passed =", item.authorId);
                      this.props.navigation.navigate("User", {
                        userId: item.authorId
                        // we will go to userProfile-page,
                        // because navigate->Users={screen:userProfile} in app.js in MainStack
                      });
                    }}
                  />
                </View>
                <View>
                  <Image
                    source={{
                      uri: item.url
                    }}
                    style={styles.profilephoto}
                  />
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{}}> #{item.caption}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("Comments", {
                        userId: item.id
                        // in photo_feed, item.id= photo-id.
                        // pass photoid to show respective comments of that photo.
                      });
                    }}
                  >
                    <Text
                      style={{
                        marginTop: 10,
                        textAlign: "center",
                        color: "blue"
                      }}
                    >
                      [Show all Comments]
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          // {/* End of FlatList-Component */}
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  profilephoto: {
    resizeMode: "cover",
    width: "100%",
    height: 280
  },
  flatlistImage: {
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "grey",
    width: "100%",
    overflow: "hidden",
    marginBottom: 5
  },
  postDetails: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
export default feed;
