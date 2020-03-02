import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";

const artistEvaluation = ({ socket, word }) => {
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(0);
  const timer = useRef();

  useEffect(() => {
    socket.on("evaluation", ({ answer, time }) => {
      console.log("ARTIST ANSWER:", answer);
      console.log();
      setTime(time / 1000);
      setAnswer(answer);
    });
  }, []);

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
      <Stopwatch msecs start={true} ref={timer} options={options} />
      <Text>Partner answered:</Text>
      {/* <Text>{answer && answer}</Text> */}
      <Text
        style={[styles.answer, { color: answer === word ? "green" : "red" }]}
      >
        {answer && answer}
      </Text>
      <Text
        style={[styles.answer, { color: answer === word ? "green" : "red" }]}
      >
        {time && time}
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

const options = {
  container: {
    height: 0
  },
  text: {
    fontSize: 30,
    color: "#FFF",
    marginLeft: 7
  }
};

export default artistEvaluation;
