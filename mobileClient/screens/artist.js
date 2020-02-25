import Expo from "expo";
import * as ExpoPixi from "expo-pixi";
import React, { Component, useEffect } from "react";
// import RNFetchBlob from "react-native-fetch-blob";
// import RNFS from "react-native-fs";
import ImgToBase64 from "react-native-image-base64";
import {
  Image,
  Button,
  Platform,
  AppState,
  StyleSheet,
  Text,
  View
} from "react-native";

const isAndroid = Platform.OS === "android";
function uuidv4() {
  //https://stackoverflow.com/a/2117523/4047926
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export default class artist extends Component {
  state = {
    image: null,
    strokeColor: Math.random() * 0xffffff,
    strokeWidth: Math.random() * 30 + 10,
    lines: [
      {
        points: [
          { x: 300, y: 300 },
          { x: 600, y: 300 },
          { x: 450, y: 600 },
          { x: 300, y: 300 }
        ],
        color: 0xff00ff,
        alpha: 1,
        width: 10
      }
    ],
    appState: AppState.currentState
  };

  handleAppStateChangeAsync = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (isAndroid && this.sketch) {
        this.setState({
          appState: nextAppState,
          id: uuidv4(),
          lines: this.sketch.lines
        });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChangeAsync);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChangeAsync);
  }

  onChangeAsync = async () => {
    // const { uri } = await this.sketch.takeSnapshotAsync({ result: "base64" });

    // const options = {
    //   format: "png", /// PNG because the view has a clear background
    //   quality: 0.1, /// Low quality works because it's just a line
    //   result: "base64"
    // };

    // for (let line of this.sketch.lines) {
    //   console.log(line.points);
    // }

    //console.log(Expo.takeSnapshotAsync(this.sketch, options));

    // console.log(await this.sketch.takeSnapshotAsync({ result: "base64" }));

    //TODO: Make the socket apart of this components state
    let socket = this.props.navigation.getParam("socket");
    let username = this.props.navigation.getParam("username");

    const options = {
      format: "png", /// PNG because the view has a clear background
      quality: 0.1, /// Low quality works because it's just a line
      result: "base64"
    };

    var lines = [];

    for (let line of this.sketch.lines) {
      var points = [];

      for (let point of line.points) {
        console.log("X");
        points.push({ x: point.x, y: point.y });
      }

      lines.push(points);
    }

    console.log(lines.length);

    // console.log(Object.keys(this.sketch.points[0].x));
    // console.log(this.sketch.points[0].x);
    /// Using 'Expo.takeSnapShotAsync', and our view 'this.sketch' we can get a uri of the image
    //const uri = await Expo.takeSnapshotAsync(this.sketch, options);

    // const lines = this.sketch.lines;

    // console.log(JSON.stringify(lines));

    socket.emit("picture", { picture: lines, username: username }, callback => {
      console.log("Sent picture");
    });

    // console.log(uri);
    // console.log(typeof uri);

    // RNFetchBlob.fs.readFile(await localUri, "base64").then(data => {
    //   console.log(data);
    // });

    // const fileReader = new FileReader();
    // fileReader.onload = fileLoadedEvent => {
    //   const base64Image = fileLoadedEvent.target.result;
    // };
    // const result = fileReader.readAsDataURL(uri);

    // console.log(result);

    // RNFS.readFile(uri, "base64").then(res => {
    //   console.log(res);
    // });

    // ImgToBase64.getBase64String(localUri).then(img_base64 => {
    //   console.log(img_base64);
    //   socket.emit(
    //     "picture",
    //     { picture: img_base64, username: username },
    //     callback => {
    //       console.log("Sent picture");
    //     }
    //   );
    // });

    this.setState({
      image: { uri },
      strokeWidth: Math.random() * 30 + 10,
      strokeColor: Math.random() * 0xffffff
    });
  };

  onReady = async () => {
    console.log("ready!");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <View style={styles.sketchContainer}>
            <ExpoPixi.Sketch
              ref={ref => (this.sketch = ref)}
              style={styles.sketch}
              strokeColor={0x000000}
              strokeWidth={10}
              strokeAlpha={1}
              onChange={this.onChangeAsync}
              onReady={this.onReady}
              initialLines={this.state.lines}
            />
            <View style={styles.label}>
              <Text>Canvas - draw here</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.label}>
              <Text>Snapshot</Text>
            </View>
            <Image style={styles.image} source={this.state.image} />
          </View>
        </View>
        <Button
          color={"blue"}
          title="undo"
          style={styles.button}
          onPress={() => {
            this.sketch.undo();
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
  sketch: {
    flex: 1
  },
  sketchContainer: {
    height: "50%"
  },
  image: {
    flex: 1
  },
  imageContainer: {
    height: "50%",
    borderTopWidth: 4,
    borderTopColor: "#E44262"
  },
  label: {
    width: "100%",
    padding: 5,
    alignItems: "center"
  },
  button: {
    // position: 'absolute',
    // bottom: 8,
    // left: 8,
    zIndex: 1,
    padding: 12,
    minWidth: 56,
    minHeight: 48
  }
});
