import gql from "graphql-tag";

export default gql`
  query UserDetails($id: String!) {
    user(id: $id) {
      id
      name
      email
      points
      personalPoints
      unlockedCount
      coopPoints

      country {
        id
        name
      }

      role {
        id
        name
      }
    }
  }
`;
