import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";

class feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [0, 1, 2, 3, 4], // this is data of our app
      refresh: false
    };
  }

  loadNew = () => {
    console.log("LoadNew() is called");
    this.setState({
      refresh: true
    });
    this.setState({
      photo_feed: [5, 6, 7, 8, 9],
      refresh: false // after loading new photos [5,6,7,8,9] stop refreshing feed
    });
  };

  _renderItem = (item, index) => {
    console.log(item, index);
    return (
      <View key={index} style={styles.flatlistImage}>
        <View style={styles.postDetails}>
          <Text>5 minutes ago</Text>
          <Text>@username</Text>
        </View>

        <View>
          <Image
            source={{
              //   uri:
              //     "https://source.unsplash.com/random/500x" +
              //     Math.floor(Math.random() * 800 + 500)

              uri: "https://source.unsplash.com/random/500x770/"
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
          keyExtractor={(item, index) => "" + index}
          style={{
            backgroundColor: "#eee"
            // flex: 1
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
