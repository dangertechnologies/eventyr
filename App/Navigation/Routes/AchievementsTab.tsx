import React from "react";
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";
import { TouchableOpacity } from "react-native";
import { Icon as NBIcon } from "native-base";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import AchievementsScreen from "App/Screens/Achievements/List/Screen";
import AchievementDetailsScreen from "App/Screens/Achievements/Details";
import AchievementEditScreen from "App/Screens/Achievements/Edit";
import NearbyMapScreen from "App/Screens/Achievements/Map";
import AddToListsScreen, {
  HeaderSaveButton as AddToListsSaveButton
} from "App/Screens/Lists/AddToLists";
import ListContentScreen from "App/Screens/Lists/ListContentScreen";

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

const AchievementsTab = createStackNavigator(
  {
    AchievementScreen: {
      screen: createMaterialTopTabNavigator(
        {
          Browse: AchievementsScreen.All,
          Community: AchievementsScreen.Community
        },
        {
          swipeEnabled: false,
          tabBarOptions: {
            style: {
              backgroundColor: "#5cb85c"
            },
            indicatorStyle: {
              backgroundColor: "#FFD300"
            }
          }
        }
      ),
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<NavigationState>;
      }) => ({
        title: "Achievements",
        headerStyle: styles.header,
        headerTintColor: "#FFFFFF",
        headerRight: (
          <TouchableOpacity
            onPress={() => navigation.navigate("NearbyMapScreen")}
          >
            <NBIcon name="map" style={styles.headerIcon} />
          </TouchableOpacity>
        )
      })
    },

    EditScreen: {
      screen: AchievementEditScreen,

      navigationOptions: {
        headerStyle: styles.header,
        headerTintColor: "#FFFFFF",
        title: "Edit"
      }
    },

    AddToLists: {
      screen: AddToListsScreen,

      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<NavigationState>;
      }) => ({
        title: "Add to Lists",
        headerStyle: styles.header,
        headerTintColor: "#FFFFFF",
        headerLeft: null,
        headerRight: <AddToListsSaveButton state={navigation.state} />
      })
    },

    ListContent: {
      screen: ListContentScreen,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<NavigationState>;
      }) => ({
        title: navigation.getParam("list")
          ? navigation.getParam("list").title
          : "List",
        headerStyle: styles.header,
        headerTintColor: "#FFFFFF",
        headerLeft: null
      })
    },

    DetailsScreen: {
      screen: AchievementDetailsScreen,

      navigationOptions: {
        ...HeaderStyle,
        headerTintColor: "#FFFFFF",
        title: "Details"
      }
    },

    NearbyMapScreen: {
      screen: NearbyMapScreen,

      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<NavigationState>;
      }) => ({
        title: "Achievements",
        headerStyle: styles.header,
        headerTintColor: "#FFFFFF",
        headerLeft: null,

        headerRight: (
          <TouchableOpacity
            onPress={() => navigation.navigate("AchievementScreen")}
          >
            <NBIcon name="list" type="Entypo" style={styles.headerIcon} />
          </TouchableOpacity>
        )
      })
    }
  },
  //{ initialRouteName: "NearbyMapScreen" }
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
    tabBarLabel: "Achievements",
    header: styles.header
  };
};

export default AchievementsTab;
