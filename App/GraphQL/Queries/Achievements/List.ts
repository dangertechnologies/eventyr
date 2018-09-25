import gql from "graphql-tag";
import achievementWithObjectives from "App/GraphQL/Fragments/AchievementWithObjectives";

export default gql`
  query AchievementsList($type: String!) {
    achievements(type: $type) {
      edges {
        node {
          ...achievementWithObjectives
        }
      }
    }
  }

  ${achievementWithObjectives}
`;
