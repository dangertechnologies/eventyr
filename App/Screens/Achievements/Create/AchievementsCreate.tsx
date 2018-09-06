import React from "react";
import { View, StyleSheet } from "react-native";
import Map, { Region, Marker } from "react-native-maps";
import { Query } from "graphqlTypes";
import { ApolloQueryResult } from "apollo-client";
import { compose, graphql } from "react-apollo";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import objectiveColors from "../../../Components/AchievementForm/Colors";

import withLocation, {
  LocationContext
} from "../../../Providers/LocationProvider";

import AchievementForm, {
  ProtoAchievement
} from "../../../Components/AchievementForm/Form";
import gql from "graphql-tag";

interface Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
  location: LocationContext;
}

interface State {
  achievement: ProtoAchievement;
  coordinates: Region | null;
  expandedForm: boolean;
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
    expandedForm: false,
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

  expandForm = () => this.setState({ expandedForm: true });
  minimizeForm = () => this.setState({ expandedForm: false });

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
        <AchievementForm
          onExpand={this.expandForm}
          onMinimize={this.minimizeForm}
          expanded={this.state.expandedForm}
          initialModel={this.state.achievement}
          coordinates={this.state.coordinates}
        />
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
      $name: String!,
      $description: String!,
      $objectives: Objective[],
      $icon: String!,
      $categoryId: Int!,
      $modeId: Int!,
      $typeId: Int!
    ) {
      createAchievement(input: {name: $name, description: $description, icon: $icon, modeId: $modeId, categoryId: $categoryId, objectives: $objectives}) {
    achievement {
      name
      shortDescription
      fullDescription
      author {
        name
      }
      
      isMultiPlayer
      category{
        title
        icon
      }
      
      points
      
      
      objectives{
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
  `)
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
