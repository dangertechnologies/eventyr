import React from "react";

/** COMPONENTS **/
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { Icon } from "native-base";
import {
  View as AnimatedView,
  Text as AnimatedText
} from "react-native-animatable";

import EStyleSheet from "react-native-extended-stylesheet";

/** TYPES **/
import { User } from "App/Types/GraphQL";
import Points from "../../Components/Profile/Points";

interface Props {
  user: User;
  height: Animated.AnimatedInterpolation;
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const UserHeaderPlaceholder = (
  <View style={{ flex: 0, height: 350, width: "100%" }} />
);

const { width } = Dimensions.get("window");

const HEADER_HEIGHT = 300;
const AVATAR_SIZE = 30;
const NAME_OFFSET_Y = 32;

const UserHeader = ({ user, height }: Props) => {
  const nameOffsetY = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [30, NAME_OFFSET_Y],
    extrapolate: "clamp"
  });

  const metadataOpacity = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp"
  });

  const pointsOffsetX = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [width * 0.8, 0],
    extrapolate: "clamp"
  });

  const pointsOffsetY = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [30, 40],
    extrapolate: "clamp"
  });

  const pointsScale = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [0.5, 1.0],
    extrapolate: "clamp"
  });

  return (
    <React.Fragment>
      <AnimatedView style={[styles.header, { height }]} animation="bounceIn">
        <AnimatedView style={[styles.avatar]} animation="bounceIn">
          <AnimatedIcon
            name="ios-person"
            type="Ionicons"
            style={[styles.userIcon, { top: nameOffsetY }]}
          />
        </AnimatedView>

        <AnimatedText style={[styles.name, { top: nameOffsetY }]}>
          {user && user.name}
        </AnimatedText>

        <AnimatedView style={{ flexDirection: "row", padding: 16 }}>
          <AnimatedView
            // @ts-ignore
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity: metadataOpacity
            }}
          >
            <Points
              scale={new Animated.Value(0.7)}
              value={user && user.unlockedCount ? user.unlockedCount : 0}
            >
              Unlocked
            </Points>
          </AnimatedView>
          <AnimatedView
            // @ts-ignore
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginLeft: pointsOffsetX,
              paddingTop: pointsOffsetY,
              flexGrow: 1
            }}
          >
            <Points scale={pointsScale} value={(user && user.points) || 0}>
              Points
            </Points>
          </AnimatedView>
          <AnimatedView
            // @ts-ignore
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity: metadataOpacity
            }}
          >
            <Points
              scale={new Animated.Value(0.7)}
              value={(user && user.coopPoints) || 0}
            >
              Coop Bonus
            </Points>
          </AnimatedView>
        </AnimatedView>
      </AnimatedView>
    </React.Fragment>
  );
};

const styles = EStyleSheet.create({
  header: {
    height: 300,
    width: "100%",
    position: "absolute",
    top: 0,
    backgroundColor: "$colorPrimary",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "$borderColor",
    justifyContent: "flex-end",
    alignItems: "center"
  },

  avatar: {
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "$colorPrimaryLight",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "$spacing",
    left: "$spacing"
  },

  userIcon: {
    color: "$colorSecondary"
  },

  name: {
    color: "$colorSecondary",
    margin: "$spacing",
    position: "absolute",
    top: NAME_OFFSET_Y,
    fontSize: 24
  },

  metadata: {
    margin: "$spacing",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0
  },

  numbers: {
    color: "$colorSecondary"
  },

  points: {
    color: "$colorSecondaryLight",
    fontWeight: "bold"
  },

  pointsLabel: {
    textAlign: "left"
  }
});

export default UserHeader;
