import React from "react";
import { View, StyleSheet } from "react-native";
import Map from "react-native-maps";
import { Query } from "graphqlTypes";
import { compose, graphql } from "react-apollo";
import { ApolloQueryResult } from "apollo-client";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EStyleSheet from "react-native-extended-stylesheet";

import withLocation, {
  LocationContext
} from "../../../Providers/LocationProvider";

import AchievementForm, {
  State as FormState
} from "../../../Components/AchievementForm/Form";

interface Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
  location: LocationContext;
}

interface State {
  achievement: FormState["achievement"] | null;
  coordinates: number[];
}

const CROSSHAIR_SIZE = 20;

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

class AchievementsCreate extends React.Component<Props, State> {
  state: State = {
    achievement: null,
    coordinates: []
  };

  render() {
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
        />
        <View pointerEvents="none" style={styles.crosshairContainer}>
          <Icon
            style={styles.crosshair}
            name="crosshairs"
            size={CROSSHAIR_SIZE}
          />
        </View>
        <AchievementForm
          onChange={(achievement: State["achievement"]) =>
            this.setState({ achievement })
          }
        />
      </View>
    );
  }
}

const Screen = compose(withLocation())(AchievementsCreate);

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
