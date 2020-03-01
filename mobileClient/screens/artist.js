import Expo from "expo";
import * as ExpoPixi from "expo-pixi";
import React, { Component, useEffect } from "react";
import CountdownCircle from "react-native-countdown-circle";
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
    answer: null,
    correct: null,
    appState: AppState.currentState
  };

  handleAppStateChangeAsync = nextAppState => {
    console.log("Handle change");
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
    //TODO: Make the socket apart of this components state

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

  componentDidUpdate(oldProps) {
    // if (this.state.correct === null) {
    //   console.log("Update state");
    //   this.setState({
    //     correct: this.props.evaluation.correct,
    //     answer: this.props.evaluation.answer
    //   });
    // } else {
    //   console.log("Didn't update", this.state.correct);
    // }
  }

  onReady = async () => {
    console.log("ready!");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <CountdownCircle
            seconds={30}
            radius={30}
            borderWidth={8}
            color="#ff003f"
            bgColor="#fff"
            textStyle={{ fontSize: 20 }}
            onTimeElapsed={() => console.log("Elapsed!")}
          />
          <Text>Round 1</Text>

          <Text style={styles.word}>{this.props.word}</Text>
        </View>

        {/* <Text>{this.state.correct != null && this.state.answer}</Text> */}
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
            {/* <View style={styles.label}>
              <Text>Artboard</Text>
            </View> */}
          </View>
        </View>
        <View style={styles.answer}>
          <Text>
            {this.props.answer && "Partner answered: " + this.props.answer}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%"
  },
  sketch: {
    flex: 1
  },
  sketchContainer: {
    height: 300,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 5
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
  },
  word: {
    fontSize: 30
  },
  header: {
    alignItems: "center",
    padding: 15
  },
  answer: {
    alignItems: "center",
    justifyContent: "center",

    flex: 1
  }
});
