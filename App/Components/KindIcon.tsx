import React from "react";

import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Kind } from "../Types/GraphQL";
import { IconProps } from "react-native-vector-icons/Icon";

interface Props extends Omit<IconProps, "name"> {
  kind: Kind;
}

const KindIcon = ({ kind, ...rest }: Props) => {
  let iconName = "flag-variant";

  switch (kind.toLowerCase()) {
    case "action":
      iconName = "run-fast";
      break;
    case "discovery":
      iconName = "binoculars";
      break;
    case "location":
      iconName = "flag-variant";
      break;
    case "route":
      iconName = "map";
      break;
  }

  return <MaterialIcon name={iconName} {...rest} />;
};

export default KindIcon;
