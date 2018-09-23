import gql from "graphql-tag";

export default gql`
  mutation CompleteObjective(
    $id: String!
    $coordinates: [Float!]
    $timestamp: Int!
  ) {
    completeObjective(
      input: { id: $id, coordinates: $coordinates, timestamp: $timestamp }
    ) {
      objectiveProgress {
        id
        completed
        timesCompleted
        updatedAt
        createdAt
      }

      unlockedAchievements {
        id
        points
        coopBonus
        achievement {
          id
          name
        }
      }
      errors
    }
  }
`;
