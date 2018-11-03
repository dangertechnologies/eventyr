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
import { withStateHandlers, defaultProps } from "recompose";
import { omit, pick } from "lodash";
import { compose, graphql, MutationResult } from "react-apollo";
import validateAchievement from "App/Components/AchievementForm/Validate";

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
} from "App/Types/GraphQL";
import { EditableObjective, ProtoAchievement } from "App/Types/Prototypes";
import { ApolloQueryResult } from "apollo-client";
import { Region } from "react-native-maps";
import { MutateProps } from "react-apollo";
import { ReformedProps, ExternalProps } from "react-reformed";
import { ValidationProps } from "react-reformed/lib/validateSchema";
import { LocationContext } from "App/Providers/LocationProvider";
import { UIContext } from "App/Providers/UIProvider";

/** GRAPHQL **/
import MUTATION_CREATE_ACHIEVEMENT from "../../GraphQL/Mutations/Achievements/Create";
import QUERY_NEARBY_OBJECTIVES from "../../GraphQL/Queries/Achievements/ObjectivesNearby";
import HeaderStyle from "../../Navigation/HeaderStyle";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

type ComposedProps = Props &
  MutateProps &
  ReformedProps<Achievement | ProtoAchievement> &
  ValidationProps<Achievement | ProtoAchievement> &
  ExternalProps<Achievement | ProtoAchievement> & {
    data: Query & ApolloQueryResult<Query> & { error: string };
    validationErrors: Array<string>;
    ui: UIContext;
    location: LocationContext;
    coordinates: Region;
    setCoordinates(region?: Region): any;
  };

const CROSSHAIR_SIZE = 20;

class AchievementsCreate extends React.PureComponent<ComposedProps> {
  componentDidMount() {
    this.props.setCoordinates();
  }

  createAchievement = (model: ProtoAchievement) => {
    console.log({ model });

    const { objectives } = model;
    const mode = model.mode as Mode;
    const category = model.category as Category;

    const protoAchievement = {
      ...omit(model, ["id", "category", "mode"]),
      categoryId: parseInt(category && category.id ? category.id : "0", 10),
      mode,
      icon: model.icon.replace("-", "_"),
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
        const { errors, achievement } = data.createAchievement;

        if (errors && errors.length) {
          this.props.ui.notifyError(errors[0]);
        } else {
          // TODO: Handle errors here by showing an error notification
          this.props.ui.notifySuccess("Saved").then(() =>
            this.props.navigation.navigate("DetailsScreen", {
              id: achievement.id
            })
          );
        }
      });
  };

  map: Map | null = null;

  render() {
    const { data } = this.props;
    const model = this.props.model as ProtoAchievement;

    const currentObjectives: Array<EditableObjective | Objective> =
      model.objectives || [];

    const nearbyObjectives =
      data.objectives && data.objectives.edges
        ? data.objectives.edges.filter(
            ({ node }) =>
              node &&
              !currentObjectives.some(
                (o: any) => node.id && o.id && o.id === node.id
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
          initialRegion={{
            ...pick(this.props.location, ["latitude", "longitude"]),
            latitudeDelta: 0.03,
            longitudeDelta: 0.03
          }}
          onRegionChangeComplete={this.props.setCoordinates}
          followsUserLocation
          showsUserLocation
          showsMyLocationButton
        >
          {/* Show existing objectives and allow user to add existing 
               objectives to the achievement */}
          {nearbyObjectives &&
            nearbyObjectives.map(
              ({ node }) =>
                node && (
                  <MapMarker
                    key={node.id}
                    objective={node}
                    calloutIcon="plus"
                    color="#333333"
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
                    draggable={objective.id === ""}
                    onDragEnd={(e: any) => {
                      this.props.setProperty(
                        "objectives",
                        model.objectives.map(
                          (editableObjective: EditableObjective) => {
                            if (objective.id === editableObjective.id) {
                              return {
                                ...editableObjective,
                                lat: e.nativeEvent.coordinate.latitude,
                                lng: e.nativeEvent.coordinate.longitude
                              };
                            }
                            return editableObjective;
                          }
                        )
                      );
                    }}
                  />
                )
            )}
        </Map>
        <View pointerEvents="none" style={styles.crosshairContainer}>
          <Icon
            style={styles.crosshair}
            name="crosshairs"
            type="MaterialCommunityIcons"
          />
        </View>

        {this.props.navigation.isFocused() && (
          <Drawer
            snapTo={[-1, "35%", "70%"]}
            initialSnapIndex={2}
            onOutOfScreen={() =>
              this.props.navigation.navigate("AchievementsScreen")
            }
          >
            <AchievementForm
              onChange={(field, value) => {
                if (field === "name") {
                  this.props.navigation.setParams({ title: value });
                }
                this.props.setProperty(field, value);
              }}
              validationErrors={this.props.validationErrors}
              achievement={this.props.model}
              coordinates={this.props.coordinates}
              onSubmit={this.createAchievement}
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
          </Drawer>
        )}
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
    color: "$colorPrimary",
    fontSize: 20
  }
});

const Screen = compose(
  withLocation(),

  graphql(MUTATION_CREATE_ACHIEVEMENT),
  withUIHelpers,
  withStateHandlers(
    {
      coordinates: null
    },
    {
      // @ts-ignore
      setCoordinates: (_: any, { location }) => (coordinates: Region) => ({
        coordinates: coordinates || location
      })
    }
  ),
  graphql(QUERY_NEARBY_OBJECTIVES, {
    options: ({ coordinates, location }: ComposedProps) => ({
      variables: coordinates || location
    })
  }),
  defaultProps({
    initialModel: {
      name: "",
      shortDescription: "",
      fullDescription: "",
      icon: "binoculars",
      basePoints: 10,
      mode: "EASY",
      category: null,
      type: null,
      objectives: [],
      expires: null,
      isMultiPlayer: false,
      isGlobal: false,
      requestReview: false
    }
  }),
  reformed<ProtoAchievement>(),
  validateAchievement
)(AchievementsCreate);

Screen.navigationOptions = {
  tabBarVisible: false,
  title: "New Achievement",
  ...HeaderStyle
};

export default Screen;
