import React from "react";
import { CoopRequest, Achievement, Notification } from "@eventyr/graphql";
import { compose, withHandlers } from "recompose";
import { graphql, MutationFn } from "react-apollo";
import notificationTitle from "App/Helpers/notificationTitle";

import { Text, Left, Card, CardItem, Button } from "native-base";
import TinyAchievement from "App/Components/Achievement/TinyAchievement";

import EStyleSheet from "react-native-extended-stylesheet";

import MUTATE_ACCEPT_COOP_REQUEST, {
  updateQueries as afterAccept
} from "@eventyr/graphql/Mutations/Coop/Accept";
import MUTATE_REJECT_COOP_REQUEST, {
  updateQueries as afterReject
} from "@eventyr/graphql/Mutations/Coop/Reject";
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
          <Text note>{title}</Text>
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
