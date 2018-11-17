import gql from "graphql-tag";
import {
  Unlocked,
  Query,
  Achievement,
  ObjectiveEdge,
  AchievementEdge
} from "../../../Types/GraphQL";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  AchievementDetails: (
    previousData: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    const { data } = mutationResult;

    if (
      data &&
      data.completeObjective &&
      data.completeObjective.unlockedAchievements &&
      data.completeObjective.unlockedAchievements.length &&
      previousData.achievement &&
      data.completeObjective.unlockedAchievements
        .map((u: Unlocked) => u.achievement.id)
        .includes(previousData.achievement.id)
    ) {
      console.log("UPDATED ACHIEVEMENT DETAILS");
      console.log({ data: previousData.achievement });
      previousData.achievement.unlocked = true;
    }

    return previousData;
  },

  AchievementsList: (
    previousData: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    const { data } = mutationResult;

    if (
      data &&
      data.completeObjective &&
      data.completeObjective.unlockedAchievements &&
      data.completeObjective.unlockedAchievements.length &&
      previousData.achievements &&
      previousData.achievements.edges
    ) {
      (previousData.achievements.edges || []).forEach(
        (achievement: AchievementEdge) => {
          if (
            achievement.node &&
            data.completeObjective.unlockedAchievements
              .map((u: Unlocked) => u.achievement.id)
              .includes(achievement.node.id)
          ) {
            achievement.node.unlocked = true;
          }
        }
      );
    }

    return previousData;
  },

  NearbyObjectives: (
    previousData: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    const { data } = mutationResult;

    if (
      data &&
      data.completeObjective &&
      data.completeObjective.objectiveProgress &&
      data.completeObjective.objectiveProgress.objective &&
      data.completeObjective.objectiveProgress.objective.id &&
      previousData.objectives &&
      previousData.objectives.edges
    ) {
      (previousData.objectives.edges || []).forEach(
        (objective: ObjectiveEdge) => {
          if (
            objective.node &&
            objective.node.achievements &&
            objective.node.achievements.length
          ) {
            objective.node.achievements.forEach((achievement: Achievement) => {
              if (
                data.completeObjective.unlockedAchievements
                  .map((u: Unlocked) => u.achievement.id)
                  .includes(achievement.id)
              ) {
                achievement.unlocked = true;
              }
            });
          }
        }
      );
    }

    return previousData;
  }
};
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

        objective {
          id
        }
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
