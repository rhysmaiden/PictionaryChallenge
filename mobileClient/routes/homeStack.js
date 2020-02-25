import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import Lobby from "../screens/lobby.js";
import Home from "../screens/home.js";
import Artist from "../screens/artist.js";

const screens = {
  Home: {
    screen: Home
  },
  Lobby: {
    screen: Lobby
  },
  Artist: {
    screen: Artist
  }
};

const HomeStack = createStackNavigator(screens, {
  mode: "modal"
});

export default createAppContainer(HomeStack);
