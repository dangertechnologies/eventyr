import React from "react";

/** COMPONENTS **/
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { Icon } from "native-base";
import { View as AnimatedView } from "react-native-animatable";

import EStyleSheet from "react-native-extended-stylesheet";
import Config from "../../../app.json";

/** TYPES **/
import { User } from "@eventyr/graphql";
import Points from "App/Components/Profile/Points";

interface Props {
  user: User;
  height: Animated.AnimatedInterpolation;
}

export const UserHeaderPlaceholder = (
  <View style={{ flex: 0, height: 250, width: "100%" }} />
);

export const HEADER_HEIGHT = 200;
export const HEADER_MIN_HEIGHT = 10;

const smallPoints = new Animated.Value(0.7);

const UserHeader = ({ user, height }: Props) => {
  const metadataOpacity = height.interpolate({
    inputRange: [HEADER_MIN_HEIGHT, HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp"
  });

  const pointsOpacity = height.interpolate({
    inputRange: [HEADER_MIN_HEIGHT, HEADER_HEIGHT],
    outputRange: [0.0, 1.0],
    extrapolate: "clamp"
  });

  const pointsScale = height.interpolate({
    inputRange: [HEADER_MIN_HEIGHT, HEADER_HEIGHT],
    outputRange: [0.5, 1.0],
    extrapolate: "clamp"
  });

  return (
    <React.Fragment>
      <AnimatedView style={[styles.header, { height }]} animation="bounceIn">
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
              scale={smallPoints}
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
              opacity: pointsOpacity,
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
            <Points scale={smallPoints} value={(user && user.coopPoints) || 0}>
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
    height: HEADER_HEIGHT,
    width: "100%",
    position: "absolute",
    top: 0,
    backgroundColor: "$colorPrimary",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "$borderColor",
    justifyContent: "flex-end",
    alignItems: "center"
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
