import gql from "graphql-tag";
import achievementWithObjectives from "../../Fragments/AchievementWithObjectives";

export default gql`
  query ObjectivesNearby($latitude: Float!, $longitude: Float!) {
    achievements(near: [$latitude, $longitude]) {
      edges {
        node {
          ...achievementWithObjectives
        }
      }
    }
  }
  ${achievementWithObjectives}
`;
