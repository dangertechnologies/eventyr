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
      data.rejectAchievement &&
      data.rejectAchievement.shareRequest &&
      previous &&
      previous.notifications &&
      previous.notifications.edges
    ) {
      previous.notifications.edges = previous.notifications.edges.filter(
        (notificationEdge: NotificationEdge) => {
          if (
            notificationEdge.node &&
            notificationEdge.node.targetType === "SharedAchievement" &&
            notificationEdge.node.target.id ===
              data.rejectAchievement.shareRequest.id
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
    rejectAchievement(input: { id: $id }) {
      shareRequest {
        id
      }
      errors
    }
  }
`;
