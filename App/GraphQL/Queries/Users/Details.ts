import gql from "graphql-tag";
import user from "App/GraphQL/Fragments/User";

export default gql`
  query UserDetails($id: String!) {
    user(id: $id) {
      ...user
    }
  }

  ${user}
`;
