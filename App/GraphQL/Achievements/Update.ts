import gql from "graphql-tag";

export default gql`
  mutation UpdateAchievement(
    $id: String!
    $name: String!
    $description: String!
    $objectives: [ObjectiveInput!]!
    $icon: String!
    $categoryId: Int!
    $mode: Mode!
  ) {
    updateAchievement(
      input: {
        id: $id
        name: $name
        description: $description
        icon: $icon
        mode: $mode
        categoryId: $categoryId
        objectives: $objectives
      }
    ) {
      achievement {
        id
        name
        shortDescription
        fullDescription
        author {
          id
          name
        }

        isMultiPlayer
        category {
          id
          title
          icon
        }

        points

        objectives {
          id
          tagline
          lat
          lng
          isPublic
          kind
        }
      }
      errors
    }
  }
`;
