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
        points: [],
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
    let socket = this.props.socket;
    socket.on("evaluation", ({ correct, answer }) => {
      console.log("Artist recieved evaluation");
      // console.log("Artist recieved evaluation", correct, answer);
      this.setState({
        answer: answer
      });
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChangeAsync);
  }

  onChangeAsync = async () => {
    //TODO: Make the socket apart of this components state

    // let username = this.props.navigation.getParam("username");

    var lines = [];

    for (let line of this.sketch.lines) {
      var points = [];

      for (let point of line.points) {
        //console.log(point);
        points.push({ x: point.x, y: point.y });
      }

      lines.push(points);
    }

    let socket = this.props.socket;

    socket.emit("picture", { picture: lines, username: "X" }, callback => {
      console.log("Sent picture");
    });
  };

  onReady = async () => {
    console.log("ready!");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Artist</Text>
        <Text>{this.props.word}</Text>
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
        <Text>{this.state.answer && this.state.answer}</Text>
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
    height: "50%",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 10
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
