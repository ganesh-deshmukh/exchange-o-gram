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

  render() {
    let i = 0;
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
          style={styles.flatlist}
          renderItem={({ item, index }) => {
            console.log("index is " + index);
            // console.log("item is " + item);
            // return one element for each item.

            <View key={index}>
              <View>
                <Text>Time ago</Text>
                <Text>@username</Text>
              </View>

              <View>
                <Image
                  source={{
                    // uri:
                    //   "https://source.unsplash.com/random/500x" +
                    //   Math.floor(Math.random() * 800 + 500)

                    uri: "https://source.unsplash.com/random/500x800/"
                  }}
                  style={styles.profilephoto}
                />
              </View>

              <View>
                <Text>Caption of post</Text>
                <Text>View all Comments</Text>
              </View>
            </View>;
          }}
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
    height: 250
  },
  flatlist: {
    flex: 1
    // backgroundColor: "#0ee"
  }
});
export default feed;
