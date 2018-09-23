import gql from "graphql-tag";
import achievementWithObjectives from "App/GraphQL/Fragments/AchievementWithObjectives";

export default gql`
  mutation UpdateAchievement(
    $id: String!
    $name: String!
    $description: String!
    $objectives: [ObjectiveInput!]!
    $icon: Icon!
    $categoryId: Int!
    $mode: Mode!
  ) {
    updateAchievement(
      input: {
        id: $id
        name: $name
        description: $description
        icon: $icon
        mode: $mode
        categoryId: $categoryId
        objectives: $objectives
      }
    ) {
      achievement {
        ...achievementWithObjectives
      }
      errors
    }
  }
  ${achievementWithObjectives}
`;
