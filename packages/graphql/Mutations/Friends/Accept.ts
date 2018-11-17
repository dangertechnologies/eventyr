import gql from "graphql-tag";
import {
  AchievementEdge,
  Query,
  NotificationEdge
} from "../../../Types/GraphQL";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  UserNotifications: (
    previous: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    // Find Notifications containing this CoopRequest and update it
    const { data } = mutationResult;

    if (
      data &&
      data.acceptFriend &&
      data.acceptFriend.friendRequest &&
      previous &&
      previous.notifications &&
      previous.notifications.edges
    ) {
      previous.notifications.edges = previous.notifications.edges.map(
        (notificationEdge: NotificationEdge) => {
          if (
            notificationEdge.node &&
            notificationEdge.node.targetType === "FriendRequest" &&
            notificationEdge.node.target.id ===
              data.acceptFriend.friendRequest.id
          ) {
            notificationEdge.node = Object.assign({}, notificationEdge.node, {
              target: Object.assign(
                {},
                notificationEdge.node.target,
                data.acceptFriend.friendRequest
              )
            });

            console.log("Updated friendRequest");
            console.log(notificationEdge);
          }
          return notificationEdge;
        }
      );
    }

    return previous;
  }
};
export default gql`
  mutation AcceptCoopRequest($id: String!) {
    acceptFriend(input: { id: $id }) {
      friendRequest {
        id
        message
        isAccepted
        createdAt
        receiver {
          id
          email
        }
      }
      errors
    }
  }
`;
