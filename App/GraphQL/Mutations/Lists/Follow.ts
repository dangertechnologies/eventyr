import gql from "graphql-tag";
import {
  AchievementEdge,
  Query,
  NotificationEdge,
  SharedList
} from "../../../Types/GraphQL";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  UserLists: (
    previous: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    const { data } = mutationResult;

    if (
      data &&
      data.followList &&
      data.followList.list &&
      previous &&
      previous.lists &&
      previous.lists.edges &&
      !previous.lists.edges.some(({ node }) =>
        Boolean(node && node.id === data.followList.list.id)
      )
    ) {
      previous.lists.edges = previous.lists.edges.concat([
        {
          // @ts-ignore
          __typename: "ListEdge",
          node: data.followList.list
        }
      ]);
      console.log({ name: "UserLists#update", value: previous.lists });
    }

    return previous;
  },

  UserNotifications: (
    previous: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    // Find Notifications containing this CoopRequest and update it
    const { data } = mutationResult;

    if (
      data &&
      data.followList &&
      data.followList.list &&
      previous &&
      previous.notifications &&
      previous.notifications.edges
    ) {
      previous.notifications.edges = previous.notifications.edges.map(
        (notificationEdge: NotificationEdge) => {
          if (
            notificationEdge.node &&
            notificationEdge.node.targetType === "SharedList" &&
            (notificationEdge.node.target as SharedList).list.id ===
              data.followList.list.id
          ) {
            notificationEdge.node = Object.assign({}, notificationEdge.node, {
              target: Object.assign({}, notificationEdge.node.target, {
                list: data.followList.list
              })
            });

            console.log({
              name: "UserNotifications#update",
              value: notificationEdge
            });
          }
          return notificationEdge;
        }
      );
    }

    return previous;
  }
};
export default gql`
  mutation FollowList($listId: String!) {
    followList(input: { listId: $listId }) {
      list {
        id
        title
        isFollowed
        achievementsCount
        isEditable
        isPublic
        author {
          id
          name
        }
      }
      errors
    }
  }
`;
