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
    socket.on(
      "evaluation",
      answer => {
        console.log("ARTIST ANSWER:", answer);
        console.log();
        setTime(timer.current.state.elapsed);
        setAnswer(answer);
      },
      []
    );
  });

  const getTime = msecs => {
    if (time != undefined) {
      //console.log(timer);
    }
  };
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
      <Stopwatch
        msecs
        start={true}
        getMsecs={msecs => getTime(msecs)}
        ref={timer}
      />
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
