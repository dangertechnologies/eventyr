import gql from "graphql-tag";
import { Query, NotificationEdge } from "../../../Types/GraphQL";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  UserNotifications: (
    previous: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    // Find Notifications containing this FriendRequest and update it
    const { data } = mutationResult;

    if (
      data &&
      data.rejectFriend &&
      data.rejectFriend.friendRequest &&
      previous &&
      previous.notifications &&
      previous.notifications.edges
    ) {
      previous.notifications.edges = previous.notifications.edges.filter(
        (notificationEdge: NotificationEdge) => {
          if (
            notificationEdge.node &&
            notificationEdge.node.targetType === "FriendRequest" &&
            notificationEdge.node.target.id ===
              data.rejectFriend.friendRequest.id
          ) {
            return false;
          }
          return true;
        }
      );
    }

    return previous;
  }
};
export default gql`
  mutation RejectFriendRequest($id: String!) {
    rejectFriend(input: { id: $id }) {
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
