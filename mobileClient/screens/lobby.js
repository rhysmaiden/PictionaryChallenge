import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import io from "socket.io-client";

let socket;

export default function Lobby({ navigation }) {
  const [users, setUsers] = useState([]);
  const ENDPOINT = "http://127.0.0.1:5000/";
  //const ENDPOINT = "https://nochash-backend.herokuapp.com/";

  /* ****************************
          SETTING STATE
  *****************************/
  useEffect(() => {
    console.log("Attempting ot jojn queue");
    socket = io(ENDPOINT);

    socket.emit("joinQueue", { username: "bob" }, info => {
      console.log("Joined queue");
    });

    return () => {
      console.log("Attempting to disconnect");
      socket.emit("close", callback => {
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
      console.log(newUsers);
      setUsers(newUsers);
    });
  }, [users]);

  return (
    <View style={{ flex: 1, marginTop: 50, alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Queue</Text>
      {users.map(user => (
        <Text>{user.username}</Text>
      ))}
    </View>
  );
}
