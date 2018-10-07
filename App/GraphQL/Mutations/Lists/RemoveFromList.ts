import gql from "graphql-tag";
import listWithAchievements from "App/GraphQL/Fragments/ListWithAchievements";
import { AchievementEdge, Query } from "../../../Types/GraphQL";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  AchievementsList: (
    previousData: Query,
    result: {
      mutationResult: MutationResult;
      queryVariables: { listId: string };
    }
  ) => {
    const { mutationResult, queryVariables } = result;
    const { data } = mutationResult;

    if (
      data &&
      data.removeFromList &&
      data.removeFromList.list &&
      data.removeFromList.removedIds &&
      previousData.achievements &&
      previousData.achievements.edges &&
      queryVariables.listId === data.removeFromList.list.id
    ) {
      previousData.achievements.edges = previousData.achievements.edges.filter(
        ({ node }: AchievementEdge) =>
          node && !data.removeFromList.removedIds.includes(node.id)
      );
    }

    return previousData;
  }
};

export default gql`
  mutation RemoveFromList($listId: String!, $achievementIds: [String!]!) {
    removeFromList(
      input: { listId: $listId, achievementIds: $achievementIds }
    ) {
      list {
        ...listWithAchievements
      }
      removedIds
      errors
    }
  }
  ${listWithAchievements}
`;
