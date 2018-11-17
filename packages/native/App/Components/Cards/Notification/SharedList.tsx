import React from "react";
import { Notification, SharedList, List } from "@eventyr/graphql";
import { compose, withHandlers } from "recompose";
import { graphql, MutationFn } from "react-apollo";

import { Text, Left, Card, CardItem, Button } from "native-base";
import TinyList from "App/Components/List/TinyList";
import notificationTitle from "App/Helpers/notificationTitle";

import EStyleSheet from "react-native-extended-stylesheet";

import MUTATE_ACCEPT_SHARED_LIST, {
  updateQueries as afterAccept
} from "@eventyr/graphql/Mutations/Lists/Follow";

import MUTATE_REJECT_SHARED_LIST, {
  updateQueries as afterReject
} from "@eventyr/graphql/Mutations/Share/RejectList";

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

const SharedListNotification = ({
  item,
  rejectRequest,
  acceptRequest
}: ComposedProps) => {
  const target: SharedList = item.target as SharedList;
  const list = target.list as List;

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
      <TinyList list={list} />
      {list.isFollowed ? (
        <CardItem style={styles.actions}>
          <Button transparent small disabled>
            <Text>{`You already follow this list`}</Text>
          </Button>
        </CardItem>
      ) : (
        <CardItem style={styles.actions}>
          <Button transparent small onPress={rejectRequest}>
            <Text>Decline</Text>
          </Button>
          <Button transparent small onPress={acceptRequest}>
            <Text>Follow</Text>
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
  graphql(MUTATE_REJECT_SHARED_LIST, { name: "mutateReject" }),
  graphql(MUTATE_ACCEPT_SHARED_LIST, { name: "mutateAccept" }),
  withHandlers({
    rejectRequest: ({ mutateReject, item }: ComposedProps) => () =>
      mutateReject({
        variables: { id: item.target.id },
        // @ts-ignore
        updateQueries: afterReject
      }),
    acceptRequest: ({ mutateAccept, item }: ComposedProps) => () =>
      mutateAccept({
        variables: { listId: (item.target as SharedList).list.id },
        // @ts-ignore
        updateQueries: afterAccept,
        refetchQueries: ["UserLists"]
      })
  })
)(SharedListNotification);
