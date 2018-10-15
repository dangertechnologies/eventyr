import React from "react";
import { CoopRequest, Achievement, Notification } from "App/Types/GraphQL";
import { compose, withHandlers } from "recompose";
import { graphql, MutationFn } from "react-apollo";

import { Text, Left, Card, CardItem, Button } from "native-base";
import TinyAchievement from "App/Components/Achievement/TinyAchievement";

import EStyleSheet from "react-native-extended-stylesheet";

import MUTATE_ACCEPT_COOP_REQUEST, {
  updateQueries as afterAccept
} from "App/GraphQL/Mutations/Coop/Accept";
import MUTATE_REJECT_COOP_REQUEST, {
  updateQueries as afterReject
} from "App/GraphQL/Mutations/Coop/Reject";
import RemoteImage from "App/Components/RemoteImage";

interface Props {
  item: Notification;
}

interface ComposedProps extends Props {
  mutateAccept: MutationFn;
  mutateReject: MutationFn;
  acceptRequest(): any;
  rejectRequest(): any;
}

const CoopRequestNotification = ({
  item,
  acceptRequest,
  rejectRequest
}: ComposedProps) => {
  const target: CoopRequest = item.target as CoopRequest;
  const achievement = target.achievement as Achievement;
  console.log({ item, target });

  let title;

  if (item.kind === "COOPERATION_REQUEST_ACCEPTED") {
    title = "accepted your cooperation request";
  } else {
    title = "wants to cooperate";
  }

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
          <Text note>{`${item.sender && item.sender.name} ${title}`}</Text>
        </Left>
      </CardItem>
      {!target.message ? null : (
        <CardItem>
          <Left>
            <Text note>{target.message}</Text>
          </Left>
        </CardItem>
      )}
      <TinyAchievement achievement={achievement} />
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
  graphql(MUTATE_ACCEPT_COOP_REQUEST, { name: "mutateAccept" }),
  graphql(MUTATE_REJECT_COOP_REQUEST, { name: "mutateReject" }),
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
)(CoopRequestNotification);
