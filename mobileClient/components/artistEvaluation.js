import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const artistEvaluation = ({ answer }) => {
  return (
    <View
      style={{
        paddingTop: 40,
        paddingLeft: 0
      }}
    >
      <Text>Partner answered: {answer && answer}</Text>
    </View>
  );
};

export default artistEvaluation;
