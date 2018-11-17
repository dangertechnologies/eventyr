import gql from "graphql-tag";
import achievement from "../..//Fragments/Achievement";

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
