import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import io from "socket.io-client";
import Constants from "expo-constants";
import Button from "../components/primaryButton.js";

const { manifest } = Constants;

let socket;

export default function Lobby({ route, navigation }) {
  const username = navigation.getParam("username");
  const [users, setUsers] = useState([]);
  let ENDPOINT =
    typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
      ? manifest.debuggerHost
          .split(`:`)
          .shift()
          .concat(`:5000`)
      : `api.example.com`;
  //const ENDPOINT = "https://nochash-backend.herokuapp.com/";

  /* ****************************
          SETTING STATE
  *****************************/
  useEffect(() => {
    console.log(ENDPOINT);
    console.log("Attempting ot jojn queue");
    socket = io("http://" + ENDPOINT);

    socket.emit("joinQueue", { username: username }, info => {
      console.log("Joined queue");
    });

    return () => {
      console.log("Attempting to disconnect");
      socket.emit("close", { username: username }, callback => {
        console.log("Disconnect");
      });

      socket.off();
    };
  }, [ENDPOINT]);

  /* ****************************
            SOCKET
  *****************************/
  useEffect(() => {
    socket.on("queue", newUsers => {
      setUsers(newUsers);
    });

    socket.on("startGame", game_id => {
      console.log("START GAME");
      console.log(game_id);
    });
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 50, alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Queue</Text>
      {users.map(user => (
        <Text>{user}</Text>
      ))}
      <Button
        text="DRAW"
        onPress={() => {
          navigation.navigate("Artist");
        }}
      />
    </View>
  );
}
