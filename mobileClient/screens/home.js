import React from "react";
import { View } from "react-native";
import Button from "../components/primaryButton.js";

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        text="Rhys"
        onPress={() => {
          console.log("X");
          navigation.navigate("Lobby", { username: "Rhys" });
        }}
      />
      <Button
        text="Mon"
        onPress={() => {
          console.log("X");
          navigation.navigate("Lobby", { username: "Mon" });
        }}
      />
      <Button
        text="Ash"
        onPress={() => {
          console.log("X");
          navigation.navigate("Lobby", { username: "Ash" });
        }}
      />
      <Button
        text="John"
        onPress={() => {
          console.log("X");
          navigation.navigate("Lobby", { username: "John" });
        }}
      />
      <Button
        text="Lisa"
        onPress={() => {
          console.log("X");
          navigation.navigate("Lobby", { username: "Lisa" });
        }}
      />
    </View>
  );
}
