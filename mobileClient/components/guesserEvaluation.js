import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../components/primaryButton.js";
import CountdownCircle from "react-native-countdown-circle";
import { Stopwatch, Timer } from "react-native-stopwatch-timer";

const guesserEvaluation = ({ choices, socket }) => {
  const [selected, setSelected] = useState("");
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(0);
  const timer = useRef();
  const selectOption = op => {
    if (answer === "") {
      setTime(timer.current.state.elapsed / 1000);
      console.log("GUESSER - SEND SELECTION");
      socket.emit(
        "answer",
        { answer: op, time: timer.current.state.elapsed },
        callback => {
          console.log("Sent guess");
        }
      );

      setSelected(op);
    }
  };

  useEffect(() => {
    socket.on("evaluation", answer => {
      console.log("GUESSER ANSWER:", answer);
      setAnswer(answer);
    });
  }, []);
  return (
    <View
      style={{
        paddingTop: 20,
        paddingLeft: 0,
        flex: 1,
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20
      }}
    >
      <View>
        {choices.map(option => (
          <Button
            text={option}
            onPress={() => {
              selectOption(option);
            }}
            color={
              option === selected
                ? option === answer
                  ? "green"
                  : "red"
                : "rgb(52,186,241)"
            }
          />
        ))}
      </View>
      <Stopwatch msecs start={true} ref={timer} options={options} />
      <Text>{time && time}</Text>
    </View>
  );
};

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

export default guesserEvaluation;
