import gql from "graphql-tag";
import objectiveWithAchievements from "App/GraphQL/Fragments/ObjectiveWithAchievements";

export default gql`
  query ObjectivesNearby($latitude: Float!, $longitude: Float!) {
    objectives(near: [$latitude, $longitude]) {
      edges {
        node {
          ...objectiveWithAchievements
        }
      }
    }
  }
  ${objectiveWithAchievements}
`;
