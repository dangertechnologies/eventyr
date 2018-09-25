import React from "react";

/** COMPONENTS **/
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { H2, H3, Text, Icon, Body, Row } from "native-base";
import {
  View as AnimatedView,
  Text as AnimatedText
} from "react-native-animatable";
import MaterialTabs from "react-native-material-tabs";

import EStyleSheet from "react-native-extended-stylesheet";

/** TYPES **/
import { User } from "App/Types/GraphQL";

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
const AVATAR_SIZE = 80;
const AVATAR_OFFSET_Y = HEADER_HEIGHT * 0.5 - AVATAR_SIZE * 0.5 - 20;
const AVATAR_OFFSET_X = width * 0.5 - AVATAR_SIZE * 0.5;
const NAME_OFFSET_Y = HEADER_HEIGHT * 0.5 + AVATAR_SIZE * 0.5 - 30;

const UserHeader = ({ user, height }: Props) => {
  const avatarOffsetY = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [40, AVATAR_OFFSET_Y],
    extrapolate: "clamp"
  });

  const avatarOffsetX = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [16, AVATAR_OFFSET_X],
    extrapolate: "clamp"
  });

  const avatarSize = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [AVATAR_SIZE / 2, AVATAR_SIZE],
    extrapolate: "clamp"
  });

  const avatarBorderRadius = height.interpolate({
    inputRange: [100, HEADER_HEIGHT],
    outputRange: [AVATAR_SIZE / 4, AVATAR_SIZE / 2],
    extrapolate: "clamp"
  });

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
    outputRange: [30, 0],
    extrapolate: "clamp"
  });

  return (
    <React.Fragment>
      <AnimatedView style={[styles.header, { height }]} animation="bounceIn">
        <AnimatedView
          style={[
            styles.avatar,
            {
              top: avatarOffsetY,
              left: avatarOffsetX,
              height: avatarSize,
              width: avatarSize,
              borderRadius: avatarBorderRadius
            }
          ]}
          animation="bounceIn"
        >
          <AnimatedIcon
            name="ios-person"
            type="Ionicons"
            style={[styles.userIcon, { fontSize: avatarSize }]}
          />
        </AnimatedView>

        <AnimatedText style={[styles.name, { top: nameOffsetY }]}>
          {user && user.name}
        </AnimatedText>

        <Row style={styles.metadata}>
          <AnimatedView
            // @ts-ignore
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity: metadataOpacity
            }}
          >
            <H3 style={styles.numbers}>{user && user.unlockedCount}</H3>
            <Text note style={styles.pointsLabel}>
              Unlocked
            </Text>
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
            <H2 style={styles.points}>{user && user.points}</H2>
            <Text note style={styles.pointsLabel}>
              Points
            </Text>
          </AnimatedView>
          <AnimatedView
            // @ts-ignore
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity: metadataOpacity
            }}
          >
            <H3 style={styles.numbers}>{user && user.coopPoints}</H3>
            <Text note style={styles.pointsLabel}>
              Coop bonus
            </Text>
          </AnimatedView>
        </Row>
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
    justifyContent: "center",
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
    top: AVATAR_OFFSET_Y,
    left: AVATAR_OFFSET_X
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
