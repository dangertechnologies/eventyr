import gql from "graphql-tag";

export default gql`
  query {
    categories {
      edges {
        node {
          id
          title
          points
        }
      }
    }

    types {
      edges {
        node {
          id
          name
          points
        }
      }
    }

    modes {
      edges {
        node {
          id
          name
          multiplier
        }
      }
    }
  }
`;
