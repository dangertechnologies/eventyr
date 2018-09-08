import React from "react";
import { View, StyleSheet } from "react-native";
import Map, { Region, Marker } from "react-native-maps";
import { Query, Category, Mode } from "graphqlTypes";
import { ApolloQueryResult } from "apollo-client";
import { compose, graphql, MutateProps } from "react-apollo";
import { omit } from "lodash";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import objectiveColors from "../../../Components/AchievementForm/Colors";
import { withUIHelpers, UIContext } from "../../../Providers/UIProvider";

import withLocation, {
  LocationContext
} from "../../../Providers/LocationProvider";

import AchievementForm, {
  ProtoAchievement
} from "../../../Components/AchievementForm/Form";

import Drawer from "../../../Components/Drawer/Drawer";

import gql from "graphql-tag";
import { NavigationScreenProp, NavigationState } from "react-navigation";

interface Props extends MutateProps {
  data: Query & ApolloQueryResult<Query> & { error: string };
  navigation: NavigationScreenProp<NavigationState>;
  ui: UIContext;
  location: LocationContext;
}

interface State {
  achievement: ProtoAchievement;
  coordinates: Region | null;
}

const CROSSHAIR_SIZE = 20;

class AchievementsCreate extends React.Component<Props, State> {
  state: State = {
    achievement: {
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
    },
    coordinates: null
  };

  setField = <Field extends keyof ProtoAchievement>(
    field: Field,
    value: ProtoAchievement[Field]
  ) => {
    console.log({ name: "AchievementsCreate#setField", field, value });
    this.setState({
      achievement: {
        ...this.state.achievement,
        [field]: value
      }
    });
  };

  createAchievement = (model: ProtoAchievement) => {
    console.log({ model });

    const { objectives } = model;
    const mode = model.mode as Mode;
    const category = model.category as Category;

    const protoAchievement = {
      ...omit(model, ["id", "category", "mode"]),
      categoryId: parseInt(category && category.id ? category.id : "0", 10),
      modeId: parseInt(mode.id, 10),
      description: model.fullDescription,
      objectives: objectives.map(o => ({
        ...omit(o, ["achievements", "isPublic", "altitude", "id"]),
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
        const { errors, achievement } = data.createAchievement;

        // TODO: Handle errors here by showing an error notification
        this.props.ui.notifySuccess("Saved").then(() =>
          this.props.navigation.navigate("DetailsScreen", {
            id: achievement.id
          })
        );
      });
  };

  render() {
    console.log({ name: "AchievementsCreate#render", state: this.state });
    return (
      <View style={{ flex: 1 }}>
        <Map
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: this.props.location.lat,
            longitude: this.props.location.lng,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15
          }}
          onRegionChangeComplete={(region: Region) =>
            this.setState({ coordinates: region })
          }
        >
          {this.state.achievement &&
            this.state.achievement.objectives.map(
              (objective, index) =>
                objective.kind === "LOCATION" &&
                objective.lat &&
                objective.lng ? (
                  <Marker
                    title={objective.tagline}
                    pinColor={objectiveColors[index % 100]}
                    coordinate={{
                      latitude: objective.lat,
                      longitude: objective.lng
                    }}
                  />
                ) : null
            )}
        </Map>
        <View pointerEvents="none" style={styles.crosshairContainer}>
          <Icon
            style={styles.crosshair}
            name="crosshairs"
            size={CROSSHAIR_SIZE}
          />
        </View>

        <Drawer>
          <AchievementForm
            initialModel={this.state.achievement}
            coordinates={this.state.coordinates}
            onSubmit={this.createAchievement}
          />
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

const Screen = compose(
  withLocation(),
  graphql(gql`
    mutation CreateAchievement(
      $name: String!
      $description: String!
      $objectives: [ObjectiveInput!]!
      $icon: String!
      $categoryId: Int!
      $modeId: Int!
    ) {
      createAchievement(
        input: {
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
  withUIHelpers
)(AchievementsCreate);

Screen.navigationOptions = {
  tabBarVisible: false,
  headerMode: "float",
  headerTransparent: true,
  title: "New Achievement",
  headerStyle: {
    backgroundColor: "transparent",
    borderBottomWidth: 0
  }
};

export default Screen;
