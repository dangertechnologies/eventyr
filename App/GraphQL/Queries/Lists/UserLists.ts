import gql from "graphql-tag";
import list from "App/GraphQL/Fragments/List";

export default gql`
  query UserLists($userId: String!) {
    lists(userId: $userId) {
      edges {
        node {
          ...list
        }
      }
    }
  }
  ${list}
`;
