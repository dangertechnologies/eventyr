import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Objective, Query } from "graphqlTypes";
import { compose, graphql } from "react-apollo";
import { ApolloQueryResult } from "apollo-client";
import { sum } from "lodash";
import randomColor from "randomcolor";
// @ts-ignore
import Select from "react-native-picker-select";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";
import gql from "graphql-tag";
import { isEqual } from "apollo-utilities";
import {
  Container,
  Form,
  Input,
  Textarea,
  Label,
  Item,
  CardItem,
  Body,
  Right,
  Left,
  H3
} from "native-base";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import withLocation, {
  LocationContext
} from "../../Providers/LocationProvider";
import { Achievement, TypeEdge, ModeEdge, CategoryEdge } from "graphqlTypes";
import IconPicker from "../../Components/AchievementForm/IconPicker";
import ProtoObjectiveDialog from "../../Components/AchievementForm/ProtoObjectiveDialog";

interface ProtoObjective
  extends Omit<
      Objective,
      "achievements" | "createdAt" | "goal" | "goalType" | "hashIdentifier"
    > {
  color: string;
  lat?: number;
  lng?: number;
}

declare type EditableObjective =
  | ProtoObjective
  | Objective & { color: string; lat?: number; lng?: number };

interface ProtoAchievement
  extends Omit<
      Achievement,
      | "id"
      | "objectives"
      | "author"
      | "type"
      | "mode"
      | "category"
      | "hasParents"
      | "points"
    > {
  // This allows us to pass in existing objectives and show them on the map, when editing existing achivements
  objectives: Array<EditableObjective>;

  type: string | null;
  mode: string | null;
  category: string | null;
}

export interface State {
  achievement: ProtoAchievement | ProtoAchievement & Achievement;

  expandedForm: boolean;
  _objective: null | EditableObjective;
}

interface Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
  achievement: Achievement | undefined;
  onChange(achievement: State["achievement"]): any;
}

const getStyles = (expanded: boolean) =>
  EStyleSheet.create({
    formContainer: {
      height: expanded ? "60%" : "30%",
      width: "100%",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingTop: "$spacing",
      borderColor: "#CCCCCC",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderRightWidth: StyleSheet.hairlineWidth,
      backgroundColor: "$colorPrimary",
      position: "absolute",
      bottom: 0
    },

    actionButtonIcon: {
      fontSize: 22,
      color: "#FFFFFF"
    },

    expansionContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      height: "$spacing"
    },

    fabContainer: {
      marginHorizontal: "$spacing"
    },

    fab: {
      backgroundColor: EStyleSheet.value("$green"),
      width: 120,
      height: "$sizeParagraph * 2"
    },

    fabLabel: {
      fontSize: "$sizeParagraph"
    }
  });

class AchievementForm extends React.Component<Props, State> {
  // @ts-ignore We know it returns an array when we pass count property
  generatedColors: string[] = randomColor({ count: 100, luminosity: "bright" });

  state: State = {
    achievement: {
      name: "",
      shortDescription: "",
      longDescription: "",
      icon: "binoculars",
      basePoints: 10,
      mode: null,
      category: null,
      type: null,
      objectives: [],
      expires: null,
      isMultiPlayer: false,
      isGlobal: false,
      requestReview: false
    },
    expandedForm: true,

    // This contains a temporary objective, while
    // setting up the name and color of the objective.
    // When this exists, the modal is open. When the
    // modal closes, this is removed and added to the
    // objectives array instead.
    _objective: null
  };

  componentWillMount() {
    const { achievement } = this.props;

    if (achievement) {
      this.setAchievement(achievement);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { achievement } = nextProps;

    if (
      !isEqual(this.props.achievement, nextProps.achievement) &&
      achievement
    ) {
      this.setAchievement(achievement);
    }
  }

  /**
   * Makes an already existing achievement editable,
   * by adding longitude, latitude and color to objectives,
   * and replacing the type / category / mode fields with
   * their IDs instead
   */
  setAchievement = (achievement: Achievement) =>
    this.setState({
      achievement: {
        ...achievement,
        objectives: !achievement.objectives
          ? []
          : achievement.objectives.map(
              (objective: Objective, index: number) => ({
                ...objective,
                color: this.generatedColors[index]
              })
            ),
        mode: achievement.mode.id,
        category: achievement.category.id,
        type: achievement.type.id
      }
    });

  setField = (field: string, value: any) =>
    this.setState(
      {
        achievement: {
          ...this.state.achievement,
          [field]: value
        }
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.achievement);
        }
      }
    );

  calculatePoints = (): number => {
    const { achievement } = this.state;
    const category: CategoryEdge | undefined | null =
      achievement.category &&
      this.props.data.categories &&
      this.props.data.categories.edges
        ? this.props.data.categories.edges.find(({ node }: CategoryEdge) =>
            Boolean(node && node.id === achievement.category)
          )
        : null;

    const mode: ModeEdge | undefined | null =
      achievement.mode && this.props.data.modes && this.props.data.modes.edges
        ? this.props.data.modes.edges.find(({ node }: ModeEdge) =>
            Boolean(node && node.id === achievement.mode)
          )
        : null;

    const type: TypeEdge | undefined | null =
      achievement.type && this.props.data.types && this.props.data.types.edges
        ? this.props.data.types.edges.find(({ node }: TypeEdge) =>
            Boolean(node && node.id === achievement.type)
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
        (type && type.node ? type.node.points : 0)) *
      (mode && mode.node ? mode.node.multiplier : 1)
    );
  };

  render() {
    const styles = getStyles(this.state.expandedForm);

    console.log({ state: this.state });
    return (
      <View style={{ flex: 1 }} pointerEvents="box-none">
        <Form style={styles.formContainer}>
          <View style={styles.expansionContainer}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ expandedForm: !this.state.expandedForm })
              }
            >
              <Icon
                name={this.state.expandedForm ? "chevron-down" : "chevron-up"}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <Container>
            <CardItem>
              <Right style={{ flexGrow: 1, alignItems: "flex-end" }}>
                <Select
                  items={
                    this.props.data &&
                    this.props.data.modes &&
                    this.props.data.modes.edges
                      ? this.props.data.modes.edges
                          .map(
                            ({ node }: ModeEdge) =>
                              !node
                                ? null
                                : {
                                    label: node.name,
                                    value: node.id
                                  }
                          )
                          .filter((edge: any | null) => edge !== null)
                      : []
                  }
                  style={{
                    inputIOS: {
                      width: 150,
                      textAlign: "right"
                    },
                    viewContainer: {
                      width: 150,
                      flexDirection: "row",
                      alignSelf: "flex-end"
                    }
                  }}
                  hideIcon
                  placeholder={{
                    label: "Click to set Difficulty",
                    value: null
                  }}
                  value={this.state.achievement.mode}
                  onValueChange={(mode: string) =>
                    this.setState({
                      achievement: { ...this.state.achievement, mode }
                    })
                  }
                />
              </Right>
            </CardItem>
            <CardItem>
              <Left style={{ flexGrow: 1 }}>
                <IconPicker
                  // @ts-ignore
                  name={this.state.achievement.icon}
                  size={40}
                  difficulty={"Normal"}
                  onChange={(name: string) => this.setField("icon", name)}
                />
                <Body>
                  <Item>
                    <Input placeholder="Title" />
                  </Item>
                  <Item style={{ borderBottomWidth: 0 }}>
                    <Select
                      items={
                        this.props.data &&
                        this.props.data.categories &&
                        this.props.data.categories.edges
                          ? this.props.data.categories.edges
                              .map(
                                ({ node }: CategoryEdge) =>
                                  !node
                                    ? null
                                    : {
                                        label: node.title,
                                        value: node.id
                                      }
                              )
                              .filter((edge: any | null) => edge !== null)
                          : []
                      }
                      style={{
                        viewContainer: {
                          marginTop: 2
                        }
                      }}
                      hideIcon
                      placeholder={{
                        label: "Click to set Category",
                        value: null
                      }}
                      value={this.state.achievement.category}
                      onValueChange={(category: string) =>
                        this.setField("category", category)
                      }
                    />
                  </Item>
                </Body>
              </Left>
              <Right style={{ flex: 0.3 }}>
                <H3>{this.calculatePoints()}</H3>
              </Right>
            </CardItem>

            <CardItem>
              <Body>
                <Item stackedLabel>
                  <Label>Description</Label>
                  <Textarea
                    rowSpan={5}
                    placeholder="Give other users a background story for your achievement"
                  />
                </Item>
              </Body>
            </CardItem>
          </Container>
        </Form>

        <ActionButton
          buttonColor={EStyleSheet.value("$green")}
          verticalOrientation="up"
          // @ts-ignore
          offsetY={this.state.expandedForm ? "50%" : "20%"}
        >
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Location"
            onPress={() =>
              this.setState({
                _objective: {
                  tagline: "",
                  basePoints: 0,
                  isPublic: false,
                  requiredCount: 1,
                  color: this.generatedColors[
                    this.state.achievement.objectives.length
                  ]
                }
              })
            }
          >
            <Icon name="flag-variant" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Action"
            onPress={() => {}}
          >
            <Icon name="run" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

        <ProtoObjectiveDialog
          objective={this.state._objective ? this.state._objective : undefined}
          onChange={(objective: EditableObjective) => {
            const listOfObjective: Array<EditableObjective> = [objective];
            const existingObjectives: Array<EditableObjective> = this.state
              .achievement.objectives;

            this.setField(
              "objectives",
              existingObjectives.concat(listOfObjective)
            );
          }}
        />
      </View>
    );
  }
}

export default compose(
  graphql(
    gql`
      query {
        categories {
          edges {
            node {
              id
              title
              points
            }
          }
        }

        types {
          edges {
            node {
              id
              name
              points
            }
          }
        }

        modes {
          edges {
            node {
              id
              name
              multiplier
            }
          }
        }
      }
    `
  )
)(AchievementForm);
