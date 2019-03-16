import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

class feed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <Text> feed </Text>
        </View>

        <Text>Post- Time ago</Text>
        <Text>@username</Text>

        <View>
          <Image
            source={{
              uri:
                "https://source.unsplash.com/random/500x" +
                Math.floor(Math.random() * 800 + 500)
            }}
            style={styles.profilephoto}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
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
  }
});
export default feed;
