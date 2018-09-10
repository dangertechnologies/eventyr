import React from "react";
import { View, StyleSheet } from "react-native";
import Map, { Region, Marker } from "react-native-maps";
import { Query, Achievement } from "App/Types/GraphQL";
import { ApolloQueryResult } from "apollo-client";
import { compose, graphql } from "react-apollo";
import { withProps } from "recompose";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import objectiveColors from "../../Components/AchievementForm/Colors";

import withLocation, { LocationContext } from "App/Providers/LocationProvider";

import DetailsView from "App/Components/AchievementForm/DetailsView";
import Drawer from "App/Components/Drawer";

import { NavigationState, NavigationScreenProp } from "react-navigation";

import QUERY_ACHIEVEMENT_DETAILS from "../../GraphQL/Achievements/Details";

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
          ref={map => {
            this.map = map;
          }}
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
  graphql(QUERY_ACHIEVEMENT_DETAILS),
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
