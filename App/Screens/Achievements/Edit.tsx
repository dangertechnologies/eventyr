import React from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import Map, { Region, Marker } from "react-native-maps";
import { Query, Category, Mode } from "graphqlTypes";
import { ApolloQueryResult } from "apollo-client";
import { graphql, MutateProps } from "react-apollo";
import { omit, pick } from "lodash";
import { compose, withProps, defaultProps, withStateHandlers } from "recompose";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import gql from "graphql-tag";
import { NavigationScreenProp, NavigationState } from "react-navigation";

import EStyleSheet from "react-native-extended-stylesheet";

import reformed, { ReformedProps, ExternalProps } from "react-reformed";
import { ValidationProps } from "react-reformed/lib/validateSchema";

import objectiveColors from "../../Components/AchievementForm/Colors";
import { withUIHelpers, UIContext } from "../../Providers/UIProvider";

import AchievementForm from "../../Components/AchievementForm/Form";
import validateAchievement from "../../Components/AchievementForm/Validate";

import { Achievement, Objective } from "graphqlTypes";
import {
  EditableObjective,
  ProtoAchievement
} from "../../Components/AchievementForm/types";
import MapMarker from "../../Components/MapMarker";
import Drawer from "../../Components/Drawer/Drawer";
import withLocation, {
  LocationContext
} from "../../Providers/LocationProvider";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

type ComposedProps = Props &
  MutateProps &
  ReformedProps<Achievement | ProtoAchievement> &
  ExternalProps<Achievement | ProtoAchievement> &
  ValidationProps<Achievement | ProtoAchievement> & {
    data: Query & ApolloQueryResult<Query> & { error: string };
    validationErrors: Array<string>;
    ui: UIContext;
    location: LocationContext;
    coordinates: Region;
    setCoordinates(region?: Region): any;
  };

interface State {
  coordinates: Region | null;
}

const CROSSHAIR_SIZE = 20;

class AchievementsEdit extends React.Component<ComposedProps, State> {
  state: State = {
    coordinates: null
  };

  componentDidMount() {
    this.props.setCoordinates();

    if (this.map) {
      this.map.fitToElements(true);
    }
  }

  componentWillReceiveProps() {
    if (this.map) {
      this.map.fitToElements(true);
    }
  }

  updateAchievement = (model: ProtoAchievement) => {
    console.log({ model });

    const { objectives } = model;
    const mode = model.mode as Mode;
    const category = model.category as Category;

    const protoAchievement = {
      ...omit(model, ["category", "mode", "type"]),
      categoryId: parseInt(category && category.id ? category.id : "0", 10),
      modeId: parseInt(mode.id, 10),
      description: model.fullDescription,
      objectives: objectives.map(o => ({
        ...pick(o, [
          "lat",
          "lng",
          "kind",
          "id",
          "tagline",
          "basePoints",
          "requiredCount"
        ]),
        country: "Norway"
      }))
    };

    console.log({ protoAchievement });

    this.props
      .mutate({
        variables: protoAchievement,
        refetchQueries: ["AchievementsList"]
      })
      .then(({ data }) => {
        console.log({ data });
        const { errors, achievement } = data.editAchievement;

        // TODO: Handle errors here by showing an error notification
        this.props.ui.notifySuccess("Saved").then(() =>
          this.props.navigation.navigate("DetailsScreen", {
            id: achievement.id
          })
        );
      });
  };

  map: Map | null = null;

  render() {
    console.log({ name: "AchievementsEdit#render", state: this.state });

    const { data, initialModel } = this.props;
    const model =
      (this.props.model as Achievement) ||
      (this.props.data.achievement as Achievement);
    const currentObjectives = model.objectives || [];
    const nearbyObjectives =
      data.objectives && data.objectives.edges
        ? data.objectives.edges.filter(
            ({ node }) =>
              node &&
              !currentObjectives.some(
                (o: EditableObjective | Objective) => o.id === node.id
              )
          )
        : [];

    return (
      <View style={{ flex: 1 }}>
        <Map
          style={StyleSheet.absoluteFill}
          ref={(map: any) => {
            this.map = map;
          }}
          onRegionChangeComplete={(region: Region) =>
            this.setState({ coordinates: region })
          }
        >
          {/* Show existing objectives and allow user to add existing 
               objectives to the achievement */}
          {nearbyObjectives &&
            nearbyObjectives.map(
              ({ node }) =>
                node && (
                  <MapMarker
                    objective={node}
                    calloutIcon="plus"
                    color="#333333"
                    key={node.id}
                    onCalloutPress={() => {
                      this.props.setProperty(
                        "objectives",
                        (model.objectives || []).concat([node])
                      );

                      this.props.ui.notifySuccess("New objective");
                    }}
                  />
                )
            )}

          {/* Show objectives currently added to achievement */}

          {currentObjectives &&
            currentObjectives.map(
              (objective, index) =>
                objective && (
                  <MapMarker
                    objective={objective}
                    key={objective.id || `new-objective-${index}`}
                    color={objectiveColors[index % 100]}
                  />
                )
            )}
        </Map>
        <View pointerEvents="none" style={styles.crosshairContainer}>
          <Icon
            style={styles.crosshair}
            name="crosshairs"
            size={CROSSHAIR_SIZE}
          />
        </View>

        <Drawer maxHeight={500} initiallyExpanded>
          {model &&
            initialModel && (
              <AchievementForm
                achievement={model}
                onChange={this.props.setProperty}
                validationErrors={this.props.validationErrors}
                coordinates={this.state.coordinates}
                onSubmit={this.updateAchievement}
                onClickObjective={(objective: EditableObjective) =>
                  objective.lat &&
                  objective.lng &&
                  this.map &&
                  this.map.animateToCoordinate({
                    latitude: objective.lat,
                    longitude: objective.lng
                  })
                }
              />
            )}
        </Drawer>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  crosshairContainer: {
    $size: CROSSHAIR_SIZE,
    position: "absolute",
    $halfSize: "$size / 2",
    left: "50% - $halfSize",
    top: "50% - $halfSize",
    width: "$size",
    alignItems: "center",
    justifyContent: "center"
  },
  crosshair: {
    color: "$colorSecondary"
  }
});

const Screen = compose<ComposedProps, Props>(
  withProps(({ navigation }: Props) => ({
    id: navigation.getParam("id", "12")
  })),
  graphql(
    gql`
      query AchievementEditDetails($id: String!) {
        achievement(id: $id) {
          id
          name
          shortDescription
          fullDescription
          basePoints
          points
          icon
          objectives {
            id
            tagline
            kind
            lat
            lng
            basePoints
          }

          category {
            id
            title
            points
          }

          mode {
            id
            name
            multiplier
          }

          type {
            id
            name
            points
          }
        }
      }
    `
  ),
  graphql(gql`
    mutation EditAchievement(
      $id: String!
      $name: String!
      $description: String!
      $objectives: [ObjectiveInput!]!
      $icon: String!
      $categoryId: Int!
      $modeId: Int!
    ) {
      editAchievement(
        input: {
          id: $id
          name: $name
          description: $description
          icon: $icon
          modeId: $modeId
          categoryId: $categoryId
          objectives: $objectives
        }
      ) {
        achievement {
          id
          name
          shortDescription
          fullDescription
          author {
            id
            name
          }

          isMultiPlayer
          category {
            id
            title
            icon
          }

          points

          objectives {
            id
            tagline
            lat
            lng
            isPublic
            kind
          }
        }
        errors
      }
    }
  `),

  withLocation(),
  defaultProps({
    initialModel: {
      name: "",
      shortDescription: "",
      fullDescription: "",
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
    }
  }),
  withProps(
    ({ data }: ComposedProps) =>
      data && data.achievement ? { initialModel: data.achievement } : {}
  ),
  reformed<Achievement>(),
  withStateHandlers(
    {
      coordinates: null
    },
    // @ts-ignore
    {
      setCoordinates: ({ location }: ComposedProps) => (
        coordinates: Region
      ) => ({
        coordinates: coordinates || location
      })
    }
  ),
  graphql(
    gql`
      query NearbyObjectives($latitude: Float!, $longitude: Float!) {
        objectives(near: [$latitude, $longitude]) {
          edges {
            node {
              id
              tagline
              basePoints
              requiredCount
              lat
              lng
              kind
            }
          }
        }
      }
    `,
    {
      options: ({ coordinates, location }: ComposedProps) => ({
        variables: coordinates || location
      })
    }
  ),
  withUIHelpers,
  validateAchievement
)(AchievementsEdit);

// @ts-ignore
Screen.navigationOptions = {
  tabBarVisible: false,
  headerMode: "float",
  headerTransparent: true,
  title: "Edit Achievement",
  headerStyle: {
    backgroundColor: "transparent",
    borderBottomWidth: 0
  }
};

export default Screen;
