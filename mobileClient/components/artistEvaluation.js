import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const artistEvaluation = ({ socket, word }) => {
  const [answer, setAnswer] = useState("");
  useEffect(() => {
    socket.on(
      "evaluation",
      answer => {
        console.log("ARTIST ANSWER:", answer);
        setAnswer(answer);
      },
      []
    );
  });
  return (
    <View
      style={{
        paddingTop: 40,
        paddingLeft: 0,
        backgroundColor: "white",
        flex: 1,
        width: "100%",
        alignItems: "center"
      }}
    >
      <Text>Partner answered:</Text>
      {/* <Text>{answer && answer}</Text> */}
      <Text
        style={[styles.answer, { color: answer === word ? "green" : "red" }]}
      >
        {answer && answer}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  partnerAnswered: {
    fontSize: 15
  },
  answer: {
    fontSize: 20
  }
});

export default artistEvaluation;
