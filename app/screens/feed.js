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
import PhotoList from "../components/photoList";

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
    console.log("feed.js componentDidMount is working");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text> Feed </Text>
        </View>

        <PhotoList
          isUser={true}
          userId={this.state.userId}
          navigation={this.props.navigation}
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
