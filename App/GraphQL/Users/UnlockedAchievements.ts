import gql from "graphql-tag";

export default gql`
  query UnlockedAchievementsForUser($id: String!) {
    user(id: $id) {
      id
      unlockedAchievements {
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
