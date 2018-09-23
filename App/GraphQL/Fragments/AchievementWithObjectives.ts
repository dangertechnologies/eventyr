export default `
  fragment achievementWithObjectives on Achievement {
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
`;
