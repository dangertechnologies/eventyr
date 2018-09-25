import gql from "graphql-tag";
import achievement from "App/GraphQL/Fragments/Achievement";

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
