import { Region } from "react-native-maps";

export type Location = {
  lat: number | null;
  lng: number | null;
};

export interface Options {
  latPadding?: number;
  longPadding?: number;
}

export const calculateRegion = (
  locations: Array<Location>,
  options: Options
): Region | undefined => {
  const latPadding = options && options.latPadding ? options.latPadding : 0.1;
  const longPadding =
    options && options.longPadding ? options.longPadding : 0.1;
  const mapLocations = locations.filter(({ lat, lng }) => lat && lng);

  // Only do calculations if there are locations
  if (mapLocations.length > 0) {
    let allLatitudes = mapLocations.map((l: Location) => l.lat) as Array<
      number
    >;
    let allLongitudes = mapLocations.map((l: Location) => l.lng) as Array<
      number
    >;

    let minLat = Math.min(...allLatitudes);
    let maxLat = Math.max(...allLatitudes);
    let minLong = Math.min(...allLongitudes);
    let maxLong = Math.max(...allLongitudes);

    let middleLat = (minLat + maxLat) / 2;
    let middleLong = (minLong + maxLong) / 2;
    let latDelta = maxLat - minLat + latPadding;
    let longDelta = maxLong - minLong + longPadding;

    // return markers
    return {
      latitude: middleLat,
      longitude: middleLong,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta
    };
  }
};

export default calculateRegion;
