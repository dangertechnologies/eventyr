import gql from "graphql-tag";
import list from "../../Fragments/List";

export default gql`
  query NearbyObjectives($coordinates: [Float!]) {
    lists(near: $coordinates) {
      edges {
        node {
          __typename
          ...list
          coordinates
        }
      }
    }
  }
  ${list}
`;
