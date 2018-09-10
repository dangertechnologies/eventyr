import gql from "graphql-tag";

export default gql`
  query UserDetails($id: String!) {
    user(id: $id) {
      id
      name
      email
      points
      personalPoints

      country {
        id
        name
      }

      role {
        id
        name
      }

      unlocked {
        edges {
          node {
            id
            points
            coop
            coopBonus
            createdAt

            achievement {
              id
              name
              icon

              category {
                title
                icon
              }

              mode {
                name
              }

              type {
                name
                icon
              }
            }
          }
        }
      }
    }
  }
`;
