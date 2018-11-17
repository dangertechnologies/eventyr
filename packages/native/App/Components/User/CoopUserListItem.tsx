import React from "react";
import { Left, ListItem, Body, H3, Icon } from "native-base";
import EStyleSheet from "react-native-extended-stylesheet";
import { User } from "@eventyr/graphql";

import RemoteImage from "App/Components/RemoteImage";

interface Props {
  selected?: boolean;
  selectable?: boolean;
  user: User;
  onPress(user: User): any;
}

const UserListItem = ({ selected, selectable, user, onPress }: Props) => (
  <ListItem icon noIndent onPress={() => onPress(user)} selected={selected}>
    <Left>
      <RemoteImage
        source={{
          uri: user.avatar as string
        }}
      />
    </Left>
    <Body
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <H3>{user.name}</H3>

      {selectable && (
        <Icon
          name={
            !selected
              ? "checkbox-blank-circle-outline"
              : "checkbox-marked-circle"
          }
          style={{
            fontSize: EStyleSheet.value("$sizeH2"),
            color: selected
              ? (EStyleSheet.value("$colorSuccess") as string)
              : (EStyleSheet.value("$colorDisabled") as string)
          }}
        />
      )}
    </Body>
  </ListItem>
);

export default UserListItem;
