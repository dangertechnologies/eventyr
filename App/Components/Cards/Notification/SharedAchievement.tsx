import React from "react";
import {
  Achievement,
  Notification,
  SharedAchievement
} from "App/Types/GraphQL";
import { compose, withHandlers } from "recompose";
import { graphql, MutationFn } from "react-apollo";

import { Text, Left, Card, CardItem, Button } from "native-base";
import TinyAchievement from "App/Components/Achievement/TinyAchievement";
import notificationTitle from "App/Helpers/notificationTitle";

import EStyleSheet from "react-native-extended-stylesheet";

import MUTATE_REJECT_SHARED_ACHIEVEMENT, {
  updateQueries as afterReject
} from "App/GraphQL/Mutations/Share/RejectAchievement";
import RemoteImage from "App/Components/RemoteImage";
import {
  withNavigation,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";

interface Props {
  item: Notification;
}

interface ComposedProps extends Props {
  navigation: NavigationScreenProp<NavigationState>;
  mutateAccept: MutationFn;
  mutateReject: MutationFn;
  acceptRequest(): any;
  rejectRequest(): any;
}

const SharedAchievementNotification = ({
  item,
  navigation,
  rejectRequest
}: ComposedProps) => {
  const target: SharedAchievement = item.target as SharedAchievement;
  const achievement = target.achievement as Achievement;

  const achievementAlreadyInLists = Boolean(
    target.achievement.inLists && target.achievement.inLists.length > 0
  );
  const achievementListsCount = achievementAlreadyInLists
    ? target.achievement.inLists.length
    : 0;

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
      <TinyAchievement achievement={achievement} />
      {achievementAlreadyInLists ? (
        <CardItem style={styles.actions}>
          <Button transparent small disabled>
            <Text>{`Already in your lists (${
              target.achievement.inLists[0].title
            }${
              achievementListsCount > 1
                ? ` +${achievementListsCount - 1} more`
                : ""
            })`}</Text>
          </Button>
        </CardItem>
      ) : (
        <CardItem style={styles.actions}>
          <Button transparent small onPress={rejectRequest}>
            <Text>Decline</Text>
          </Button>
          <Button
            transparent
            small
            onPress={() =>
              navigation.navigate("AddToLists", {
                achievementIds: [achievement.id]
              })
            }
          >
            <Text>Add to List</Text>
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
  graphql(MUTATE_REJECT_SHARED_ACHIEVEMENT, { name: "mutateReject" }),
  withNavigation,
  withHandlers({
    rejectRequest: ({ mutateReject, item }: ComposedProps) => () =>
      mutateReject({
        variables: { id: item.target.id },
        // @ts-ignore
        updateQueries: afterReject
      })
  })
)(SharedAchievementNotification);
