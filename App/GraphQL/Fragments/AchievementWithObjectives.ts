export default `
  fragment achievementWithObjectives on Achievement {
    id
    name
    icon
    shortDescription
    fullDescription
    mode
    kind
    
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
