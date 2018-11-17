import React from "react";
import { Animated } from "react-native";
import { View } from "react-native-animatable";
import WreathIcon from "./Wreath";

/** COMPONENTS **/
import { Text as NBText } from "native-base";
import { round } from "lodash";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

import Lottie from "lottie-react-native";

const LottieView = Animated.createAnimatedComponent(Lottie);
const Text = Animated.createAnimatedComponent(NBText);

interface Props {
  children: string;
  value: number;
  scale: Animated.Value | Animated.AnimatedInterpolation;
}

const Points = ({ children, value, scale }: Props) => {
  const pointsStyle = {
    top: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 20],
      extrapolate: "clamp"
    }),
    width: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 120],
      extrapolate: "clamp"
    }),
    fontSize: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 30],
      extrapolate: "clamp"
    })
  };

  const containerStyle = {
    height: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 120],
      extrapolate: "clamp"
    }),
    width: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 120],
      extrapolate: "clamp"
    }),
    opacity: scale.interpolate({
      inputRange: [0.6999, 0.7],
      outputRange: [0.0, 1.0],
      extrapolate: "clamp"
    })
  };

  const labelStyle = {
    width: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 120],
      extrapolate: "clamp"
    }),
    bottom: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, -10],
      extrapolate: "clamp"
    }),
    fontSize: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 18],
      extrapolate: "clamp"
    })
  };

  const starsStyle = {
    height: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 120],
      extrapolate: "clamp"
    }),
    width: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 120],
      extrapolate: "clamp"
    }),
    bottom: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, 10],
      extrapolate: "clamp"
    }),
    left: scale.interpolate({
      inputRange: [0.1, 1.0],
      outputRange: [0, -3],
      extrapolate: "clamp"
    })
  };

  return (
    <View style={styles.container}>
      <WreathIcon scale={scale} />
      <Text style={[styles.points, pointsStyle]}>{round(value)}</Text>
      <Text style={[styles.label, labelStyle]}>{children}</Text>

      <View style={[styles.starsContainer, containerStyle]}>
        <LottieView
          source={require("../../Lottie/stars.json")}
          style={starsStyle}
          animatable
          autoPlay
          loop={false}
        />
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  points: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "bold",

    color: "$colorSecondary"
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "$colorPoints"
  },
  label: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "bold",
    color: "$colorSecondary"
  },

  starsContainer: {
    transform: [{ rotate: "-180deg" }],
    position: "absolute"
  }
});

export default Points;
