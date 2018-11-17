import gql from "graphql-tag";
import achievementWithObjectives from "../../Fragments/AchievementWithObjectives";

export default gql`
  mutation CreateAchievement(
    $name: String!
    $description: String!
    $objectives: [ObjectiveInput!]!
    $icon: Icon!
    $categoryId: Int!
    $mode: Mode!
  ) {
    createAchievement(
      input: {
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
