import React from "react";

/** PROVIDERS */
import { withUIHelpers } from "App/Providers/UIProvider";
import withLocation from "App/Providers/LocationProvider";

/** COMPONENTS **/
import { View, StyleSheet } from "react-native";
import Map from "react-native-maps";
import { Icon } from "native-base";
import Drawer from "App/Components/Drawer";
import MapMarker from "App/Components/MapMarker";
import AchievementForm from "App/Components/AchievementForm";

/** UTILS */
import reformed from "react-reformed";
import { compose, withStateHandlers, defaultProps, withProps } from "recompose";
import { omit, pick, isEqual } from "lodash";
import validateAchievement from "App/Components/AchievementForm/Validate";

/** GRAPHQL **/
import { graphql } from "react-apollo";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";
import objectiveColors from "App/Components/AchievementForm/Colors";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";
import {
  Query,
  Category,
  Mode,
  Objective,
  Achievement
} from "@eventyr/graphql";
import { EditableObjective, ProtoAchievement } from "App/Types/Prototypes";
import { ApolloQueryResult } from "apollo-client";
import { Region } from "react-native-maps";
import { MutateProps } from "react-apollo";
import { ReformedProps, ExternalProps } from "react-reformed";
import { ValidationProps } from "react-reformed/lib/validateSchema";
import { LocationContext } from "App/Providers/LocationProvider";
import { UIContext } from "App/Providers/UIProvider";

import MUTATION_UPDATE_ACHIEVEMENT from "@eventyr/graphql/Mutations/Achievements/Update";
import QUERY_ACHIEVEMENT_DETAILS from "@eventyr/graphql/Queries/Achievements/Details";
import QUERY_OBJECTIVES_NEARBY from "@eventyr/graphql/Queries/Achievements/ObjectivesNearby";
import HeaderStyle from "../../Navigation/HeaderStyle";

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

  hasBeenZoomed: boolean = false;

  componentDidMount() {
    if (this.map) {
      this.map.fitToElements(true);
    }
  }

  componentDidUpdate() {
    if (this.map && !this.hasBeenZoomed) {
      this.hasBeenZoomed = true;
      this.map.fitToElements(true);
    }
  }

  updateAchievement = (model: ProtoAchievement) => {
    console.log({ model });

    const { objectives } = model;
    const mode = model.mode;
    const category = model.category as Category;

    const protoAchievement = {
      ...omit(model, ["category", "mode", "type"]),
      categoryId: parseInt(category && category.id ? category.id : "0", 10),
      mode: mode,
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
      .then(({ data }: any) => {
        console.log({ data });
        const { errors, achievement } = data.editAchievement;

        if (errors && errors.length) {
          this.props.ui.notifyError(errors[0]);
        }

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
            name="crosshairs"
            type="MaterialCommunityIcons"
            style={{ fontSize: CROSSHAIR_SIZE }}
          />
        </View>

        <Drawer snapTo={[500, "70%"]} initialSnapIndex={0}>
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
    color: "$colorPrimary"
  }
});

const Screen = compose<ComposedProps, Props>(
  withProps(({ navigation }: Props) => ({
    id: navigation.getParam("id", "12")
  })),
  graphql(QUERY_ACHIEVEMENT_DETAILS),
  graphql(MUTATION_UPDATE_ACHIEVEMENT),

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
    ({ location }: ComposedProps) => ({
      coordinates: location
    }),
    {
      setCoordinates: ({ coordinates }) => (coords: LocationContext) => ({
        coordinates: coords || coordinates
      })
    }
  ),
  graphql(QUERY_OBJECTIVES_NEARBY, {
    options: ({ coordinates, location }: ComposedProps) => ({
      variables: coordinates || location
    })
  }),
  withUIHelpers,
  validateAchievement
)(AchievementsEdit);

// @ts-ignore
Screen.navigationOptions = {
  tabBarVisible: false,
  title: "Edit Achievement",
  ...HeaderStyle
};

export default Screen;
