import gql from "graphql-tag";
import achievementWithObjectives from "../..//Fragments/AchievementWithObjectives";

export default gql`
  mutation SendCoopRequest(
    $userIds: [String!]!
    $achievementId: String!
    $message: String!
  ) {
    requestCoop(
      input: {
        userIds: $userIds
        message: $message
        achievementId: $achievementId
      }
    ) {
      coopRequests {
        id
        message
        isPending
        isAccepted
        isComplete
        createdAt
        receiver {
          id
          email
        }
      }
      errors
    }
  }
`;
