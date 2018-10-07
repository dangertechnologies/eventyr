import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  TabScene
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import { compose } from "recompose";

import AchievementsTab from "./Routes/AchievementsTab";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";
import color from "color";

import ProfileScreen from "../Screens/Profile/Profile";
import LoginScreen from "../Screens/Login/LoginScreen";
import AuthorizationScreen from "../Screens/Login/AuthorizationScreen";
import AchievementCreateScreen from "../Screens/Achievements/Create";

import CreateScreenIcon from "./CreateButton";

import { withUser } from "../Providers/UserProvider";
import headerStyles from "./HeaderStyle";

const loggedInNavigation = createBottomTabNavigator(
  {
    AchievementsScreen: {
      screen: AchievementsTab
    },

    CreateScreen: createStackNavigator({
      CreateScreen: {
        screen: AchievementCreateScreen,
        navigationOptions: {
          ...headerStyles,
          headerTintColor: "#FFFFFF",
          title: "Create"
        }
      }
    }),

    ProfileScreen: {
      screen: ProfileScreen
    }
  },
  // @ts-ignore
  {
    // Default config for all screens
    tabBarPosition: "bottom",
    initialRouteName: "AchievementsScreen",
    swipeEnabled: true,
    lazy: true,

    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "#5cb85c"
      }
    },
    order: ["AchievementsScreen", "CreateScreen", "ProfileScreen"],

    navigationOptions: ({ navigation }) => ({
      headerMode: "float",

      tabBarIcon: ({ focused, tintColor }: TabScene) => {
        const { routeName } = navigation.state;

        const tint = focused
          ? EStyleSheet.value("$colorSecondary")
          : color(EStyleSheet.value("$colorSecondary")).fade(0.5);

        switch (routeName) {
          case "AchievementsScreen":
            return <Icon name="map" color={tint as string} size={25} />;
          case "CreateScreen":
            return <CreateScreenIcon />;
          case "ProfileScreen":
            return (
              <Ionicon name="ios-person" color={tint as string} size={25} />
            );
          default:
            return <Icon name="map" color={tint as string} size={25} />;
        }
      }
    })
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
