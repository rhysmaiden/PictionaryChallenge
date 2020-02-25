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
          { x: 477.99998474121094, y: 312.99998474121094 },
          { x: 477.39998016357424, y: 316.89998016357424 },
          { x: 476.9799769592285, y: 329.5299769592285 },
          { x: 476.68597471618654, y: 344.97098387145996 },
          { x: 476.48017314605715, y: 363.5796795547485 },
          { x: 476.33611204696655, y: 385.005775688324 },
          { x: 477.4352784328766, y: 408.4040384041901 },
          { x: 479.4046903253769, y: 432.2828177276596 },
          { x: 482.28328322776383, y: 456.49797240936175 },
          { x: 486.09829825943467, y: 478.84858068655325 },
          { x: 491.46880878160425, y: 500.19400190295056 },
          { x: 498.828166147123, y: 520.5357967544287 },
          { x: 509.67971172534936, y: 540.1750531504633 },
          { x: 523.5757936301078, y: 558.1225372053243 },
          { x: 539.903046385802, y: 574.285776043727 },
          { x: 556.7321233147879, y: 588.0000340753354 },
          { x: 574.8124771650781, y: 599.4000146974613 },
          { x: 593.468729437918, y: 608.2800011329495 },
          { x: 612.2281014512691, y: 615.0959962154279 },
          { x: 632.5596618606149, y: 620.1671881955261 },
          { x: 653.3917633024305, y: 623.7170225815948 },
          { x: 674.2742343117013, y: 625.0019112294797 },
          { x: 694.5919594405542, y: 621.7013287053624 },
          { x: 714.814371608388, y: 613.690925516117 },
          { x: 735.2700601258716, y: 599.0836432836452 },
          { x: 754.3890375104734, y: 579.2585411432782 },
          { x: 771.9723262573314, y: 553.9809788002947 },
          { x: 787.5806192248585, y: 524.5866851602062 },
          { x: 800.3064243021275, y: 489.3106704568709 },
          { x: 810.1144878562159, y: 454.11746931980963 },
          { x: 816.9801323440777, y: 413.8822193685933 },
          { x: 828.9999847412109, y: 267 }
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

      this.setState({ lines: lines });

      //   console.log("#####22222######");
      //   console.log(test_obj);

      console.log("#####33333######");
      console.log(this.state.lines);
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
