import gql from "graphql-tag";
import achievementWithObjectives from "App/GraphQL/Fragments/AchievementWithObjectives";

export default gql`
  query AchievementsList(
    $type: String!
    $coordinates: [Float!]
    $listId: String
  ) {
    achievements(type: $type, coordinates: $coordinates, listId: $listId) {
      edges {
        node {
          ...achievementWithObjectives
        }
      }
    }
  }

  ${achievementWithObjectives}
`;
