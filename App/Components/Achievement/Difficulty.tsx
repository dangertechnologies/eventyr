import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";

import { Mode } from "App/Types/GraphQL";

interface Props {
  level: Mode;
  onChange?(level: Mode): any;
}

/**
 * Displays Difficulty as three bars:
 * - When difficulty is easy, only display one green bar, and two outlined bars,
 * - When difficulty is normal, display two yellow bars and one outlined bar,
 * - When difficulty is difficult, display three red bars
 */
const Difficulty = ({ level, onChange }: Props) => {
  let easyBar, normalBar, difficultBar;

  switch (level.toLowerCase()) {
    case "easy":
      easyBar = styles.easySelected;
      break;
    case "normal":
      easyBar = styles.normalSelected;
      normalBar = styles.normalSelected;
      break;
    case "difficult":
      (easyBar = styles.difficultSelected),
        (normalBar = styles.difficultSelected),
        (difficultBar = styles.difficultSelected);
      break;
    default:
      easyBar = styles.easySelected;
      break;
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => onChange && onChange("EASY")}>
        <View style={[styles.level, styles.levelFirst, easyBar]} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => onChange && onChange("NORMAL")}>
        <View style={[styles.level, normalBar]} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => onChange && onChange("DIFFICULT")}
      >
        <View style={[styles.level, styles.levelLast, difficultBar]} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    flexDirection: "row"
  },

  levelFirst: {
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9
  },

  levelLast: {
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9
  },

  level: {
    height: 6,
    width: 14.6,
    marginLeft: 3,

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "$colorBorder"
  },

  easySelected: {
    backgroundColor: "$colorDifficultyEasy",
    borderWidth: 0
  },

  normalSelected: {
    backgroundColor: "$colorDifficultyNormal",
    borderWidth: 0
  },

  difficultSelected: {
    backgroundColor: "$colorDifficultyHard",
    borderWidth: 0
  }
});

export default Difficulty;
