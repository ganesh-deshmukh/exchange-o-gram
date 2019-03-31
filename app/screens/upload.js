import React, { Component } from "react";
import {
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from "react-native";
import { f, auth, database, storage } from "../config/config.js";
import UserAuth from "../components/auth.js";
import { Permissions, ImagePicker } from "expo";

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      imageId: this.uniqueId(),
      imageSelected: false,
      uploading: false,
      caption: "",
      progress: 0
    };
    // alert(this.uniqueId());
  }

  _checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      camera: status
    });

    // take permission for Gallery, aka CameraRoll
    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      cameraRoll: statusRoll
    });
  };

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1); // substring return all chars except char at index=0;
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

  findNewImage = async () => {
    this._checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      console.log("upload image");
      this.setState({
        imageSelected: true,
        imageId: this.uniqueId(),
        uri: result.uri
      });
      //this.uploadImage(result.uri);
    } else {
      console.log("cancel");
      this.setState({
        imageSelected: false
      });
    }
  };

  uploadPublish = () => {
    if (this.state.uploading == false) {
      if (this.state.caption != "") {
        //now upload image to firebase-db, as we have img with caption
        this.uploadImage(this.state.uri);
      } else {
        alert("Please enter caption for your photo, to post.");
      }
    } else {
      console.log("Ignoring click more than once.");
    }
  };

  // this is main function to upload upload img
  uploadImage = async uri => {
    //
    let that = this;
    let userid = f.auth().currentUser.uid;
    let imageId = this.state.imageId; // imgId = uniqueIdGenerated()

    // check file extension ofo uploaded img
    let re = /(?:\.([^.]+))?$/; // filename, regular-expression
    let ext = re.exec(uri)[1]; // extension
    this.setState({
      currentFileType: ext,
      uploading: true
    });

    /*const response = await fetch(uri);
    const blob = await response.blob();*/
    let FilePath = imageId + "." + that.state.currentFileType;

    const oReq = new XMLHttpRequest();
    oReq.open("GET", uri, true);
    oReq.responseType = "blob";
    oReq.onload = () => {
      const blob = oReq.response;
      //Call function to complete upload with the new blob to handle the uploadTask.
      this.completeUploadBlob(blob, FilePath);
    };
    oReq.send();

    /*let uploadTask = storage.ref('user/'+userid+'/img').child(FilePath).put(blob);

    uploadTask.on('state_changed', function(snapshot){
      let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      console.log('Upload is '+progress+'% complete');
      that.setState({
        progress:progress,
      });
    }, function(error) {
      console.log('error with upload - '+error);
    }, function(){
      //complete
      that.setState({progress:100});
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
        console.log(downloadURL);
        that.processUpload(downloadURL);
      });

    });*/
  };

  completeUploadBlob = (blob, FilePath) => {
    let that = this;
    let userid = f.auth().currentUser.uid;
    let imageId = this.state.imageId;

    let uploadTask = storage
      .ref("user/" + userid + "/img")
      .child(FilePath)
      .put(blob);

    uploadTask.on(
      "state_changed",
      snapshot => {
        let progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log("Upload is " + progress + "% completed.");
        that.setState({
          progress: progress
        });
      },
      err => {
        console.log("error with upload - " + err);
      },

      // now upload is completed,
      () => {
        that.setState({
          progress: 100
        });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.processUpload(downloadURL);
        });
      }
    );
    // const snapshot = await ref.put(blob).on("state_changed", snapshot => {
    // console.log("Progress", snapshot.bytesTransferred, snapshot.totalBytes);
    // console.log(snapshot.ref.getDownloadURL());
    // });
  };

  processUpload = imageUrl => {
    // set needed info of user

    //Set needed info
    let imageId = this.state.imageId;
    let userId = f.auth().currentUser.uid;
    let dateTime = Date.now();
    let caption = this.state.caption;
    let timestamp = Math.floor(dateTime / 1000);

    // we have uploaded img to storage, but we have to link that url with realtime-db
    // photo-json = author, caption, posted-timestamp, urlofimg

    let photoObj = {
      author: userId,
      caption: caption,
      posted: timestamp,
      url: imageUrl
    };

    // now, add info to realtime-db in two locations. as feed & profile
    // add data to photo-obj and user-object

    console.log("f.auth().currentUser.uid ", f.auth().currentUser.uid);
    // first to add photo to main feed of photos    database.ref("/photos/" + imageId).set(photoObj);

    // add photosobj to user-json as well.
    database.ref("/users/" + userId + "/photos/" + imageId).set(photoObj);

    alert("Image Uploaded Successfully.");
    // after uploading photo, reset photo-attribute/ states

    this.setState({
      uploading: false,
      imageSelected: false,
      caption: "",
      uri: ""
    });
  };

  componentDidMount = () => {
    // set variable that=this, for binding

    let that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        // Loggedin
        that.setState({
          loggedin: true
        });
      } else {
        // Not-Loggedin
        that.setState({
          loggedin: false
        });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loggedin == true ? (
          // true-> you are loggedin
          <View style={{ flex: 1 }}>
            {/*  check if image is selected or not? */}
            {this.state.imageSelected == true ? (
              // yes img selected then choose caption & upload it now.
              <View style={{ flex: 1 }}>
                <View style={styles.header}>
                  <Text> Upload </Text>
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ marginTop: 5 }}>Choose Caption:</Text>
                  <TextInput
                    editable={true}
                    placeholder={"Enter your caption..."}
                    maxLength={100}
                    multiline={true}
                    numberOfLine={4}
                    onChangeText={text => this.setState({ caption: text })}
                    style={styles.textInput}
                  />
                  {/* After chossing caption, publish photo */}

                  <TouchableOpacity
                    onPress={() => this.uploadPublish()}
                    style={styles.publishBtn}
                  >
                    <Text style={styles.textOnBtn}>Post on Wall</Text>
                  </TouchableOpacity>

                  {this.state.uploading == true ? (
                    <View style={{ marginTop: 10 }}>
                      <Text>{this.state.progress}%</Text>
                      {/* check again if progress is not 100%, then display spinning logo
                          as activity indicator  */}

                      {this.state.progress != 100 ? (
                        <ActivityIndicator size="small" color="blue" />
                      ) : (
                        // progress is 100%, show done

                        <Text>Upload Completed.</Text>
                      )}
                    </View>
                  ) : (
                    // uploading is false then show empty view

                    <View />
                  )}

                  <Image
                    source={{ uri: this.state.uri }}
                    style={styles.previewImg}
                  />
                </View>
              </View>
            ) : (
              // no, img is not selected yet, show menu to upload

              <View style={styles.container}>
                <Text style={styles.uploadText}>Upload</Text>
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => this.findNewImage()}
                >
                  <Text style={styles.textOnBtn}>Select Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          // if user is not authenticated
          <UserAuth message={"Please Login to Upload Photo"} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  uploadText: {
    fontSize: 28,
    paddingBottom: 15
  },
  uploadBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    borderRadius: 5
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
  textInput: {
    marginVertical: 10,
    height: 100,
    padding: 5,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: "white"
  },
  publishBtn: {
    alignSelf: "center",
    width: 180,
    marginHorizontal: "auto",
    backgroundColor: "purple",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  textOnBtn: {
    textAlign: "center",
    color: "white"
  },
  previewImg: {
    marginTop: 10,
    resizeMode: "cover",
    width: "100%",
    height: 300
  }
});
export default upload;
