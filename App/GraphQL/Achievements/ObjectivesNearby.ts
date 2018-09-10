import gql from "graphql-tag";

export default gql`
  query NearbyObjectives($latitude: Float!, $longitude: Float!) {
    objectives(near: [$latitude, $longitude]) {
      edges {
        node {
          id
          tagline
          basePoints
          requiredCount
          lat
          lng
          kind
        }
      }
    }
  }
`;
