import gql from "graphql-tag";
import achievementWithObjectives from "App/GraphQL/Fragments/AchievementWithObjectives";

export default gql`
  query AchievementsList(
    $type: String!
    $coordinates: [Float!]
    $listId: String
    $after: String
  ) {
    achievements(
      type: $type
      first: 20
      after: $after
      coordinates: $coordinates
      listId: $listId
    ) {
      __typename
      edges {
        cursor
        node {
          ...achievementWithObjectives
        }
      }
    }
  }

  ${achievementWithObjectives}
`;
