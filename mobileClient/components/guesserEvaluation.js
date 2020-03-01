import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../components/primaryButton.js";
import CountdownCircle from "react-native-countdown-circle";

const guesserEvaluation = ({ choices, socket }) => {
  const [selected, setSelected] = useState("");
  const [answer, setAnswer] = useState("");
  const selectOption = op => {
    if (answer === "") {
      console.log("GUESSER - SEND SELECTION");
      socket.emit("answer", op, callback => {
        console.log("Sent guess");
      });

      setSelected(op);
    }
  };

  useEffect(() => {
    socket.on(
      "evaluation",
      answer => {
        console.log("GUESSER ANSWER:", answer);

        setAnswer(answer);
      },
      []
    );
  });
  return (
    <View
      style={{
        paddingTop: 40,
        paddingLeft: 0
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
      <CountdownCircle
        seconds={30}
        radius={30}
        borderWidth={8}
        color="#ff003f"
        bgColor="#fff"
        textStyle={{ fontSize: 20 }}
        onTimeElapsed={() => console.log("Elapsed!")}
      />
    </View>
  );
};

export default guesserEvaluation;
