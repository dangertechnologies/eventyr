import React from "react";

/** PROVIDERS **/
import withLocation from "App/Providers/LocationProvider";

/** COMPONENTS **/
import { View, StyleSheet, FlatList } from "react-native";
import Map from "react-native-maps";
import { Button, Icon, Text } from "native-base";
import MapMarker from "App/Components/MapMarker";
import DetailsView from "App/Components/AchievementForm/DetailsView";
import Drawer from "App/Components/Drawer";

/** UTILS **/
import { compose, graphql } from "react-apollo";
import objectiveColors from "App/Components/AchievementForm/Colors";

/** TYPES **/
import { LocationContext } from "App/Providers/LocationProvider";
import { ApolloQueryResult } from "apollo-client";
import { Query, Achievement, Objective } from "App/Types/GraphQL";
import { Region } from "react-native-maps";
import { NavigationState, NavigationScreenProp } from "react-navigation";

import EStyleSheet from "react-native-extended-stylesheet";

import QUERY_NEARBY_ACHIEVEMENTS from "../../GraphQL/Achievements/AchievementsNearby";

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

    return (
      <View style={{ flex: 1 }}>
        <Map
          ref={map => {
            this.map = map;
          }}
          style={StyleSheet.absoluteFill}
          initialRegion={this.state.coordinates || undefined}
          // region={this.state.coordinates || undefined}
          // onPress={this.onMapPress}
          // onRegionChangeComplete={this.onRegionChange}
        >
          {visibleObjectives &&
            visibleObjectives.map(
              (node, index) =>
                node.kind === "LOCATION" && node.lat && node.lng ? (
                  <MapMarker
                    key={node.id}
                    objective={node}
                    color={objectiveColors[index % 100]}
                    calloutIcon="plus"
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
  graphql(QUERY_NEARBY_ACHIEVEMENTS, {
    options: ({ location }: Props) => ({ variables: location })
  })
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
