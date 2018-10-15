import React from "react";
import { FriendRequest, Notification } from "App/Types/GraphQL";

import { Text, Left, Card, CardItem, Button } from "native-base";
import RemoteImage from "App/Components/RemoteImage";

import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  item: Notification;
}

const FriendRequestNotification = ({ item }: Props) => {
  const target: FriendRequest = item.target as FriendRequest;

  return (
    <Card>
      <CardItem>
        {item.sender &&
          item.sender.avatar && (
            <RemoteImage
              source={{ uri: item.sender.avatar }}
              style={styles.avatar}
            />
          )}
        <Left>
          <Text note>
            {`${item.sender && item.sender.name} wants to be your friend`}
          </Text>
        </Left>
      </CardItem>
      {target.message && (
        <CardItem>
          <Left>
            <Text note>{target.message}</Text>
          </Left>
        </CardItem>
      )}
      <CardItem style={styles.actions}>
        <Button transparent small>
          <Text>Decline</Text>
        </Button>
        <Button transparent small>
          <Text>Accept</Text>
        </Button>
      </CardItem>
    </Card>
  );
};

const styles = EStyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },

  // Notification
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20
  }
});

export default FriendRequestNotification;
