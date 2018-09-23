import gql from "graphql-tag";
import achievement from "App/GraphQL/Fragments/Achievement";

export default gql`
  query AchievementsList($type: String!) {
    achievements(type: $type) {
      edges {
        node {
          ...achievement
        }
      }
    }
  }

  ${achievement}
`;
