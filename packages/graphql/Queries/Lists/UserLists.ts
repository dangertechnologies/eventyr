import gql from "graphql-tag";
import list from "../../Fragments/List";

export default gql`
  query UserLists($userId: String!) {
    lists(userId: $userId) {
      edges {
        cursor
        node {
          ...list
        }
      }
    }
  }
  ${list}
`;
