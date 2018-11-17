import gql from "graphql-tag";
import { Query, NotificationEdge } from "../../../Types/GraphQL";
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
      data.rejectCoop &&
      data.rejectCoop.coopRequest &&
      previous &&
      previous.notifications &&
      previous.notifications.edges
    ) {
      previous.notifications.edges = previous.notifications.edges.filter(
        (notificationEdge: NotificationEdge) => {
          if (
            notificationEdge.node &&
            notificationEdge.node.targetType === "CoopRequest" &&
            notificationEdge.node.target.id === data.rejectCoop.coopRequest.id
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
  mutation RejectCoopRequest($id: String!) {
    rejectCoop(input: { id: $id }) {
      coopRequest {
        id
        message
        isPending
        isAccepted
        isComplete
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
