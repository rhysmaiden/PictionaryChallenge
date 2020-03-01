import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../components/primaryButton.js";

const guesserEvaluation = ({ answer, choices, socket }) => {
  const selectOption = answer => {
    socket.emit("answer", { answer }, callback => {
      console.log("Sent guess");
    });
  };
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
          />
        ))}
      </View>
    </View>
  );
};

export default guesserEvaluation;
