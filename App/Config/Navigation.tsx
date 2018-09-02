import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  TabScene
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { compose } from "recompose";
// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import AchievementsScreen from "../Screens/Achievements";
import AchievementsCreateScreen from "../Screens/AchievementsCreate";

import { withUser } from "../Providers/UserProvider";

const loggedInNavigation = createBottomTabNavigator(
  {
    AchievementsScreen: {
      screen: createStackNavigator(
        {
          AchievementScreen: {
            screen: AchievementsScreen
          },

          CreateScreen: {
            screen: AchievementsCreateScreen
          }
        },
        { initialRouteName: "CreateScreen" }
      ),
      navigationOptions: {
        title: AchievementsScreen.navigationOptions.title
      }
    }
  },
  // @ts-ignore
  {
    // Default config for all screens
    tabBarPosition: "bottom",
    initialRouteName: "AchievementsScreen",
    swipeEnabled: true,
    lazy: true,
    paths: {
      AchievementsScreen: "AchievementsScreen"
    },

    tabBarOptions: {
      showLabel: true
    },
    order: ["AchievementsScreen"],

    navigationOptions: ({ navigation }) => ({
      headerMode: "float",
      tabBarIcon: ({ focused, tintColor }: TabScene) => {
        const { routeName } = navigation.state;

        const color = focused
          ? EStyleSheet.value("$colorSecondary")
          : EStyleSheet.value("$colorDisabled");

        switch (routeName) {
          case "AchievementsScreen":
            return <Icon name="trending-up" color={color} size={25} />;
          default:
            return <Icon name="settings" color={color} size={25} />;
        }
      }
    })
  }
);

const LoggedOutNavigation = createStackNavigator(
  {
    // In case navigation is cached, point everything to LoginScreen
    AchievementsScreen: { screen: AchievementsScreen }
  },
  {
    initialRouteName: "AchievementsScreen"
  }
);

const Navigation = createSwitchNavigator(
  {
    LoggedIn: {
      screen: loggedInNavigation
    },
    LoggedOut: {
      screen: loggedInNavigation
    }
  },
  {
    initialRouteName: "LoggedIn"
  }
);

export default compose(withUser)(Navigation);
