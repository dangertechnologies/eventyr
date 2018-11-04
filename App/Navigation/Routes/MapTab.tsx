import React from "react";
import {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
  createStackNavigator
} from "react-navigation";
import { TouchableOpacity } from "react-native";
import { Icon as NBIcon } from "native-base";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import AchievementDetailsScreen from "App/Screens/Achievements/Details";
import AchievementEditScreen from "App/Screens/Achievements/Edit";
import NearbyMapScreen from "App/Screens/Achievements/Map";
import { screenWithMenuButton } from "./MenuButton";

import HeaderStyle from "../HeaderStyle";

const styles = EStyleSheet.create({
  header: {
    backgroundColor: "$colorPrimary",
    color: "$colorSecondary"
  },

  headerTitle: {
    color: "$colorSecondary"
  },

  tabBar: {
    backgroundColor: "$colorPrimary"
  },

  headerIcon: {
    fontSize: 28,
    marginRight: "$spacingDouble",
    color: "$colorSecondary"
  }
});

const MapTab = createStackNavigator(
  {
    EditScreen: screenWithMenuButton(AchievementEditScreen, () => ({
      title: "Edit"
    })),
    DetailsScreen: screenWithMenuButton(AchievementDetailsScreen, () => ({
      title: "Details"
    })),

    NearbyMapScreen: screenWithMenuButton(NearbyMapScreen, () => ({
      title: "Map"
    }))
  },
  { initialRouteName: "NearbyMapScreen" }
);

/**
 * Disable showing TabBar on certain screens, e.g the
 * map screen and the create screen.
 */
MapTab.navigationOptions = ({ navigation }: NavigationScreenConfig<any>) => {
  const { routes, index } = navigation.state;
  const { routeName } = routes[index];

  console.log({ currentTab: routes[index] });

  return {
    tabBarVisible: ["CreateScreen", "DetailsScreen"].indexOf(routeName) === -1,
    title: "Nearby",
    tabBarLabel: "Nearby",
    header: styles.header
  };
};

export default MapTab;
