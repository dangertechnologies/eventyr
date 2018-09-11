import React from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  TabScene,
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { compose } from "recompose";
import { TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import AchievementsScreen from "../Screens/Achievements/List";
import AchievementCreateScreen from "../Screens/Achievements/Create";
import AchievementDetailsScreen from "../Screens/Achievements/Details";
import AchievementEditScreen from "../Screens/Achievements/Edit";
import NearbyMapScreen from "../Screens/Nearby/Map";
import ProfileScreen from "../Screens/Profile/Profile";

import { withUser } from "../Providers/UserProvider";

const AchievementsTab = createStackNavigator(
  {
    AchievementScreen: {
      screen: createMaterialTopTabNavigator(
        {
          All: AchievementsScreen.All,
          Tracked: AchievementsScreen.Tracked,
          Personal: AchievementsScreen.Personal
        },
        // @ts-ignore
        {
          swipeEnabled: false,
          navigationOptions: () => ({
            tabBarOptions: {
              style: { backgroundColor: EStyleSheet.value("$colorSecondary") }
            }
          })
        }
      ),
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<NavigationState>;
      }) => ({
        title: "Achievements",
        headerRight: (
          <TouchableOpacity onPress={() => navigation.navigate("CreateScreen")}>
            <LottieView
              source={require("../Lottie/add.json")}
              autoPlay
              loop
              style={{ height: 30, width: 30, marginRight: 16 }}
            />
          </TouchableOpacity>
        )
      })
    },
    CreateScreen: {
      screen: AchievementCreateScreen
    },

    EditScreen: {
      screen: AchievementEditScreen
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

  console.log({ currentTab: routes[index] });

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
    },

    ProfileScreen: {
      screen: ProfileScreen
    }
  },
  // @ts-ignore
  {
    // Default config for all screens
    tabBarPosition: "bottom",
    initialRouteName: "ProfileScreen",
    swipeEnabled: true,
    lazy: true,
    paths: {
      AchievementsScreen: "AchievementsScreen",
      NearbyScreen: "NearbyScreen",
      ProfileScreen: "ProfileScreen"
    },

    tabBarOptions: {
      showLabel: true
    },
    order: ["AchievementsScreen", "NearbyScreen", "ProfileScreen"],

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
    AchievementsScreen: { screen: AchievementsTab }
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
