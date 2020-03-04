import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../components/primaryButton.js";

export default function roundResults({ navigation, roundInfo }) {
  const [orderedResults, setOrder] = useState([]);

  useEffect(() => {
    let ordered = roundInfo.partners;
    ordered.sort(function(a, b) {
      return a.time - b.time;
    });

    setOrder(ordered);
  }, roundInfo);

  return (
    <View style={styles.background}>
      <Text style={styles.userText}>Round x Results</Text>
      {roundInfo.partners &&
        orderedResults.map((partnership, index) => (
          <View style={styles.singleResult}>
            <View style={styles.matchup}>
              <View style={styles.number}>
                <Text style={styles.userText}>1</Text>
              </View>

              <Text style={styles.userText}>
                {partnership.artist.username} and {partnership.guesser.username}
              </Text>
              <Text style={styles.pointsText}>2pts</Text>
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <View
                style={[
                  styles.timeBar,
                  { width: ((partnership.time / 30000) * 100).toString() + "%" }
                ]}
              ></View>
              <Text style={styles.timeText}>
                {(partnership.time / 1000).toFixed(1)} secs
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

    padding: 10
  },
  matchup: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10
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
    fontSize: 20,
    marginRight: 10
  },
  timeText: {
    color: "white",
    fontSize: 16
  },
  pointsText: {
    color: "green",
    fontSize: 16
  },
  number: {
    width: 50,
    height: 50,
    backgroundColor: "black",
    borderRadius: 100,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },
  singleResult: {
    width: "100%",
    marginBottom: 10
  },
  timeBar: {
    backgroundColor: "green",
    height: 20,
    marginRight: 10
  }
});
