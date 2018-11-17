import gql from "graphql-tag";
import list from "../../Fragments/List";

export default gql`
  query FollowedLists {
    followedLists {
      edges {
        cursor
        node {
          ...list
        }
      }
    }
  }
  ${list}
`;
