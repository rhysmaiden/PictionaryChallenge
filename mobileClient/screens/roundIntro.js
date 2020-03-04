import React, { useEffect, useState } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import Button from "../components/primaryButton.js";

export default function roundIntro({ navigation, roundInfo }) {
  const [matchupAnimation] = useState(new Animated.Value(1000));

  return (
    <View style={styles.background}>
      <Text>roundIntro</Text>
      {roundInfo.partners &&
        roundInfo.partners.map(partnership => (
          <View style={styles.matchup}>
            <View style={styles.user}>
              <Text style={styles.userText}>{partnership.artist.username}</Text>
            </View>
            <View style={styles.user}>
              <Text style={styles.userText}>
                {partnership.guesser.username}
              </Text>
            </View>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgb(27, 29, 33)",
    alignItems: "center",
    justifyContent: "center"
  },
  matchup: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    flexWrap: "wrap"
  },
  user: {
    backgroundColor: "black",
    color: "white",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    borderRadius: 100,
    marginBottom: 10
  },
  userText: {
    color: "white",
    fontSize: 20
  }
});
