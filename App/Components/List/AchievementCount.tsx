import React from "react";
import { View } from "react-native";

/** COMPONENTS **/
import { Text, Icon } from "native-base";

import { round } from "lodash";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  children: number;
}

/**
 * Displays number of Achievements for a list as a badge
 * similar to the Points badge for an Achievement,
 * but instead of a circle and a star (which indicates points),
 * its displayed with a circle and a lock, to indicate Achievements.
 */
const AchievementCount = ({ children }: Props) => (
  <View style={styles.container}>
    <Text style={styles.points}>{round(children)}</Text>

    <Icon type="FontAwesome" name="lock" style={styles.icon} />
  </View>
);

const styles = EStyleSheet.create({
  icon: {
    position: "absolute",
    bottom: -8,
    fontSize: 18,
    color: "$colorPointsIcon",
    textShadowColor: "$colorSecondary",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    paddingLeft: 2
  },
  points: { fontWeight: "bold", color: "$colorPoints" },
  container: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "$colorPoints"
  }
});

export default AchievementCount;
