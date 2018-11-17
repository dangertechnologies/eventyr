import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";
import { Icon } from "native-base";
import FastImage from "react-native-fast-image";

import ProfileScreen from "App/Screens/User/Profile";
import Image from "App/Components/RemoteImage";

import EStyleSheet from "react-native-extended-stylesheet";

import headerStyles from "../HeaderStyle";
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
