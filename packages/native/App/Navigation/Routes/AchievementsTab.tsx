import React from "react";
import {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
  createStackNavigator
} from "react-navigation";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import AchievementsScreen from "App/Screens/Achievements/List";
import AchievementDetailsScreen from "App/Screens/Achievements/Details";
import AddToListsScreen, {
  HeaderSaveButton as AddToListsSaveButton
} from "App/Screens/Lists/AddToLists";
import ListContentScreen from "App/Screens/Lists/ListContentScreen";
import SettingsScreen, {
  HeaderSaveButton as SettingsSaveButton
} from "App/Screens/User/Settings";

// User screens navigated to from Drawer
import ProfileScreen from "App/Screens/User/Profile";
import NotificationsScreen from "App/Screens/User/Notifications";
import ListsScreen, {
  HeaderAddButton as AddNewListButton
} from "App/Screens/User/Lists";

import headerStyle from "../HeaderStyle";
import { screenWithMenuButton } from "./MenuButton";

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
    AchievementScreen: screenWithMenuButton(AchievementsScreen, () => ({
      title: "Achievements"
    })),

    AddToLists: screenWithMenuButton(
      AddToListsScreen,

      ({ navigation }) => ({
        title: "Add to Lists",
        headerRight: <AddToListsSaveButton state={navigation.state} />
      })
    ),

    ListContent: screenWithMenuButton(ListContentScreen, ({ navigation }) => ({
      title: navigation.getParam("list")
        ? navigation.getParam("list").title
        : "List"
    })),

    DetailsScreen: screenWithMenuButton(AchievementDetailsScreen, () => ({
      title: "Details"
    })),

    ProfileScreen: screenWithMenuButton(ProfileScreen, ({ navigation }) => ({
      title: navigation.getParam("title", "Profile")
    })),

    SettingsScreen: screenWithMenuButton(SettingsScreen, ({ navigation }) => ({
      title: "Settings",
      headerRight: <SettingsSaveButton navigation={navigation} />
    })),

    NotificationsScreen: screenWithMenuButton(NotificationsScreen, () => ({
      title: "Notifications"
    })),
    ListsScreen: screenWithMenuButton(ListsScreen, ({ navigation }) => ({
      title: "Lists",
      headerRight: <AddNewListButton navigation={navigation} />
    }))
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
    tabBarLabel: "Achievements",
    header: styles.header
  };
};

export default AchievementsTab;
