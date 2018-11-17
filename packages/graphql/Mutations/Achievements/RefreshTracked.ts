import gql from "graphql-tag";
import { MutationResult } from "react-apollo";
import { Query } from "../../index.d";
import achievementWithObjectives from "../../Fragments/AchievementWithObjectives";

export const updateQueries = {
  AchievementsList: (
    previousData: Query,
    {
      mutationResult,
      queryVariables
    }: { mutationResult: MutationResult; queryVariables: { type: string } }
  ) => {
    const { data } = mutationResult;

    console.log({ name: "Mutation#refreshTracked", value: "Updating" });
    if (
      data &&
      data.refreshSuggested &&
      data.refreshSuggested.achievements &&
      queryVariables.type === "suggested"
    ) {
      console.log({ name: "Mutation#refreshTracked", value: "Updated" });
      previousData.achievements = data.refreshSuggested.achievements;
    } else {
      console.log({
        name: "Mutation#refreshTracked",
        value: { data, previousData, queryVariables }
      });
    }

    return previousData;
  }
};

export default gql`
  mutation RefreshTracked($coordinates: [Float!]) {
    refreshSuggested(input: { coordinates: $coordinates }) {
      achievements {
        __typename
        edges {
          cursor
          node {
            __typename
            ...achievementWithObjectives
          }
        }
      }
      errors
    }
  }
  ${achievementWithObjectives}
`;
