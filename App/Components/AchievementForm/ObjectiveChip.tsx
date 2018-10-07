import React from "react";
import { Button, Text, Icon } from "native-base";
import { EditableObjective } from "App/Types/Prototypes";

import EStyleSheet from "react-native-extended-stylesheet";

interface Props extends React.ClassAttributes<Button> {
  objective: EditableObjective;
  onPress?(): any;
  onLongPress?(): any;
}

const styles = EStyleSheet.create({
  plain: {
    color: "$colorText"
  }
});

const ObjectiveChip = ({ objective, onPress, onLongPress, ...rest }: Props) => (
  <Button
    rounded
    small
    transparent
    iconLeft
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
    <Text style={styles.plain}>{objective.tagline}</Text>
  </Button>
);

export default ObjectiveChip;
