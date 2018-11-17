import achievement from "./Achievement";
export default `
  fragment achievementWithObjectives on Achievement {
    ...achievement
    
    author {
      id
      name
    }

    category {
      id
      title
      icon
    }


    objectives {
      id
      tagline
      lat
      lng
      isPublic
      kind
    }
  }

  ${achievement}
`;
