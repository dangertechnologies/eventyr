import gql from "graphql-tag";

export default gql`
  mutation ShareAchievementRequest(
    $userIds: [String!]!
    $achievementId: String!
  ) {
    shareAchievement(
      input: { userIds: $userIds, achievementId: $achievementId }
    ) {
      shareRequests {
        id
      }
      errors
    }
  }
`;
