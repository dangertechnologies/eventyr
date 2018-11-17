import gql from "graphql-tag";
import achievement from "../..//Fragments/Achievement";

export default gql`
  query PersonalAchievementsForUser($id: String!) {
    user(id: $id) {
      id

      userAchievements {
        edges {
          node {
            ...achievement
          }
        }
      }
    }
  }

  ${achievement}
`;
