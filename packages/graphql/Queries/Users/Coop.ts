import gql from "graphql-tag";
import user from "../../Fragments/User";

export default gql`
  query CoopUserSearch($achievementId: String!) {
    users(achievementId: $achievementId) {
      edges {
        node {
          ...user
        }
      }
    }
  }
  ${user}
`;
