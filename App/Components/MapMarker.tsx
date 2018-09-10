import React from "react";
import { Objective } from "App/Types/GraphQL";
import { Callout, Marker } from "react-native-maps";

import { Button, Icon, Text } from "native-base";

import EStyleSheet from "react-native-extended-stylesheet";
import { EditableObjective } from "App/Types/Prototypes";

interface Props {
  objective: Objective | EditableObjective;
  calloutIcon?: string;
  onCalloutPress?(objective?: Objective | EditableObjective): any;
  color?: string;
}

const MapCallout: React.ComponentType<Props> = ({
  objective,
  color,
  onCalloutPress,
  calloutIcon
}: Props) =>
  objective && objective.lat && objective.lng ? (
    <Marker
      pinColor={color}
      coordinate={{
        latitude: objective.lat,
        longitude: objective.lng
      }}
    >
      <Callout tooltip>
        <Button
          iconLeft={!!calloutIcon}
          small
          rounded
          style={{ backgroundColor: color || "#333333" }}
          onPress={() => onCalloutPress && onCalloutPress(objective)}
        >
          {calloutIcon && (
            <Icon
              name={calloutIcon}
              type="MaterialCommunityIcons"
              color="#FFFFFF"
            />
          )}
          <Text>{objective.tagline}</Text>
        </Button>
      </Callout>
    </Marker>
  ) : null;

const styles = EStyleSheet.create({});

export default MapCallout;
