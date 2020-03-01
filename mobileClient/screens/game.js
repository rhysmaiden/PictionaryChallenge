import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import io from "socket.io-client";
import Constants from "expo-constants";
import Button from "../components/primaryButton.js";
import Guesser from "./guesser.js";
import Artist from "./artist.js";
import RoundIntro from "./roundIntro.js";
import ArtistEvaluation from "../components/artistEvaluation.js";
import GuesserEvaluation from "../components/guesserEvaluation.js";

const { manifest } = Constants;

let socket;

export default function Game({ route, navigation }) {
  const [activeScreen, setActiveScreen] = useState(0);
  const [artistWord, setArtistWord] = useState("");
  const [guesserChoices, setGuesserChoices] = useState([]);
  const [answer, setAnswer] = useState(null);

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

    socket.on("evaluation", answer => {
      console.log("RECIEVED", typeof correct, typeof answer);
      setAnswer(answer);
    });
  }, []);

  function selectScreen(index) {
    switch (index) {
      case 0:
        return <RoundIntro />;
      case 1:
        return (
          <React.Fragment>
            <Artist socket={socket} word={artistWord} answer={answer} />
            {/* {answer && <ArtistEvaluation answer={answer} />} */}
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <Guesser socket={socket} choices={guesserChoices} answer={answer} />
            {/* <GuesserEvaluation
              choices={guesserChoices}
              socket={socket}
              // evaluation={evaluation}
            /> */}
          </React.Fragment>
        );
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
