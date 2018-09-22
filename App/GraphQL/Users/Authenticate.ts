import gql from "graphql-tag";
import { MutationResult } from "react-apollo";
import { Query } from "../../Types/GraphQL";

export const updateQueries = {
  UserCheck: (
    previousData: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    const { data } = mutationResult;

    if (data && data.authenticateUser && data.authenticateUser.user) {
      previousData.currentUser = data.authenticateUser.user;
    }

    return previousData;
  }
};
export default gql`
  mutation Authenticate($provider: OauthProvider!, $token: String!) {
    authenticateUser(input: { provider: $provider, token: $token }) {
      user {
        id
        name
        email
        points
        personalPoints
        unlockedCount
        coopPoints

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
