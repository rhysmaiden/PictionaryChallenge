import Expo from "expo";
import * as ExpoPixi from "expo-pixi";
import React, { Component, useEffect } from "react";
import ImgToBase64 from "react-native-image-base64";
import Button from "../components/primaryButton.js";
import CountdownCircle from "react-native-countdown-circle";
import {
  Image,
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
    options: [],
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
    selectedAnswer: "",
    appState: AppState.currentState
  };

  handleAppStateChangeAsync = nextAppState => {
    console.log("REFRESH");
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

    let socket = this.props.socket;

    socket.on("picture", picture => {
      console.log("PITCURE RECIEVED");
      var lines = [];

      for (let x of picture) {
        var points = [];
        for (let pt of x) {
          points.push({ x: pt.x, y: pt.y });
        }

        var line = { points: points, color: 0xff00ff, alpha: 1, width: 10 };
        lines.push(line);
      }

      this.setState({
        lines: lines
      });
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChangeAsync);
  }

  onChangeAsync = async () => {};

  onReady = async () => {
    console.log("ready!");
  };

  selectOption(answer) {
    //let socket = this.props.socket;
    console.log("Guesser - SENT GUESS");
    // socket.emit("answer", { answer }, callback => {
    //   console.log("Sent guess");
    // });

    //this.setState({ selectedAnswerere: "cheese" });
  }

  componentDidUpdate(oldProps) {
    // if (this.props.answer === this.state.selectedAnswer) {
    //   console.log("CORRECT");
    //   console.log(this.props.answer, this.state.selectedAnswer);
    // } else {
    //   console.log("Incorrect");
    //   console.log(this.props.answer, this.state.selectedAnswer);
    // }
  }

  //TODO: Remove ability for guesser to draw
  render() {
    return (
      <View style={styles.container}>
        {/* <Text>{this.props.evaluation && this.props.evaluation.correct}</Text> */}
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={{ fontSize: 30 }}>Round 1</Text>
            {/* <Text style={styles.word}>{this.props.word}</Text> */}
            <Text style={styles.word}>
              {/* {this.state.correct != null && this.state.answer} */}
            </Text>
          </View>
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
          </View>
        </View>
        {/* <View>
          {this.props.choices.map(option => (
            <Button
              text={option}
              onPress={() => {
                this.selectOption(option);
              }}
              // color={
              //   option === this.state.selectedAnswer
              //     ? option === this.props.answer
              //       ? "green"
              //       : "red"
              //     : "rgb(52,186,241)"
              // }
            />
          ))}
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    borderWidth: 5,
    width: "100%"
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
  options: {
    padding: 10
  }
});
