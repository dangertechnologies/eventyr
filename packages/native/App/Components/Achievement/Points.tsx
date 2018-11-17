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
 * Displays Points for an Achievement as a badge,
 * with a circle and a star. This is used in the
 * Achievements/Overview, which is used to display
 * most Achievement metadata (title, category, icon, etc)
 * in the Drawer and the Cards.
 */
const Points = ({ children }: Props) => (
  <View style={styles.container}>
    <Text style={styles.points}>{round(children)}</Text>

    <Icon type="FontAwesome" name="star" style={styles.icon} />
  </View>
);

const styles = EStyleSheet.create({
  icon: {
    position: "absolute",
    bottom: -8,
    fontSize: 18,
    color: "$colorPointsIcon",
    textShadowColor: "rgba(255, 255, 255, 1)",
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

export default Points;
