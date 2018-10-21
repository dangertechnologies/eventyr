import gql from "graphql-tag";
import {
  Query,
  FriendRequest,
  AddFriendPayload,
  AddFriendMutationArgs,
  UserEdge
} from "App/Types/GraphQL";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  UserFriends: (
    previous: Query,
    {
      mutationResult
    }: { mutationResult: MutationResult<{ addFriend: AddFriendPayload }> }
  ) => {
    if (
      previous &&
      previous.friends &&
      previous.friends.edges &&
      mutationResult &&
      mutationResult.data &&
      mutationResult.data.addFriend.friendRequests
    ) {
      console.log({ previous, mutationResult });
      previous.friends.edges = previous.friends.edges.map(
        (friendEdge: UserEdge) => {
          if (
            friendEdge.node &&
            mutationResult.data &&
            mutationResult.data.addFriend.friendRequests
              .map(({ receiver: { id } }) => id)
              .includes(friendEdge.node.id)
          ) {
            if (!friendEdge.node.isFriend && !friendEdge.node.isPendingFriend) {
              friendEdge = {
                ...friendEdge,
                node: {
                  ...friendEdge.node,
                  isPendingFriend: true
                }
              };
            }
          }
          return friendEdge;
        }
      );
      return previous;
    }
  }
};
export default gql`
  mutation SendFriendRequest($userIds: [String!]!, $message: String!) {
    addFriend(input: { userIds: $userIds, message: $message }) {
      friendRequests {
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
