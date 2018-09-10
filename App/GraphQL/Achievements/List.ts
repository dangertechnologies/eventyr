import gql from "graphql-tag";

export default gql`
  query AchievementsList($kind: String!) {
    achievements(kind: $kind) {
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
          mode {
            id
            name
          }
          type {
            id
            name
            icon
          }
        }
      }
    }
  }
`;
