import gql from "graphql-tag";
import listWithAchievements from "App/GraphQL/Fragments/ListWithAchievements";

export default gql`
  query UserLists($userId: String!) {
    lists(userId: $userId) {
      edges {
        node {
          ...listWithAchievements
        }
      }
    }
  }
  ${listWithAchievements}
`;
