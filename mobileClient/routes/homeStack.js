import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import Lobby from "../screens/lobby.js";
import Home from "../screens/home.js";

const screens = {
  Home: {
    screen: Home
  },
  Lobby: {
    screen: Lobby
  }
};

const HomeStack = createStackNavigator(screens, {
  mode: "modal"
});

export default createAppContainer(HomeStack);
