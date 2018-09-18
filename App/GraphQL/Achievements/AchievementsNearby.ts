import gql from "graphql-tag";

export default gql`
  query ObjectivesNearby($latitude: Float!, $longitude: Float!) {
    objectives(near: [$latitude, $longitude]) {
      edges {
        node {
          id
          tagline
          lat
          lng
          kind

          achievements {
            id
            name
            shortDescription
            fullDescription
            points
            icon
            objectives {
              id
              tagline
              kind
              lat
              lng
              basePoints
            }

            category {
              id
              title
            }

            mode
            kind
          }
        }
      }
    }
  }
`;
