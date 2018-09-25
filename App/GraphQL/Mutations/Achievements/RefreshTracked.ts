import gql from "graphql-tag";
import { MutationResult } from "react-apollo";
import { Query } from "App/Types/GraphQL";
import achievementWithObjectives from "App/GraphQL/Fragments/AchievementWithObjectives";

export const updateQueries = {
  AchievementsList: (
    previousData: Query,
    {
      mutationResult,
      queryVariables
    }: { mutationResult: MutationResult; queryVariables: { type: string } }
  ) => {
    const { data } = mutationResult;

    if (
      data &&
      data.refreshSuggested &&
      data.refreshSuggested.achievements &&
      previousData.achievements &&
      queryVariables.type === "suggested"
    ) {
      previousData.achievements = data.refreshSuggested.achievements;
    }

    return previousData;
  }
};

export default gql`
  mutation RefreshTracked($coordinates: [Float!]) {
    refreshSuggested(input: { coordinates: $coordinates }) {
      achievements {
        edges {
          node {
            ...achievementWithObjectives
          }
        }
      }
      errors
    }
  }
  ${achievementWithObjectives}
`;
