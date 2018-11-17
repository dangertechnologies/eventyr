import React from "react";
import { Achievement } from "@eventyr/graphql";

import { Text } from "native-base";
import { View, StyleSheet } from "react-native";

import Points from "App/Components/Achievement/Points";
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  achievement: Achievement;
}

const TinyAchievement = ({ achievement }: Props) => (
  <View style={styles.achievement}>
    <View style={styles.overview}>
      <Points>{achievement.points}</Points>
      <Text style={styles.achievementName}>{achievement.name}</Text>
    </View>
  </View>
);

const styles = EStyleSheet.create({
  overview: {
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "$colorBorder",
    borderRadius: 30,
    height: 60,
    paddingHorizontal: "$spacing / 2",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "$colorSecondary"
  },
  achievement: {
    alignItems: "center",
    justifyContent: "center"
  },

  achievementName: {
    fontSize: "$sizeH4",
    fontWeight: "bold",
    paddingLeft: "$spacing / 2"
  }
});

export default TinyAchievement;
