import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Objective } from "graphqlTypes";
import { View as AnimatedView } from "react-native-animatable";
import { BlurView } from "react-native-blur";

import EStyleSheet from "react-native-extended-stylesheet";
import {
  Container,
  Form,
  Label,
  Item,
  CardItem,
  Body,
  Right,
  Left,
  H3,
  H2,
  Text,
  Icon
} from "native-base";

import { Achievement } from "graphqlTypes";
import LottieView from "lottie-react-native";

import ObjectiveChip from "./ObjectiveChip";
import colors from "./Colors";
import AchievementIcon from "../AchievementIcon";

interface Props {
  achievement?: Achievement;
  loading: boolean;
  onPressObjective?(objective: Objective): any;
}

class DetailsView extends React.PureComponent<Props> {
  drawer: AnimatedView | null = null;

  render() {
    console.log({ name: "DetailsView#render", props: this.props });

    const { achievement } = this.props;

    const objectives: Array<Objective> = achievement
      ? achievement.objectives
      : [];

    return this.props.loading || !achievement ? (
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
        <CardItem style={[styles.transparent, styles.noVerticalPadding]}>
          <Right style={{ flexGrow: 1, alignItems: "flex-end" }}>
            <Text note>{achievement.mode.name}</Text>
          </Right>
        </CardItem>
        <CardItem style={[styles.transparent, styles.noVerticalPadding]}>
          <Left style={{ flexGrow: 1, paddingTop: 0 }}>
            <AchievementIcon
              name={achievement.icon}
              size={40}
              difficulty={"Normal"}
            />
            <Body>
              <Item>
                <H2 numberOfLines={1} allowFontScaling>
                  {achievement.name}
                </H2>
              </Item>
              <Item style={{ borderBottomWidth: 0 }}>
                <Text note>{achievement.category.title}</Text>
              </Item>
            </Body>
          </Left>
          <Right style={{ flex: 0.3 }}>
            <H3>{achievement.points}</H3>
          </Right>
        </CardItem>

        <ScrollView
          style={styles.scrolledContentContainer}
          contentContainerStyle={styles.scrolledContent}
        >
          <CardItem style={styles.transparent}>
            <Body>
              <Item stackedLabel>
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

          <CardItem style={styles.transparent}>
            <Body>
              <Item stackedLabel>
                <Label>Description</Label>
                <Text numberOfLines={10}>
                  {achievement.fullDescription || ""}
                </Text>
              </Item>
            </Body>
          </CardItem>
        </ScrollView>
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

  scrolledContent: {
    flex: 1
  }
});

export default DetailsView;
