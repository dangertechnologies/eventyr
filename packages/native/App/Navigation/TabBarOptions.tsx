import React from "react";
import {
  TabScene,
  BottomTabNavigatorConfig,
  NavigationScreenConfigProps
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";

import CreateScreenIcon from "./CreateButton";

import EStyleSheet from "react-native-extended-stylesheet";
import color from "color";

const TabBarOptions: BottomTabNavigatorConfig = {
  initialRouteName: __DEV__ ? "AchievementsScreen" : "MapScreen",
  order: ["MapScreen", "CreateScreen", "AchievementsScreen"],
  // Default config for all screens
  tabBarPosition: "bottom",
  swipeEnabled: true,
  lazy: true,

  tabBarOptions: {
    showLabel: false,
    style: {
      backgroundColor: "#5cb85c"
    }
  },

  // @ts-ignore
  navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
    headerMode: "float",

    tabBarIcon: ({ focused, tintColor }: TabScene) => {
      const { routeName } = navigation.state;

      const tint = focused
        ? EStyleSheet.value("$colorSecondary")
        : color(EStyleSheet.value("$colorSecondary"))
            .fade(0.5)
            .string();

      switch (routeName) {
        case "AchievementsScreen":
          return <Icon name="view-list" color={tint as string} size={25} />;
        case "CreateScreen":
          return <CreateScreenIcon />;
        case "ProfileScreen":
          return <Ionicon name="ios-person" color={tint as string} size={25} />;
        default:
          return <Icon name="map" color={tint as string} size={25} />;
      }
    }
  })
};

export default TabBarOptions;
