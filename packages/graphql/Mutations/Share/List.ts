import gql from "graphql-tag";

export default gql`
  mutation ShareListRequest($userIds: [String!]!, $listId: String!) {
    shareList(input: { userIds: $userIds, listId: $listId }) {
      shareRequests {
        id
      }
      errors
    }
  }
`;
