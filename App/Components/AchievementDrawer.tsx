import React from "react";

/** COMPONENTS  **/
import { View } from "react-native";
import { View as AnimatedView } from "react-native-animatable";
import {
  Label,
  Item,
  Button,
  CardItem,
  Body,
  Right,
  Icon,
  Left,
  H3,
  H2,
  Text
} from "native-base";
import LottieView from "lottie-react-native";
import ObjectiveChip from "App/Components/AchievementForm/ObjectiveChip";
import AchievementIcon from "App/Components/AchievementIcon";

import { graphql } from "react-apollo";

/** TYPES **/
import { Achievement, Objective, Query } from "App/Types/GraphQL";

import QUERY_ACHIEVEMENT_DETAILS from "App/GraphQL/Queries/Achievements/Details";

import { capitalize } from "lodash";
import { compose } from "recompose";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "App/Components/AchievementForm/Colors";

interface Props {
  id?: string;
  onPressObjective?(objective: Objective): any;
}

interface ComposedProps extends Props {
  data: Query & { loading: boolean; error: string };
}

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
          source={require("../Lottie/achievement-loading.json")}
          style={{ flex: 1, padding: 5 }}
          autoPlay
          loop
        />
      </View>
    ) : (
      <React.Fragment>
        <CardItem style={[styles.transparent, styles.noVerticalPadding]}>
          <Right style={{ flexGrow: 1, alignItems: "flex-end" }}>
            <Text note>{capitalize(achievement.mode)}</Text>
          </Right>
        </CardItem>
        <CardItem style={[styles.transparent, styles.noVerticalPadding]}>
          <Left style={{ flexGrow: 1, paddingTop: 0 }}>
            <AchievementIcon
              name={achievement.icon}
              size={40}
              difficulty={"Normal"}
              unlocked={achievement.unlocked}
            />
            <Body>
              <Item style={styles.underlineDisabled}>
                <H2 numberOfLines={1} allowFontScaling>
                  {achievement.name}
                </H2>
              </Item>
              <Item style={styles.underlineDisabled}>
                <Text note>{achievement.category.title}</Text>
              </Item>
            </Body>
          </Left>
          <Right style={{ flex: 0.3 }}>
            <H3>{achievement.points}</H3>
          </Right>
        </CardItem>

        <View style={styles.scrolledContentContainer}>
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
                          color={colors[index]}
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

          <CardItem>
            <Left>
              <Button iconLeft rounded small transparent>
                <Icon type="MaterialIcons" name="group-add" />
                <Text>Cooperate</Text>
              </Button>
              <Button iconLeft rounded small transparent>
                <Icon type="MaterialCommunityIcons" name="playlist-plus" />
                <Text>Add to list</Text>
              </Button>

              <Button iconLeft rounded small transparent>
                <Icon type="MaterialCommunityIcons" name="share" />
                <Text>Share</Text>
              </Button>
            </Left>
          </CardItem>

          <CardItem style={styles.transparent}>
            <Body>
              <Item stackedLabel style={styles.underlineDisabled}>
                <Label>Description</Label>
                <Text numberOfLines={10}>
                  {achievement.fullDescription || ""}
                </Text>
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
    flexDirection: "row",
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
