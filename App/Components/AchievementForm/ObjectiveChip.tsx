import React from "react";
import { Button, Text, Icon } from "native-base";
import { EditableObjective } from "./ProtoObjectiveDialog";

interface Props extends React.ClassAttributes<Button> {
  objective: EditableObjective;
  color?: string;
}

const ObjectiveChip = ({ objective, color, ...rest }: Props) => (
  <Button
    rounded
    small
    iconLeft
    style={!color ? {} : { backgroundColor: color, margin: 2 }}
    {...rest}
  >
    <Icon
      name={
        objective.kind && objective.kind === "LOCATION" ? "run" : "flag-variant"
      }
      type="MaterialCommunityIcons"
      color="#FFFFFF"
      fontSize={20}
    />
    <Text>{objective.tagline}</Text>
  </Button>
);

export default ObjectiveChip;
