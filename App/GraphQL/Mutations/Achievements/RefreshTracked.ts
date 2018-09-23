import gql from "graphql-tag";
import achievementWithObjectives from "App/GraphQL/Fragments/AchievementWithObjectives";

export default gql`
  mutation RefreshTracked($coordinates: [Float!]) {
    refreshSuggested(input: { coordinates: $coordinates }) {
      achievements {
        ...achievementWithObjectives
      }
      errors
    }
  }
  ${achievementWithObjectives}
`;
