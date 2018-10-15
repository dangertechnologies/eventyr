import React from "react";
import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";
import ProfileScreen from "App/Screens/Profile/Profile";
import NotificationsScreen from "App/Screens/Notifications/Notifications";
import Image from "App/Components/RemoteImage";
import { Icon } from "native-base";

import EStyleSheet from "react-native-extended-stylesheet";
import Config from "../../../app.json";
import headerStyles from "../HeaderStyle";
import { TouchableWithoutFeedback } from "react-native";
import FastImage from "react-native-fast-image";

const AVATAR_SIZE = 30;

const Routes = createStackNavigator(
  {
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<NavigationState>;
      }) => ({
        ...headerStyles,
        title: navigation.getParam("title", "Profile"),
        headerRight: !navigation.getParam("isSelf", false) ? null : (
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("NotificationsScreen")}
          >
            <Icon name="bell" style={styles.notificationsIcon} />
          </TouchableWithoutFeedback>
        ),
        headerLeft: navigation.getParam("avatar") ? (
          <Image
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: navigation.getParam("avatar")
            }}
            style={[styles.userAvatar]}
          />
        ) : (
          <Icon name="ios-person" type="Ionicons" style={[styles.userIcon]} />
        )
      })
    },
    NotificationsScreen: {
      screen: NotificationsScreen,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationScreenProp<NavigationState>;
      }) => ({
        ...headerStyles,
        title: "Notifications",
        headerLeft: null,
        headerRight: (
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon name="close" style={styles.notificationsIcon} />
          </TouchableWithoutFeedback>
        )
      })
    }
  },
  {
    initialRouteName: "ProfileScreen",
    mode: "modal",
    navigationOptions: {
      ...headerStyles
    }
  }
);

const styles = EStyleSheet.create({
  userIcon: {
    color: "$colorSecondary"
  },
  notificationsIcon: {
    marginHorizontal: "$spacing",
    color: "$colorSecondary"
  },
  userAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginLeft: "$spacing",
    borderRadius: AVATAR_SIZE / 2
  }
});

export default Routes;
