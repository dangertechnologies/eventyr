import React from "react";

/** COMPONENTS **/
import { View, TouchableOpacity } from "react-native";
import {
  Input,
  Textarea,
  Label,
  Item,
  CardItem,
  Body,
  Right,
  Left,
  H3,
  Button,
  Text,
  Icon
} from "native-base";
// @ts-ignore
import Select from "react-native-picker-select";
import ActionButton from "react-native-action-button";

import IconPicker from "./IconPicker";
import ObjectiveChip from "./ObjectiveChip";
import ProtoObjectiveDialog from "./ProtoObjectiveDialog";

/** UTILS **/
import { graphql } from "react-apollo";
import { compose } from "recompose";
import { sum, isEqual } from "lodash";
import { kindPoints, modeMultiplier } from "App/Helpers/Points";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

/** TYPES **/
import { ApolloQueryResult } from "apollo-client";
import { Region } from "react-native-maps";
import {
  Achievement,
  CategoryEdge,
  Objective,
  Query,
  Mode,
  Category
} from "App/Types/GraphQL";
import {
  ProtoObjective,
  EditableObjective,
  ProtoAchievement
} from "App/Types/Prototypes";

/** GRAPHQL **/
import QUERY_TAXONOMY from "../../GraphQL/Taxonomy";
import Difficulty from "../Achievement/Difficulty";
import Points from "../Achievement/Points";

export interface State {
  _objective: ProtoObjective | null;
}

interface Props {
  achievement: Achievement | ProtoAchievement;
  onSubmit(achievement: Achievement | ProtoAchievement): any;
  onClickObjective(achievement: EditableObjective): any;
  onChange(field: keyof Achievement, value: any): any;
  coordinates: Region | null;
  validationErrors: Array<string>;
}

interface ComposedProps extends Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
}

class AchievementForm extends React.Component<ComposedProps, State> {
  state: State = {
    // This contains a temporary objective, while
    // setting up the name and color of the objective.
    // When this exists, the modal is open. When the
    // modal closes, this is removed and added to the
    // objectives array instead.
    _objective: null
  };

  private calculatePoints = (): number => {
    const { achievement } = this.props;
    const category: CategoryEdge | undefined | null =
      achievement.category &&
      this.props.data.categories &&
      this.props.data.categories.edges
        ? this.props.data.categories.edges.find(({ node }: CategoryEdge) =>
            Boolean(
              node &&
                achievement.category &&
                node.id === achievement.category.id
            )
          )
        : null;

    const {
      objectives
    }: { objectives: Array<Objective | ProtoObjective> } = achievement;

    const objectivePoints = objectives
      ? sum(objectives.map(({ basePoints }) => basePoints || 0))
      : 0;

    return (
      (achievement.basePoints +
        objectivePoints +
        (category && category.node ? category.node.points : 0) +
        kindPoints(achievement.kind)) *
      modeMultiplier(achievement.mode)
    );
  };

  fab: ActionButton | null = null;

  render() {
    console.log({ name: "AchievementForm#render", props: this.props });

    const { achievement, data, onChange } = this.props;

    const categories: Array<Category> =
      data && data.categories && data.categories.edges
        ? (data.categories.edges
            .map(({ node }: CategoryEdge) => (!node ? null : node))
            .filter((node: Category | null) => node !== null) as Array<
            Category
          >)
        : [];

    const objectives: Array<EditableObjective> = achievement.objectives;

    return (
      <React.Fragment>
        <CardItem style={[styles.transparent, styles.noVerticalPadding]}>
          <Right style={{ flexGrow: 1, alignItems: "flex-end" }}>
            <Difficulty
              level={achievement.mode || "EASY"}
              onChange={(mode: Mode) => onChange("mode", mode)}
            />
          </Right>
        </CardItem>
        <CardItem style={[styles.transparent, styles.noVerticalPadding]}>
          <Left style={{ flexGrow: 1, paddingTop: 0 }}>
            <IconPicker
              name={achievement.icon}
              size={30}
              onChange={(name: string) => onChange("icon", name)}
            />
            <Body>
              <Item style={styles.underlineDisabled}>
                <Input
                  placeholder="Title"
                  onChangeText={(title: string) => onChange("name", title)}
                  value={achievement.name}
                />
              </Item>
              <Item style={styles.underlineDisabled}>
                <Select
                  items={categories.map((category: Category) => ({
                    label: category.title,
                    value: category.id
                  }))}
                  style={{
                    viewContainer: styles.selectCategory
                  }}
                  hideIcon
                  placeholder={{
                    label: "Click to set Category",
                    value: null
                  }}
                  value={achievement.category ? achievement.category.id : null}
                  onValueChange={(id: string) =>
                    onChange("category", categories.find(
                      (c: Category) => c.id === id
                    ) as Category)
                  }
                />
              </Item>
            </Body>
          </Left>
          <Right style={{ flex: 0.3 }}>
            <Points>{this.calculatePoints()}</Points>
          </Right>
        </CardItem>

        <CardItem style={styles.transparent}>
          <Body>
            <Item stackedLabel style={styles.underlineDisabled}>
              <Label style={styles.objectivesLabel}>Objectives: </Label>
              <View style={styles.objectivesChips}>
                {!achievement.objectives
                  ? null
                  : objectives.map((objective: EditableObjective, index) => (
                      <ObjectiveChip
                        objective={objective}
                        onPress={() =>
                          this.props.onClickObjective &&
                          this.props.onClickObjective(objective)
                        }
                        onLongPress={() =>
                          onChange(
                            "objectives",
                            objectives.filter(o => !isEqual(o, objective))
                          )
                        }
                      />
                    ))}

                <Button
                  rounded
                  small
                  transparent
                  onPress={() =>
                    this.fab &&
                    // @ts-ignore
                    this.fab.animateButton.apply(this.fab, this.fab)
                  }
                  iconLeft
                  style={{ margin: 2 }}
                >
                  <Icon
                    name="plus"
                    type="MaterialCommunityIcons"
                    fontSize={20}
                  />
                  <Text>Add objective</Text>
                </Button>
              </View>
            </Item>
          </Body>
        </CardItem>

        <CardItem style={styles.transparent}>
          <Body>
            <Item stackedLabel style={styles.underlineDisabled}>
              <Label>Description</Label>
              <Textarea
                rowSpan={3}
                placeholder="Give other users a background story for your achievement"
                onChangeText={(title: string) =>
                  onChange("fullDescription", title)
                }
                value={achievement.fullDescription || ""}
              />
            </Item>
          </Body>
        </CardItem>

        <CardItem style={[styles.transparent, styles.actions]}>
          {this.props.validationErrors && this.props.validationErrors.length ? (
            <Text>{this.props.validationErrors[0]}</Text>
          ) : (
            <TouchableOpacity onPress={() => this.props.onSubmit(achievement)}>
              <Icon
                name="ios-checkmark-circle-outline"
                type="Ionicons"
                style={{
                  color: "#00AA00",
                  fontSize: 100,
                  width: 100
                }}
              />
            </TouchableOpacity>
          )}
        </CardItem>

        <ActionButton
          buttonColor="transparent"
          renderIcon={() => null}
          ref={(instance: any) => {
            this.fab = instance;
          }}
          verticalOrientation="down"
          // @ts-ignore
          offsetY={this.state.expandedForm ? "50%" : "20%"}
        >
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Location"
            onPress={() =>
              this.setState({
                _objective: {
                  id: "",
                  tagline: "",
                  kind: "LOCATION",
                  lat: this.props.coordinates
                    ? this.props.coordinates.latitude
                    : 0,
                  lng: this.props.coordinates
                    ? this.props.coordinates.longitude
                    : 0,
                  basePoints: 0,
                  isPublic: false,
                  requiredCount: 1,
                  achievements: [],
                  altitude: 0,
                  country: null,
                  fromTimestamp: null,
                  toTimestamp: null,
                  timeConstraint: "NONE"
                }
              })
            }
          >
            <Icon
              name="flag-variant"
              type="MaterialCommunityIcons"
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#3498db" title="Action">
            <Icon
              name="run"
              type="MaterialCommunityIcons"
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
        </ActionButton>

        <ProtoObjectiveDialog
          objective={this.state._objective ? this.state._objective : undefined}
          onClose={() => this.setState({ _objective: null })}
          onChange={(objective: EditableObjective) => {
            const listOfObjective: Array<EditableObjective> = [objective];
            const existingObjectives: Array<EditableObjective> =
              achievement.objectives;

            onChange("objectives", existingObjectives.concat(listOfObjective));
            this.setState({ _objective: null });
          }}
        />
      </React.Fragment>
    );
  }
}

const styles = EStyleSheet.create({
  transparent: { backgroundColor: "transparent" },

  noVerticalPadding: { paddingTop: 0, paddingBottom: 0 },

  actionButtonIcon: {
    fontSize: 22,
    color: "#FFFFFF"
  },

  selectCategory: {
    marginTop: 2
  },

  selectMode: {
    width: 150,
    flexDirection: "row",
    alignSelf: "flex-end"
  },

  selectModeInput: {
    width: 150,
    textAlign: "right"
  },

  objectivesLabel: { marginBottom: 10 },
  objectivesChips: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly"
  },

  actions: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  underlineDisabled: {
    borderBottomWidth: 0
  }
});

const Form: React.ComponentClass<Props> = compose<ComposedProps, Props>(
  graphql(QUERY_TAXONOMY)
)(AchievementForm);

export default Form;
