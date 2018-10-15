import React from "react";
import { Left, ListItem, Body, H3, Thumbnail, Icon } from "native-base";
import EStyleSheet from "react-native-extended-stylesheet";
import Config from "../../../app.json";
import { User } from "App/Types/GraphQL";

interface Props {
  selected?: boolean;
  selectable?: boolean;
  user: User;
  onPress(user: User): any;
}

const UserListItem = ({ selected, selectable, user, onPress }: Props) => (
  <ListItem icon noIndent onPress={() => onPress(user)} selected={selected}>
    <Left>
      <Thumbnail
        small
        source={{
          uri: `${__DEV__ ? "http://" : "https://"}${Config.baseUrl}${
            user.avatar
          }`
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
