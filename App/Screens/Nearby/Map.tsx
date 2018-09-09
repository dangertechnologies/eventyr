import React from "react";
import { View, StyleSheet, FlatList, NativeSyntheticEvent } from "react-native";
import Map, { Region, Marker } from "react-native-maps";
import { Query, Achievement, Objective } from "graphqlTypes";
import { ApolloQueryResult } from "apollo-client";
import { compose, graphql } from "react-apollo";

import EStyleSheet from "react-native-extended-stylesheet";

import gql from "graphql-tag";
import { NavigationState, NavigationScreenProp } from "react-navigation";
import { Button, Icon, Text } from "native-base";

import objectiveColors from "../../Components/AchievementForm/Colors";

import withLocation, {
  LocationContext
} from "../../Providers/LocationProvider";

import DetailsView from "../../Components/AchievementForm/DetailsView";
import Drawer from "../../Components/Drawer/Drawer";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  data: Query & ApolloQueryResult<Query> & { error: string; loading: boolean };
  location: LocationContext;
}

interface State {
  achievement: Achievement | null;
  coordinates: Region | null;
  objective: Objective | null;
}

class AchievementsView extends React.PureComponent<Props, State> {
  state: State = {
    achievement: null,
    objective: null,
    coordinates: null
  };

  map: Map | null = null;

  componentDidMount() {
    if (this.map) {
      this.map.fitToElements(true);
    }
  }

  componentWillReceiveProps() {
    if (this.map) {
      this.map.fitToElements(true);
    }
  }

  onSelect = (objective: Objective) => {
    if (objective.lat && objective.lng) {
      if (this.map) {
        this.map.animateToCoordinate({
          latitude: objective.lat,
          longitude: objective.lng
        });
      }
      this.setState({
        achievement: objective.achievements[0],
        objective
      });
    }
  };

  onRegionChange = (region: Region) => this.setState({ coordinates: region });

  onMapPress = (e: any) =>
    e.nativeEvent.action !== "marker-press" &&
    this.setState({ achievement: null, objective: null });

  render() {
    const { data } = this.props;
    const { loading } = data;
    const { achievement, objective } = this.state;

    const objectives: Objective[] = (data.objectives && data.objectives.edges
      ? data.objectives.edges.filter(({ node }) => node).map(({ node }) => node)
      : []) as Objective[];

    const visibleObjectives = achievement ? achievement.objectives : objectives;

    console.log({ data, achievement, objectives, state: this.state });

    return (
      <View style={{ flex: 1 }}>
        <Map
          ref={map => {
            this.map = map;
          }}
          style={StyleSheet.absoluteFill}
          initialRegion={this.state.coordinates || undefined}
          region={this.state.coordinates || undefined}
          onPress={this.onMapPress}
          onRegionChangeComplete={this.onRegionChange}
        >
          {visibleObjectives &&
            visibleObjectives.map(
              (node, index) =>
                node.kind === "LOCATION" && node.lat && node.lng ? (
                  <Marker
                    title={node.tagline}
                    key={node.id}
                    pinColor={objectiveColors[index % 100]}
                    onPress={() => !achievement && this.onSelect(node)}
                    coordinate={{
                      latitude: node.lat,
                      longitude: node.lng
                    }}
                  />
                ) : null
            )}
        </Map>
        {!objective ? null : (
          <View style={styles.objectiveDetails}>
            <View style={styles.objectiveDetailsTitleContainer}>
              <Text style={styles.objectiveDetailsTagline}>
                {objective.tagline}
              </Text>
              <Text> is part of...</Text>
            </View>
            <FlatList
              data={objective.achievements || []}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Button
                  iconLeft
                  rounded
                  small
                  transparent
                  style={styles.objectiveDetailsAchievement}
                  onPress={() => this.setState({ achievement: item })}
                >
                  <Icon type="MaterialCommunityIcons" name={item.icon} />
                  <Text>{item.name}</Text>
                </Button>
              )}
            />
          </View>
        )}

        {!achievement ? null : (
          <Drawer maxHeight={500}>
            <DetailsView
              achievement={achievement}
              onPressObjective={objective =>
                objective.lat &&
                objective.lng &&
                this.onRegionChange({
                  latitudeDelta: 0.15,
                  longitudeDelta: 0.15,
                  latitude: objective.lat,
                  longitude: objective.lng
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
  objectiveDetails: { position: "absolute", top: 90, left: "$spacing" },
  objectiveDetailsTitleContainer: {
    flexDirection: "row"
  },
  objectiveDetailsTagline: { fontWeight: "bold" },
  objectiveDetailsAchievement: { $scale: 0.5, margin: "$spacing" }
});

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
