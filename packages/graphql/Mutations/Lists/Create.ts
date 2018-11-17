import gql from "graphql-tag";
import listWithAchievements from "../..//Fragments/ListWithAchievements";
import { Query } from "../../Types/GraphQL";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  UserLists: (
    previous: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    // Find Notifications containing this CoopRequest and update it
    const { data } = mutationResult;

    if (
      data &&
      data.createList &&
      data.createList.list &&
      previous &&
      previous.lists &&
      previous.lists.edges &&
      !previous.lists.edges.some(({ node }) =>
        Boolean(node && node.id === data.createList.list.id)
      )
    ) {
      previous.lists.edges = previous.lists.edges.concat([
        {
          // @ts-ignore
          __typename: "ListEdge",
          node: data.createList.list
        }
      ]);
    }

    return previous;
  }
};

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
