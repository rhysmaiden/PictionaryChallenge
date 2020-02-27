import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import io from "socket.io-client";
import Constants from "expo-constants";
import Button from "../components/primaryButton.js";
import Guesser from "./guesser.js";
import Artist from "./artist.js";
import RoundIntro from "./roundIntro.js";

const { manifest } = Constants;

let socket;

export default function Game({ route, navigation }) {
  const [activeScreen, setActiveScreen] = useState(0);
  const [artistWord, setArtistWord] = useState("");
  const [guesserChoices, setGuesserChoices] = useState([]);

  /* ****************************
            SOCKET
  *****************************/
  useEffect(() => {
    socket = navigation.getParam("socket");
    socket.on("changeScreen", screenNumber => {
      console.log("Recieved change Screen request");
      setActiveScreen(screenNumber);
    });

    socket.on("guesserInformation", words => {
      setGuesserChoices(words);
    });

    socket.on("artistInformation", word => {
      setArtistWord(word);
    });
  }, []);

  function selectScreen(index) {
    switch (index) {
      case 0:
        return <RoundIntro />;
      case 1:
        return <Artist socket={socket} word={artistWord} />;
      case 2:
        return <Guesser socket={socket} choices={guesserChoices} />;
      case 3:
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
