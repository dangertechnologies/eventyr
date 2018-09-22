import gql from "graphql-tag";

export default gql`
  query AchievementDetails($id: String!) {
    achievement(id: $id) {
      id
      name
      shortDescription
      fullDescription
      basePoints
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
        icon
      }

      mode
      kind
    }
  }
`;
