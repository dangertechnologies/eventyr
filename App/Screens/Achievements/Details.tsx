import React from "react";
import { View, StyleSheet } from "react-native";
import Map, { Region, Marker } from "react-native-maps";
import { Query, Achievement } from "graphqlTypes";
import { ApolloQueryResult } from "apollo-client";
import { compose, graphql } from "react-apollo";
import { withProps } from "recompose";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import objectiveColors from "../../Components/AchievementForm/Colors";

import withLocation, {
  LocationContext
} from "../../Providers/LocationProvider";

import DetailsView from "../../Components/AchievementForm/DetailsView";
import Drawer from "../../Components/Drawer/Drawer";

import gql from "graphql-tag";
import { NavigationState, NavigationScreenProp } from "react-navigation";
import calculateRegion from "../../Helpers/Map";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  data: Query & ApolloQueryResult<Query> & { error: string; loading: boolean };
  location: LocationContext;
}

interface State {
  achievement: Achievement | null;
  coordinates: Region | null;
}

const CROSSHAIR_SIZE = 20;

class AchievementsView extends React.PureComponent<Props, State> {
  state: State = {
    achievement: null,
    coordinates: null
  };

  componentDidMount() {
    const { data } = this.props;

    if (
      data.achievement &&
      data.achievement.objectives &&
      data.achievement.objectives.length
    ) {
      const boundingBox = calculateRegion(
        data.achievement.objectives.filter(o => o.lat && o.lng),
        {}
      );

      this.setState({
        coordinates: boundingBox
          ? boundingBox
          : {
              latitude: this.props.location.lat,
              longitude: this.props.location.lng,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15
            }
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { data } = nextProps;

    if (
      data.achievement &&
      data.achievement.objectives &&
      data.achievement.objectives.length
    ) {
      const boundingBox = calculateRegion(
        data.achievement.objectives.filter(o => o.lat && o.lng),
        {}
      );

      this.setState({
        coordinates: boundingBox
          ? boundingBox
          : {
              latitude: this.props.location.lat,
              longitude: this.props.location.lng,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15
            }
      });
    }
  }

  render() {
    const { data } = this.props;
    const { achievement, loading } = data;
    console.log({
      name: "AchievementsCreate#render",
      state: this.state,
      props: this.props
    });
    return (
      <View style={{ flex: 1 }}>
        <Map
          style={StyleSheet.absoluteFill}
          initialRegion={this.state.coordinates || undefined}
          region={this.state.coordinates || undefined}
          onRegionChangeComplete={(region: Region) =>
            this.setState({ coordinates: region })
          }
        >
          {achievement &&
            achievement.objectives.map(
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
        {!achievement ? null : (
          <Drawer>
            <DetailsView
              achievement={achievement}
              onPressObjective={objective =>
                objective.lat &&
                objective.lng &&
                this.setState({
                  coordinates: {
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                    latitude: objective.lat,
                    longitude: objective.lng
                  }
                })
              }
              loading={loading}
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
    color: "$colorSecondary"
  }
});

const Screen = compose(
  withProps(({ navigation }: Props) => ({
    id: navigation.getParam("id", "12")
  })),
  graphql(
    gql`
      query AchievementView($id: String!) {
        achievement(id: $id) {
          id
          name
          shortDescription
          fullDescription
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
          }

          mode {
            id
            name
          }

          type {
            id
            name
          }
        }
      }
    `
  ),
  withLocation()
)(AchievementsView);

Screen.navigationOptions = {
  tabBarVisible: false,
  headerMode: "float",
  headerTransparent: true,
  title: "Details",
  headerStyle: {
    backgroundColor: "transparent",
    borderBottomWidth: 0
  }
};

export default Screen;
