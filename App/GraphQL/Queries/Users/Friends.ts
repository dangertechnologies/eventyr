import gql from "graphql-tag";
import user from "App/GraphQL/Fragments/User";

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
