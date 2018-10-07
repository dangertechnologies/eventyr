import gql from "graphql-tag";
import listWithAchievements from "App/GraphQL/Fragments/ListWithAchievements";

export default gql`
  mutation AddToLists($listIds: [String!]!, $achievementIds: [String!]!) {
    addToList(input: { listIds: $listIds, achievementIds: $achievementIds }) {
      lists {
        ...listWithAchievements
      }
      errors
    }
  }
  ${listWithAchievements}
`;
