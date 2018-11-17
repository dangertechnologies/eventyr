import gql from "graphql-tag";
import user from "../..//Fragments/User";

export default gql`
  query UserFriends($search: String) {
    friends(search: $search) {
      edges {
        node {
          ...user
        }
      }
    }
  }
  ${user}
`;
