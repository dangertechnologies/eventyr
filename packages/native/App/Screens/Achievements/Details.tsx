import React from "react";
import { View, StyleSheet } from "react-native";
import Map, { Region } from "react-native-maps";
import { Query, Achievement } from "@eventyr/graphql";
import { ApolloQueryResult } from "apollo-client";
import { compose, graphql } from "react-apollo";
import { withProps } from "recompose";
import MapMarker from "App/Components/MapMarker";

// @ts-ignore
import EStyleSheet from "react-native-extended-stylesheet";

import objectiveColors from "../../Components/AchievementForm/Colors";

import withLocation, { LocationContext } from "App/Providers/LocationProvider";

import DetailsView from "../../Components/Achievement/Drawer";
import Drawer from "App/Components/Drawer";

import { NavigationState, NavigationScreenProp } from "react-navigation";

import QUERY_ACHIEVEMENT_DETAILS from "@eventyr/graphql/Queries/Achievements/Details";
import { Objective } from "@eventyr/graphql";
import HeaderStyle from "../../Navigation/HeaderStyle";

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
  hasBeenZoomed: boolean = false;

  componentDidMount() {
    if (this.map) {
      this.map.fitToElements(true);
    }

    if (
      this.props.data &&
      this.props.data.achievement &&
      this.props.navigation.getParam("title") !==
        this.props.data.achievement.name
    ) {
      this.props.navigation.setParams({
        title: this.props.data.achievement.name
      });
    }
  }

  componentDidUpdate() {
    if (this.map && !this.hasBeenZoomed) {
      this.hasBeenZoomed = true;
      this.map.fitToElements(true);
    }

    if (
      this.props.data &&
      this.props.data.achievement &&
      this.props.navigation.getParam("title") !==
        this.props.data.achievement.name
    ) {
      this.props.navigation.setParams({
        title: this.props.data.achievement.name
      });
    }
  }

  render() {
    const { data } = this.props;
    const { achievement } = data;
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
          followsUserLocation
          showsUserLocation
          showsMyLocationButton
        >
          {achievement &&
            achievement.objectives.map(
              (objective, index) =>
                objective.kind === "LOCATION" &&
                objective.lat &&
                objective.lng ? (
                  <MapMarker
                    objective={objective}
                    pinColor={objectiveColors[index % 100]}
                    key={objective.id}
                  />
                ) : null
            )}
        </Map>
        {!achievement ? null : (
          <Drawer snapTo={[160, "50%", "75%"]}>
            <DetailsView
              id={achievement.id}
              onPressObjective={(objective: Objective) =>
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
    color: "$colorPrimary"
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
  title: "Details",
  ...HeaderStyle
};

export default Screen;
