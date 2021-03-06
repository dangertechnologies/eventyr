import gql from "graphql-tag";
import objective from "../../Fragments/Objective";
export default gql`
  query NearbyObjectives($latitude: Float!, $longitude: Float!) {
    objectives(near: [$latitude, $longitude]) {
      edges {
        node {
          ...objective
        }
      }
    }
  }
  ${objective}
`;
