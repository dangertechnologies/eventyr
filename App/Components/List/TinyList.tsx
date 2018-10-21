import React from "react";
import { List } from "App/Types/GraphQL";

import { Text } from "native-base";
import { View, StyleSheet } from "react-native";

import AchievementCount from "App/Components/List/AchievementCount";
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  list: List;
}

const TinyAchievement = ({ list }: Props) => (
  <View style={styles.content}>
    <View style={[styles.card, styles.outerBackgroundCard]} />
    <View style={[styles.card, styles.innerBackgroundCard]} />
    <View style={[styles.card, styles.contentCard]}>
      <View style={[styles.inner]}>
        <AchievementCount>{list.achievementsCount}</AchievementCount>
        <Text style={styles.listTitle}>{list.title}</Text>
      </View>
    </View>
  </View>
);

const styles = EStyleSheet.create({
  content: {
    paddingHorizontal: "$spacing",
    marginTop: "$spacing",
    marginBottom: "$spacing"
  },
  card: {
    borderRadius: 30,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "$colorText",
    shadowOpacity: 0.1,
    backgroundColor: "$colorSecondary",
    height: 60
  },
  inner: {
    flex: 1,
    padding: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },

  listTitle: {
    fontSize: "$sizeH4",
    fontWeight: "bold",
    paddingLeft: "$spacing / 2"
  },

  selectedBorder: {
    borderLeftWidth: 5,
    borderLeftColor: "$colorPrimary"
  },

  innerBackgroundCard: {
    width: "95%",
    position: "absolute",
    bottom: -5,
    left: "7%",
    height: 60,
    opacity: 0.8
  },

  outerBackgroundCard: {
    margin: "$spacing",
    width: "90%",
    position: "absolute",
    bottom: -25,
    left: "5%",
    height: 70,
    opacity: 0.7
  },

  contentCard: {}
});

export default TinyAchievement;
