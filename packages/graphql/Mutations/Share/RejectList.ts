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
      data.rejectList &&
      data.rejectList.shareRequest &&
      previous &&
      previous.notifications &&
      previous.notifications.edges
    ) {
      previous.notifications.edges = previous.notifications.edges.filter(
        (notificationEdge: NotificationEdge) => {
          if (
            notificationEdge.node &&
            notificationEdge.node.targetType === "SharedList" &&
            notificationEdge.node.target.id === data.rejectList.shareRequest.id
          ) {
            return false;
          }
          return true;
        }
      );
      return previous;
    }

    return previous;
  }
};
export default gql`
  mutation RejectList($id: String!) {
    rejectList(input: { id: $id }) {
      shareRequest {
        id
      }
      errors
    }
  }
`;
