import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import Lobby from "../screens/lobby.js";
import Home from "../screens/home.js";
import Artist from "../screens/artist.js";
import Guesser from "../screens/guesser.js";
import Game from "../screens/game.js";

const screens = {
  Home: {
    screen: Home
  },
  Lobby: {
    screen: Lobby
  },
  Artist: {
    screen: Artist
  },
  Guesser: {
    screen: Guesser
  },
  Game: {
    screen: Game
  }
};

const HomeStack = createStackNavigator(screens, {
  mode: "card"
});

export default createAppContainer(HomeStack);
