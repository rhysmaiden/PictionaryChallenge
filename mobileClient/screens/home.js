import React from "react";
import { View } from "react-native";
import Button from "../components/primaryButton.js";

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        text="Lobby"
        onPress={() => {
          console.log("X");
          navigation.navigate("Lobby");
        }}
      />
    </View>
  );
}
