import gql from "graphql-tag";
import { Query, NotificationEdge } from "../../index.d";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  UserNotifications: (
    previous: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    // Find Notifications containing this CoopRequest and update it
    const { data } = mutationResult;

    console.log({ data, previous });

    if (
      data &&
      data.acceptCoop &&
      data.acceptCoop.coopRequest &&
      previous &&
      previous.notifications &&
      previous.notifications.edges
    ) {
      previous.notifications.edges = previous.notifications.edges.map(
        (notificationEdge: NotificationEdge) => {
          if (
            notificationEdge.node &&
            notificationEdge.node.targetType === "CoopRequest" &&
            notificationEdge.node.target.id === data.acceptCoop.coopRequest.id
          ) {
            notificationEdge.node = Object.assign({}, notificationEdge.node, {
              target: Object.assign(
                {},
                notificationEdge.node.target,
                data.acceptCoop.coopRequest
              )
            });

            console.log("Updated coopRequest");
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
    acceptCoop(input: { id: $id }) {
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
