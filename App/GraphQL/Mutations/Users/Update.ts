import gql from "graphql-tag";
import { MutationResult } from "react-apollo";
import { Query } from "App/Types/GraphQL";

export const updateQueries = {
  UserCheck: (
    previousData: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    const { data } = mutationResult;

    if (data && data.updateMe && data.updateMe.user) {
      console.log("UPDATING CURRENT USER");

      console.log({
        newData: {
          ...previousData,
          currentUser: Object.assign(
            {},
            previousData.currentUser,
            data.updateMe.user
          )
        },
        previousData
      });
      return {
        ...previousData,
        currentUser: Object.assign(
          {},
          previousData.currentUser,
          data.updateMe.user
        )
      };
    }

    return previousData;
  }
};
export default gql`
  mutation UpdateMe(
    $allowCoop: Boolean
    $avatar: String
    $email: String
    $name: String
  ) {
    updateMe(
      input: {
        name: $name
        email: $email
        avatar: $avatar
        allowCoop: $allowCoop
      }
    ) {
      user {
        id
        name
        email
        points
        avatar
        personalPoints
        unlockedCount
        coopPoints
        allowCoop

        role {
          id
          name
        }
        authenticationToken
      }

      errors
    }
  }
`;
