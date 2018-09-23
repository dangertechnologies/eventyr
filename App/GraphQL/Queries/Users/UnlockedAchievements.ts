import gql from "graphql-tag";
import achievement from "App/GraphQL/Fragments/Achievement";

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
              ...achievement
            }
          }
        }
      }
    }
  }
  ${achievement}
`;
