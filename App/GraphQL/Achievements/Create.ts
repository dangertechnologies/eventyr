import gql from "graphql-tag";

export default gql`
  mutation CreateAchievement(
    $name: String!
    $description: String!
    $objectives: [ObjectiveInput!]!
    $icon: String!
    $categoryId: Int!
    $modeId: Int!
  ) {
    createAchievement(
      input: {
        name: $name
        description: $description
        icon: $icon
        modeId: $modeId
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