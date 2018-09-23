import gql from "graphql-tag";
import { Query, Mutation, Objective, ObjectiveEdge } from "App/Types/GraphQL";

interface MutationResult {
  mutationResult: {
    data: Mutation;
  };
}

export const updateQueries = {
  AchievementsList: (
    previousData: Query,
    { mutationResult }: MutationResult
  ) => {
    const { data } = mutationResult;

    if (
      data &&
      data.deleteAchievement &&
      data.deleteAchievement.achievement &&
      data.deleteAchievement.achievement.id &&
      previousData.achievements &&
      previousData.achievements.edges
    ) {
      const id = data.deleteAchievement.achievement.id;

      previousData.achievements.edges = previousData.achievements.edges.filter(
        ({ node }) => node && node.id !== id
      );
    }

    return previousData;
  },
  NearbyObjectives: (
    previousData: Query,
    { mutationResult }: MutationResult
  ) => {
    const { data } = mutationResult;

    if (
      data &&
      data.deleteAchievement &&
      data.deleteAchievement.objectives &&
      data.deleteAchievement.objectives.length &&
      previousData.objectives &&
      previousData.objectives.edges
    ) {
      const ids =
        data.deleteAchievement.objectives.map((o: Objective) => o.id) || [];

      previousData.objectives.edges = previousData.objectives.edges.filter(
        ({ node }: ObjectiveEdge) => node && !ids.includes(node.id)
      );
    }

    return previousData;
  }
};

export default gql`
  mutation DeleteAchievement($id: String!) {
    deleteAchievement(input: { id: $id }) {
      achievement {
        id
      }
      objectives {
        id
      }
      errors
    }
  }
`;
