import React from "react";
import { GeolocationReturnType, GeolocationError } from "react-native";

declare var navigator: any;
export interface LocationContext {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  timestamp: number;
  alt: number | null;
}

const DEFAULT_CONTEXT: LocationContext = {
  latitude: 59.9169,
  longitude: 10.7276,
  alt: 0,
  timestamp: new Date().getTime()
};

export interface LocationOptions {
  watch?: boolean;
}

interface State extends LocationContext {
  watchId: number | null;
}

const withLocation = (options: LocationOptions = { watch: false }) => <
  P extends object
>(
  Component: React.ComponentType<P & { location: LocationContext }>
) =>
  class LocationProvider extends React.Component<P, State> {
    state: State = { ...DEFAULT_CONTEXT, watchId: null };

    componentWillMount() {
      navigator.geolocation.requestAuthorization();
      if (options.watch) {
        navigator.geolocation.watchPosition(
          (position: GeolocationReturnType) =>
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
              alt: position.coords.altitude,
              timestamp: position.timestamp
            }),
          (error: GeolocationError) => console.warn(error),
          {
            maximumAge: 60 * 1000, // Maximum one minute old cache
            enableHighAccuracy: true,
            distanceFilter: 50
          }
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationReturnType) =>
            position &&
            position.coords &&
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
              alt: position.coords.altitude,
              timestamp: position.timestamp
            }),
          (error: GeolocationError) => console.warn(error),
          {
            maximumAge: 60 * 1000, // Maximum one minute old cache
            enableHighAccuracy: true
          }
        );
      }
    }

    render() {
      return <Component {...this.props} location={this.state} />;
    }
  };

export default withLocation;
