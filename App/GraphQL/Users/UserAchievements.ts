import gql from "graphql-tag";

export default gql`
  query PersonalAchievementsForUser($id: String!) {
    user(id: $id) {
      id

      userAchievements {
        edges {
          node {
            id
            name
            icon

            category {
              title
              icon
            }

            mode {
              id
              name
            }

            type {
              id
              name
              icon
            }
          }
        }
      }
    }
  }
`;
