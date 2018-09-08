import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  TabScene,
  NavigationScreenConfig
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { compose } from "recompose";
// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import AchievementsScreen from "../Screens/Achievements/List";
import AchievementsCreateScreen from "../Screens/Achievements/Create";
import AchievementDetailsScreen from "../Screens/Achievements/Details";
import NearbyMapScreen from "../Screens/Nearby/Map";

import { withUser } from "../Providers/UserProvider";

const AchievementsTab = createStackNavigator(
  {
    AchievementScreen: {
      screen: AchievementsScreen
    },

    CreateScreen: {
      screen: AchievementsCreateScreen
    },

    DetailsScreen: {
      screen: AchievementDetailsScreen
    }
  },
  { initialRouteName: "AchievementScreen" }
);

/**
 * Disable showing TabBar on certain screens, e.g the
 * map screen and the create screen.
 */
AchievementsTab.navigationOptions = ({
  navigation
}: NavigationScreenConfig<any>) => {
  const { routes, index } = navigation.state;
  const { routeName } = routes[index];

  return {
    tabBarVisible: ["CreateScreen", "DetailsScreen"].indexOf(routeName) === -1,
    title: "Achievements",
    tabBarLabel: "Achievements"
  };
};

const NearbyTab = createStackNavigator({
  NearbyMapScreen: {
    screen: NearbyMapScreen
  }
});

NearbyTab.navigationOptions = NearbyMapScreen.navigationOptions;

const loggedInNavigation = createBottomTabNavigator(
  {
    AchievementsScreen: {
      screen: AchievementsTab
    },

    NearbyScreen: {
      screen: NearbyTab
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
      AchievementsScreen: "AchievementsScreen",
      NearbyScreen: "NearbyScreen"
    },

    tabBarOptions: {
      showLabel: true
    },
    order: ["AchievementsScreen", "NearbyScreen"],

    navigationOptions: ({ navigation }) => ({
      headerMode: "float",
      tabBarIcon: ({ focused, tintColor }: TabScene) => {
        const { routeName } = navigation.state;

        const color = focused
          ? EStyleSheet.value("$colorSecondary")
          : EStyleSheet.value("$colorDisabled");

        switch (routeName) {
          case "AchievementsScreen":
            return (
              <Icon name="trending-up" color={color as string} size={25} />
            );
          default:
            return <Icon name="map" color={color as string} size={25} />;
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
