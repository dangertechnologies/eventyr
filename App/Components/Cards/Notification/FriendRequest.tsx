import React from "react";
import { graphql, MutationFn } from "react-apollo";
import { compose, withHandlers } from "recompose";

import { Text, Left, Card, CardItem, Button } from "native-base";
import RemoteImage from "App/Components/RemoteImage";
import notificationTitle from "App/Helpers/notificationTitle";
import EStyleSheet from "react-native-extended-stylesheet";

import { FriendRequest, Notification } from "App/Types/GraphQL";
import MUTATE_ACCEPT_FRIEND_REQUEST, {
  updateQueries as afterAccept
} from "App/GraphQL/Mutations/Friends/Accept";
import MUTATE_REJECT_FRIEND_REQUEST, {
  updateQueries as afterReject
} from "App/GraphQL/Mutations/Friends/Reject";

interface Props {
  item: Notification;
}

interface ComposedProps extends Props {
  mutateAccept: MutationFn;
  mutateReject: MutationFn;
  acceptRequest(): any;
  rejectRequest(): any;
}

const FriendRequestNotification = ({
  item,
  acceptRequest,
  rejectRequest
}: ComposedProps) => {
  const target: FriendRequest = item.target as FriendRequest;

  const { title } = notificationTitle(item);

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
            <Text note>{title}</Text>
          </Text>
        </Left>
      </CardItem>
      {!target.message ? null : (
        <CardItem>
          <Left>
            <Text note>{target.message}</Text>
          </Left>
        </CardItem>
      )}
      {target.isAccepted === true ? (
        <CardItem style={styles.actions}>
          <Button transparent small disabled>
            <Text>Accepted</Text>
          </Button>
        </CardItem>
      ) : (
        <CardItem style={styles.actions}>
          <Button transparent small onPress={rejectRequest}>
            <Text>Decline</Text>
          </Button>
          <Button transparent small onPress={acceptRequest}>
            <Text>Accept</Text>
          </Button>
        </CardItem>
      )}
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

export default compose<ComposedProps, Props>(
  graphql(MUTATE_ACCEPT_FRIEND_REQUEST, { name: "mutateAccept" }),
  graphql(MUTATE_REJECT_FRIEND_REQUEST, { name: "mutateReject" }),
  withHandlers({
    acceptRequest: ({ mutateAccept, item }: ComposedProps) => () =>
      mutateAccept({
        variables: { id: item.target.id },
        // @ts-ignore
        updateQueries: afterAccept
      }),
    rejectRequest: ({ mutateReject, item }: ComposedProps) => () =>
      mutateReject({
        variables: { id: item.target.id },
        // @ts-ignore
        updateQueries: afterReject
      })
  })
)(FriendRequestNotification);
