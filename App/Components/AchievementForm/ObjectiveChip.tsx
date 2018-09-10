import React from "react";
import { Button, Text, Icon } from "native-base";
import { EditableObjective } from "App/Types/Prototypes";

interface Props extends React.ClassAttributes<Button> {
  objective: EditableObjective;
  color?: string;
  onPress?(): any;
  onLongPress?(): any;
}

const ObjectiveChip = ({
  objective,
  color,
  onPress,
  onLongPress,
  ...rest
}: Props) => (
  <Button
    rounded
    small
    iconLeft
    style={!color ? {} : { backgroundColor: color, margin: 2 }}
    onPress={onPress}
    onLongPress={onLongPress}
    {...rest}
  >
    <Icon
      name={objective.kind !== "LOCATION" ? "run" : "flag-variant"}
      type="MaterialCommunityIcons"
      color="#FFFFFF"
      fontSize={20}
    />
    <Text>{objective.tagline}</Text>
  </Button>
);

export default ObjectiveChip;
