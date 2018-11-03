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

const { Provider, Consumer } = React.createContext(DEFAULT_CONTEXT);

interface State extends LocationContext {}

class LocationProvider extends React.Component<{}, State> {
  watchId: number | null = null;
  state: State = { ...DEFAULT_CONTEXT };

  private extractPosition = (position: GeolocationReturnType) => {
    if (position && position.coords) {
      console.log({ name: "LocationProvider#extract", value: position });
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
        alt: position.coords.altitude,
        timestamp: position.timestamp
      });
    }
  };

  private geoLocationError = (error: GeolocationError) => console.warn(error);

  componentDidMount() {
    navigator.geolocation.requestAuthorization();
    this.watchId = navigator.geolocation.watchPosition(
      this.extractPosition,
      this.geoLocationError,
      {
        maximumAge: 60 * 1000, // Maximum one minute old cache
        enableHighAccuracy: true,
        distanceFilter: 15
      }
    );
  }

  componentWillUnmount() {
    if (this.watchId !== null) {
      console.log({ name: "LocationProvider#unmount", value: this.watchId });
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

const withLocation = (options: LocationOptions = { watch: false }) => <
  P extends object
>(
  Component: React.ComponentType<P & { location: LocationContext }>
) => (props: P) => (
  <Consumer>
    {location => <Component {...props} location={location} />}
  </Consumer>
);

export { LocationProvider as Provider, withLocation, Consumer };
export default withLocation;
