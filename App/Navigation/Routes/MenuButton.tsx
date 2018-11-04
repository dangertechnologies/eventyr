import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { compose } from "recompose";

import { withUser, UserContext } from "App/Providers/UserProvider";
import RemoteImage from "App/Components/RemoteImage";

import EStyleSheet from "react-native-extended-stylesheet";
import headerStyle from "../HeaderStyle";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
}

const MenuButtonComponent = ({ navigation, currentUser }: ComposedProps) => {
  console.log({ name: "MenuButton", currentUser });
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <RemoteImage
        source={{ uri: currentUser.avatar as string }}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const MenuButton = compose<ComposedProps, Props>(withUser)(MenuButtonComponent);

// Wrapper for screens to avoid having so much boilerplate
export const screenWithMenuButton = (
  screen: any,
  opts: (
    nav: { navigation: NavigationScreenProp<NavigationState> }
  ) => object = () => ({})
) => ({
  screen,
  navigationOptions: ({
    navigation
  }: {
    navigation: NavigationScreenProp<NavigationState>;
  }) => ({
    ...headerStyle,
    headerLeft: <MenuButton navigation={navigation} />,
    ...opts({ navigation })
  })
});

const styles = EStyleSheet.create({
  icon: {
    width: "$spacingDouble * 0.75",
    height: "$spacingDouble * 0.75",
    borderRadius: "$spacingDouble / 3",
    marginLeft: "$spacing"
  }
});

export default MenuButton;
