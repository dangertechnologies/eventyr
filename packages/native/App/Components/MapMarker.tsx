import React from "react";
import { Objective } from "@eventyr/graphql";
import { Callout, Marker, MarkerProps } from "react-native-maps";
import { OpenMapDirections } from "react-native-navigation-directions";

import { Button, Icon, Text, ActionSheet } from "native-base";

import EStyleSheet from "react-native-extended-stylesheet";
import { EditableObjective } from "App/Types/Prototypes";

interface Props extends Omit<MarkerProps, "coordinate"> {
  objective: Objective | EditableObjective;
  calloutIcon?: string;
  onCalloutPress?(objective?: Objective | EditableObjective): any;
  onPress?(): any;
  color?: string;
}

const MapCallout: React.ComponentType<Props> = ({
  objective,
  color,
  onCalloutPress,
  onPress,
  calloutIcon,
  ...rest
}: Props) =>
  objective && objective.lat && objective.lng ? (
    <Marker
      pinColor={color}
      coordinate={{
        latitude: objective.lat,
        longitude: objective.lng
      }}
      tracksViewChanges={false}
      onPress={onPress}
      {...rest}
    >
      <Callout tooltip>
        <Button
          iconLeft={!!calloutIcon}
          iconRight
          small
          rounded
          style={{ backgroundColor: color || "#333333" }}
          onPress={() =>
            onCalloutPress
              ? onCalloutPress(objective)
              : OpenMapDirections(
                  null,
                  {
                    latitude: objective.lat,
                    longitude: objective.lng
                  },
                  "r"
                )
          }
          onLongPress={() =>
            ActionSheet.show(
              {
                title: objective.tagline,
                options: ["Directions", "Cancel"],
                cancelButtonIndex: 1
              },
              buttonIndex =>
                buttonIndex === 0 &&
                OpenMapDirections(
                  null,
                  {
                    latitude: objective.lat,
                    longitude: objective.lng
                  },
                  "r"
                )
            )
          }
        >
          {calloutIcon && (
            <Icon
              name={calloutIcon}
              type="MaterialCommunityIcons"
              color="#FFFFFF"
            />
          )}
          <Text>{objective.tagline}</Text>

          <Icon name="directions" color="#FFFFFF" />
        </Button>
      </Callout>
    </Marker>
  ) : null;

const styles = EStyleSheet.create({});

export default MapCallout;
