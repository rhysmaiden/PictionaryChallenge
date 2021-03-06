import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import io from "socket.io-client";
import Constants from "expo-constants";
import Button from "../components/primaryButton.js";
import Guesser from "./guesser.js";
import Artist from "./artist.js";
import RoundIntro from "./roundIntro.js";
import RoundResults from "./roundResults.js";
import ArtistEvaluation from "../components/artistEvaluation.js";
import GuesserEvaluation from "../components/guesserEvaluation.js";

const { manifest } = Constants;

let socket;

export default function Game({ route, navigation }) {
  const [activeScreen, setActiveScreen] = useState(4);
  const [artistWord, setArtistWord] = useState("");
  const [guesserChoices, setGuesserChoices] = useState([]);
  const [answer, setAnswer] = useState("");
  const [roundInfo, setRoundInfo] = useState({});

  /* ****************************
            SOCKET
  *****************************/
  useEffect(() => {
    socket = navigation.getParam("socket");
    socket.on("changeScreen", screenNumber => {
      console.log("Recieved change Screen request");
      setActiveScreen(screenNumber);

      // if (screenNumber === 3) {
      //   setTimeout(function() {
      //     setActiveScreen(5);
      //   }, 3000);
      // }
    });

    socket.on("guesserInformation", words => {
      setGuesserChoices(words);
    });

    socket.on("artistInformation", word => {
      setArtistWord(word);
    });

    socket.on("roundInfo", roundInfo => {
      console.log("RECIEVED ROUND INFO");
      setRoundInfo(roundInfo);
    });

    socket.on("results", results => {
      console.log("Recieved results");
      setRoundInfo(results);
    });
  }, []);

  function selectScreen(index) {
    switch (index) {
      case 0:
        return <RoundIntro roundInfo={roundInfo} />;
      case 1:
        return (
          <React.Fragment>
            <Artist socket={socket} word={artistWord} />
            <ArtistEvaluation socket={socket} word={artistWord} />
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <Guesser socket={socket} />
            <GuesserEvaluation
              choices={guesserChoices}
              socket={socket}

              // evaluation={evaluation}
            />
          </React.Fragment>
        );
      case 3:
        return <RoundResults roundInfo={roundInfo} />;
      case 4:
        return <Text>GAME IS ABOUT TO START</Text>;
      case 5:
        return <Text>Total Results</Text>;
      default:
        return <Guesser />;
    }
  }

  return (
    <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
      {selectScreen(activeScreen)}
    </View>
  );
}
