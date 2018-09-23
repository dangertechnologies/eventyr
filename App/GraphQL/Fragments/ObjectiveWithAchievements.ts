export default `
  fragment objectiveWithAchievements on Objective {
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
`;
