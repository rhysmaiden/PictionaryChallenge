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

export default class guesser extends Component {
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
        //console.log("UPDATED LINES");
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChangeAsync);

    let socket = this.props.navigation.getParam("socket");

    socket.on("picture", picture => {
      console.log("RECIEVED PICTURE");

      var lines = [];

      for (let x of picture) {
        var points = [];
        for (let pt of x) {
          points.push({ x: pt.x, y: pt.y });
        }

        var line = { points: points, color: 0xff00ff, alpha: 1, width: 10 };
        lines.push(line);
      }

      //   console.log("#####111111######");
      //   console.log({ lines: lines });

      let test_obj = {
        lines: [
          {
            points: [
              { x: 300.2324353, y: 300 },
              { x: 600, y: 300 },
              { x: 450, y: 600 },
              { x: 300, y: 300 }
            ],
            color: 0xff00ff,
            alpha: 1,
            width: 10
          }
        ]
      };

      this.setState({
        lines: lines
      });

      //   this.setState({
      //     lines: [
      //       {
      //         points: [
      //           { x: 918, y: 672.9999847412109 },
      //           { x: 918, y: 672.9999847412109 },
      //           { x: 918, y: 672.9999847412109 },
      //           { x: 915.3, y: 650.7999801635742 },
      //           { x: 912.2099908447266, y: 619.6599815368652 },
      //           { x: 895.9999694824219, y: 483.99998474121094 }
      //         ],
      //         color: 0xff00ff,
      //         alpha: 1,
      //         width: 10
      //       }
      //     ]
      //   });

      //   console.log("#####22222######");
      //   console.log(test_obj);

      //   console.log("#####33333######");
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChangeAsync);
  }

  onChangeAsync = async () => {};

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
