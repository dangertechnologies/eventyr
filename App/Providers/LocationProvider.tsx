import React from "react";
import { GeolocationReturnType, GeolocationError } from "react-native";

declare var navigator: any;
export interface LocationContext {
  lat: number;
  lng: number;
  timestamp: number;
  alt: number | null;
}

const DEFAULT_CONTEXT: LocationContext = {
  lat: 59.9169,
  lng: 10.7276,
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
              lat: position.coords.latitude,
              lng: position.coords.longitude,
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
            this.setState({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
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
