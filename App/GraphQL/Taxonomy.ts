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

    kinds

    modes
  }
`;
