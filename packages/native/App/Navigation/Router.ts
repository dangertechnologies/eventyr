import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  createDrawerNavigator
} from "react-navigation";

import { compose } from "recompose";
import { withUser } from "@eventyr/core/Providers";

import AchievementsScreen from "./Routes/AchievementsTab";
import CreateScreen from "./Routes/CreateTab";
import MapScreen from "./Routes/MapTab";

// These will be added into the tab bar navigation, but hidden,
// and we route to them from the NavigationDrawer

import LoginScreen from "../Screens/Login/LoginScreen";
import AuthorizationScreen from "../Screens/Login/AuthorizationScreen";

import TabBarOptions from "./TabBarOptions";
import NavigationDrawer from "./NavigationDrawer";

const Tabs = {
  MapScreen,
  AchievementsScreen,
  CreateScreen
};

const loggedInNavigation = createDrawerNavigator(
  {
    Home: {
      screen: createBottomTabNavigator(Tabs, TabBarOptions),
      navigationOptions: { header: null }
    }
  },
  {
    initialRouteName: "Home",
    contentComponent: NavigationDrawer,

    // @ts-ignore
    drawerType: "push-screen",
    navigationOptions: {
      header: null
    }
  }
);

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
