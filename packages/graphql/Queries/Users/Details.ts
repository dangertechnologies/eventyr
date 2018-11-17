import gql from "graphql-tag";
import user from "../..//Fragments/User";

export default gql`
  query UserDetails($id: String!) {
    user(id: $id) {
      ...user
    }
  }

  ${user}
`;
