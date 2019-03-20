import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { f, auth, database, storage } from "../config/config";

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
          // photo is index eg. for i in array
          var photoObj = data[photo];

          // for each photo(photoObj) in data(snapshot-value),
          // get details of each user then push details to photo-feed-array
          database
            .ref("users")
            .child(photoObj.author)
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
                posted: photoObj.posted,
                author: data.username
              });

              that.setState({
                refresh: false,
                loading: false
              });
            }) // end of then(snapshot=> function)
            .catch(e => {
              console.log(e);
            });
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

  _renderItem = (item, index) => {
    console.log("item is " + item.id + "index is " + index);
    return (
      <View key={item.id} style={styles.flatlistImage}>
        <View style={styles.postDetails}>
          <Text>5 minutes ago</Text>
          <Text>@username</Text>
        </View>

        <View>
          <Image
            source={{
              uri:
                "https://source.unsplash.com/random/500x" +
                Math.floor(Math.random() * 800 + 500)

              // uri: "https://source.unsplash.com/random/500x770/"
            }}
            style={styles.profilephoto}
          />
        </View>

        <View style={{ padding: 5 }}>
          <Text style={{}}> #HashTag- Caption of post</Text>
          <Text style={{ marginTop: 10, textAlign: "center" }}>
            {" "}
            View all Comments.....
          </Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text> feed </Text>
        </View>

        <FlatList
          refreshing={this.state.refresh}
          onRefresh={this.loadNew}
          data={this.state.photo_feed}
          keyExtractor={(item, index) => item.id}
          style={{
            backgroundColor: "#eee",
            flex: 1
          }}
          renderItem={this._renderItem}
        />
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
