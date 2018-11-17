import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import {
  List,
  ListItem,
  Text,
  H3,
  H1,
  Container,
  Content,
  View,
  Icon
} from "native-base";
import { compose, withProps } from "recompose";
import { withUser, UserContext } from "@eventyr/core/Providers";

import RemoteImage from "App/Components/RemoteImage";

import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
}

const NavigationDrawer = ({ navigation, currentUser }: ComposedProps) => (
  <SafeAreaView style={[styles.container, styles.primaryBackground]}>
    <Container style={styles.transparent}>
      <Content style={styles.transparent}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <View style={styles.userInfo}>
            <RemoteImage
              source={{ uri: currentUser.avatar as string }}
              style={styles.avatar}
            />
            <H1 style={styles.name}>{currentUser.name}</H1>
          </View>
        </TouchableOpacity>
        <List>
          <ListItem
            style={styles.menuItem}
            onPress={() => {
              navigation.goBack();
              navigation.navigate("NotificationsScreen");
            }}
            iconLeft
            noIndent
          >
            <Icon name="bell-outline" style={styles.menuIcon} />
            <Text style={styles.menuLink}>Notifications</Text>
          </ListItem>
          <ListItem
            style={styles.menuItem}
            onPress={() => navigation.navigate("ListsScreen")}
            iconLeft
            noIndent
          >
            <Icon name="list" type="MaterialIcons" style={styles.menuIcon} />
            <Text style={styles.menuLink}>Lists</Text>
          </ListItem>
          <ListItem
            iconLeft
            style={styles.menuItem}
            noIndent
            onPress={() => navigation.navigate("SettingsScreen")}
          >
            <Icon name="settings-outline" style={styles.menuIcon} />
            <Text style={styles.menuLink}>Settings</Text>
          </ListItem>
        </List>
      </Content>
    </Container>
  </SafeAreaView>
);

const styles = EStyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    paddingRight: "$spacingDouble",
    flex: 1
  },
  primaryBackground: {
    backgroundColor: "$colorPrimary"
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 50
  },

  userInfo: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "$spacingDouble",
    marginBottom: "$spacingDouble"
  },

  menuLink: {
    color: "$colorSecondary"
  },

  menuIcon: {
    color: "$colorSecondary",
    marginRight: "$spacingDouble",
    fontSize: "$sizeH3"
  },
  menuItem: {
    backgroundColor: "transparent",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "$colorPrimaryDark",
    paddingVertical: 0,
    paddingTop: "$spacing",
    paddingBottom: "$spacing"
  },
  transparent: {
    backgroundColor: "transparent"
  },
  name: { marginTop: "$spacing", color: "$colorSecondary" }
});

export default compose<ComposedProps, Props>(
  withUser,
  withProps(({ navigation, currentUser }: ComposedProps) => ({
    id: navigation.getParam("id", `${currentUser.id}`)
  }))
)(NavigationDrawer);
