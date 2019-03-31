import firebase from "@firebase/app";
import "@firebase/database";
import "@firebase/storage";
import "@firebase/auth";
// // import "@firebase/firestore";

// import firebase from "firebase";
// import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyC9LatTeMQelpvGycFGelb3ceXFVH1IkGA",
  authDomain: "exchange-o-gram-app.firebaseapp.com",
  databaseURL: "https://exchange-o-gram-app.firebaseio.com",
  projectId: "exchange-o-gram-app",
  storageBucket: "exchange-o-gram-app.appspot.com",
  messagingSenderId: "162706638035"
};
firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
