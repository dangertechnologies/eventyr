import gql from "graphql-tag";
import listWithAchievements from "App/GraphQL/Fragments/ListWithAchievements";

export default gql`
  mutation CreateList($title: String!, $achievementIds: [String!]) {
    createList(input: { title: $title, achievementIds: $achievementIds }) {
      list {
        ...listWithAchievements
      }
      errors
    }
  }
  ${listWithAchievements}
`;
