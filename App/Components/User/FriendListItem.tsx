import React from "react";
import { Left, ListItem, Body, H3, Thumbnail, Icon } from "native-base";
import EStyleSheet from "react-native-extended-stylesheet";
import { User } from "App/Types/GraphQL";
import RemoteImage from "App/Components/RemoteImage";

interface Props {
  selected?: boolean;
  selectable?: boolean;
  friendable?: boolean;
  user: User;
  onSelect(user: User): any;
  onAddFriend(user: User): any;
}

const UserListItem = ({
  selected,
  selectable,
  user,
  onAddFriend,
  onSelect
}: Props) => (
  <ListItem
    icon
    noIndent
    onPress={() => {
      if (user.isFriend && selectable) {
        onSelect(user);
      } else if (!user.isPendingFriend && !user.isFriend) {
        onAddFriend(user);
      }
    }}
    selected={selected}
  >
    <Left>
      <RemoteImage
        style={styles.avatar}
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

      {user.isFriend &&
        selectable && (
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

      {user.isPendingFriend ? (
        <Icon
          name="check"
          style={{
            fontSize: EStyleSheet.value("$sizeH3"),
            color: EStyleSheet.value("$colorDisabled") as string
          }}
        />
      ) : (
        <Icon
          name="plus"
          style={{
            fontSize: EStyleSheet.value("$sizeH3"),
            color: EStyleSheet.value("$colorDisabled") as string
          }}
        />
      )}
    </Body>
  </ListItem>
);

const styles = EStyleSheet.create({
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15
  }
});

export default UserListItem;
