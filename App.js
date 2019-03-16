import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import feed from "./app/screens/feed";
import upload from "./app/screens/upload";
import profile from "./app/screens/profile";

class App extends React.Component {
  render() {
    // make sure app always returns AppContainer
    return <AppContainer />;
  }
}

// make navigation-module or tabs or drawer and pass it to AppContainer
const MainStack = createBottomTabNavigator({
  Feed: {
    screen: feed
  },
  Upload: {
    screen: upload
  },
  Profile: {
    screen: profile
  }
});

// always pass your Navigation-module to AppContainer
const AppContainer = createAppContainer(MainStack);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
