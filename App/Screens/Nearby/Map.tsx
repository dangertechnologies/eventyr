import React from "react";
import { View, StyleSheet } from "react-native";
import Map, { Region, Marker } from "react-native-maps";
import { Query, Achievement, Objective } from "graphqlTypes";
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
      data.objectives &&
      data.objectives &&
      data.objectives.edges &&
      data.objectives.edges.length
    ) {
      const boundingBox = calculateRegion(
        data.objectives.edges
          .filter(({ node }) => node && node.lat && node.lng)
          .map(({ node }) => node) as Objective[],
        {}
      );

      this.setState({
        coordinates: boundingBox
          ? boundingBox
          : {
              latitude: this.props.location.lat,
              longitude: this.props.location.lng,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015
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
              latitudeDelta: 0.03,
              longitudeDelta: 0.03
            }
      });
    }
  }

  render() {
    const { data } = this.props;
    const { loading } = data;
    const { achievement } = this.state;

    const objectives: Objective[] = (data.objectives && data.objectives.edges
      ? data.objectives.edges.filter(({ node }) => node).map(({ node }) => node)
      : []) as Objective[];

    console.log({ data, achievement, objectives, state: this.state });

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
          {objectives &&
            objectives.map(
              (node, index) =>
                node.kind === "LOCATION" && node.lat && node.lng ? (
                  <Marker
                    title={node.tagline}
                    pinColor={objectiveColors[index % 100]}
                    onPress={() =>
                      this.setState({ achievement: node.achievements[0] })
                    }
                    coordinate={{
                      latitude: node.lat,
                      longitude: node.lng
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

const styles = EStyleSheet.create({});

const Screen = compose(
  withLocation(),
  graphql(
    gql`
      query ObjectivesNearby($lat: Float!, $lng: Float!) {
        objectives(near: [$lat, $lng]) {
          edges {
            node {
              tagline
              lat
              lng
              kind

              achievements {
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
          }
        }
      }
    `,
    {
      options: ({ location }: Props) => ({ variables: location })
    }
  )
)(AchievementsView);

Screen.navigationOptions = {
  tabBarVisible: true,
  headerMode: "float",
  headerTransparent: true,
  title: "Nearby",
  tabLabel: "Nearby",
  headerStyle: {
    backgroundColor: "transparent",
    borderBottomWidth: 0
  }
};

export default Screen;
