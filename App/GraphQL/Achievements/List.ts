import gql from "graphql-tag";

export default gql`
  query AchievementsList($type: String!) {
    achievements(type: $type) {
      edges {
        node {
          id
          name
          points
          icon

          author {
            id
            name
          }

          category {
            id
            title
            icon
          }
          mode
          kind
        }
      }
    }
  }
`;
