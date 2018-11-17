import React from "react";

/** COMPONENTS  **/
import { ScrollView, View } from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import { Label, Item, CardItem, Body } from "native-base";
import LottieView from "lottie-react-native";
import Markdown from "react-native-simple-markdown";
import ObjectiveChip from "App/Components/AchievementForm/ObjectiveChip";

import { graphql } from "react-apollo";

/** TYPES **/
import { Objective, Query } from "@eventyr/graphql";

import QUERY_ACHIEVEMENT_DETAILS from "@eventyr/graphql/Queries/Achievements/Details";

import { compose } from "recompose";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "App/Components/AchievementForm/Colors";
import Overview from "./Overview";

interface Props {
  id?: string;
  onPressObjective?(objective: Objective): any;
}

interface ComposedProps extends Props {
  data: Query & { loading: boolean; error: string };
}

/**
 * Displays additional information about an Achievement,
 * e.g description, individual objectives, and so on, in
 * a drawer at the bottom of the screen that can be dragged
 * up / down, and snaps to different positions on the screen.
 *
 * This is the view used on the MapScreen to display all Achievement
 * information.
 */
class AchievementsDrawer extends React.PureComponent<ComposedProps> {
  drawer: AnimatedView | null = null;

  render() {
    console.log({ name: "AchievementsDrawer#render", props: this.props });

    const { data } = this.props;
    const achievement = data.achievement;

    const objectives: Array<Objective> = achievement
      ? achievement.objectives
      : [];

    return this.props.data.loading || !achievement ? (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <LottieView
          source={require("../../Lottie/achievement-loading.json")}
          style={{ flex: 1, padding: 5 }}
          autoPlay
          loop
        />
      </View>
    ) : (
      <React.Fragment>
        <View style={styles.scrolledContentContainer}>
          <Overview achievement={achievement} />
          <CardItem style={styles.transparent}>
            <Body>
              <Item stackedLabel style={styles.underlineDisabled}>
                <Label style={styles.objectivesLabel}>Objectives</Label>
                <View style={styles.objectivesChips}>
                  {!achievement.objectives
                    ? null
                    : objectives.map((objective: Objective, index) => (
                        <ObjectiveChip
                          key={objective.id}
                          objective={objective}
                          onPress={() =>
                            this.props.onPressObjective &&
                            this.props.onPressObjective(objective)
                          }
                        />
                      ))}
                </View>
              </Item>
            </Body>
          </CardItem>

          <CardItem style={styles.transparent}>
            <Body>
              <Item stackedLabel style={styles.underlineDisabled}>
                <Label>Description</Label>
                <ScrollView>
                  <Markdown>{achievement.fullDescription || ""}</Markdown>
                </ScrollView>
              </Item>
            </Body>
          </CardItem>
        </View>
      </React.Fragment>
    );
  }
}

const styles = EStyleSheet.create({
  transparent: { backgroundColor: "transparent" },

  noVerticalPadding: { paddingTop: 0, paddingBottom: 0 },

  selectModeInput: {
    width: 150,
    textAlign: "right"
  },

  objectivesLabel: { marginBottom: 10 },
  objectivesChips: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    flexWrap: "wrap"
  },

  actions: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  scrolledContentContainer: {
    flexGrow: 1
  },

  underlineDisabled: {
    borderBottomWidth: 0
  }
});

export default compose<ComposedProps, Props>(
  graphql(QUERY_ACHIEVEMENT_DETAILS)
)(AchievementsDrawer);
