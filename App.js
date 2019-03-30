import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";
import { f, auth, database, storage } from "./app/config/config";

import feed from "./app/screens/feed";
import upload from "./app/screens/upload";
import profile from "./app/screens/profile";
import userProfile from "./app/screens/userProfile";
import comments from "./app/screens/comments";
import { initFirebaseFunc } from "./app/config/config";

componentWillMount = () => {
  initFirebaseFunc();
};

// make navigation-module or tabs or drawer and pass it to AppContainer
const TabStack = createBottomTabNavigator({
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

const MainStack = createStackNavigator(
  {
    Home: {
      screen: TabStack
    },
    User: {
      screen: userProfile
    },
    Comments: {
      screen: comments
    }
  }, // screens object ends here.
  // apply features to your app-screen
  {
    initialRouteName: "Home",
    mode: "modal", // card and modal are same in android
    headerMode: "none"
  }
);

class App extends React.Component {
  login = async () => {
    // force user to login, using try-cache
    try {
      // no errors,
      let user = await auth.signInWithEmailAndPassword(
        "test@user.com",
        "password"
      );
      // alert("user successfully loggedin");
    } catch (err) {
      console.log(err);
    }
  };

  constructor(props) {
    super(props);
    // this.login();
  }
  render() {
    // make sure app always returns AppContainer
    return <AppContainer />;
  }
}

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
