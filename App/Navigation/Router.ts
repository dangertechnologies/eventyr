import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { compose } from "recompose";

import AchievementsScreen from "./Routes/AchievementsTab";
import ProfileScreen from "./Routes/ProfileTab";
import CreateScreen from "./Routes/CreateTab";

import LoginScreen from "../Screens/Login/LoginScreen";
import AuthorizationScreen from "../Screens/Login/AuthorizationScreen";

import TabBarOptions from "./TabBarOptions";

import { withUser } from "../Providers/UserProvider";

const Tabs = {
  AchievementsScreen,
  CreateScreen,
  ProfileScreen
};

const loggedInNavigation = createBottomTabNavigator(Tabs, TabBarOptions);

const loggedOutNavigation = createStackNavigator(
  {
    // In case navigation is cached, point everything to LoginScreen
    LoginScreen: { screen: LoginScreen }
  },
  {
    initialRouteName: "LoginScreen"
  }
);

const Navigation = createSwitchNavigator(
  {
    LoggedIn: {
      screen: loggedInNavigation
    },
    LoggedOut: {
      screen: loggedOutNavigation
    },
    Authorization: {
      screen: AuthorizationScreen
    }
  },
  {
    initialRouteName: "Authorization"
  }
);

export default compose(withUser)(Navigation);
