import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import io from "socket.io-client";
import Constants from "expo-constants";
import Button from "../components/primaryButton.js";
import Guesser from "./guesser.js";

const { manifest } = Constants;

let socket;

export default function Game({ route, navigation }) {
  const [activeScreen, setActiveScreen] = useState(0);

  /* ****************************
            SOCKET
  *****************************/
  useEffect(() => {}, [
    socket.on("changeScreen", screenNumber => {
        setActiveScreen(screenNumber);
      });
  ]);

  function selectScreen(index) {
    switch (index) {
      case "0":
        return <Guesser />;
      case "1":
        return <Guesser />;
      case "2":
        return <Guesser />;
      case "3":
        return <Guesser />;
      default:
        return <Guesser />;
    }
  }

  return (
    <View style={{ flex: 1, marginTop: 50, alignItems: "center" }}>
      {selectScreen(activeScreen)}
    </View>
  );
}
