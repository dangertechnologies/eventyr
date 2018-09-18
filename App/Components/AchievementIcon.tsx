import React from "react";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconProps } from "react-native-vector-icons/Icon";
import EStyleSheet from "react-native-extended-stylesheet";

export interface Props extends IconProps {
  difficulty: string;
}

const styles = EStyleSheet.create({
  container: {
    $size: "$spacingDouble * 2",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "$size",
    height: "$size",
    borderRadius: "$size / 2"
  }
});

const difficultyGradient = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return ["#3A1C71", "#00dbde"];
    case "difficult":
      return ["#FC5C7D", "#6a82fb"];
    case "normal":
    default:
      return ["#3A1C71", "#7F00FF", "#E100FF"];
  }
};

const AchievementIcon: React.SFC<Props> = ({ difficulty, ...rest }: Props) => (
  <LinearGradient
    colors={difficultyGradient(difficulty)}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0 }}
    style={styles.container}
  >
    <Icon color="#FFFFFF" {...rest} />
  </LinearGradient>
);

export default AchievementIcon;
