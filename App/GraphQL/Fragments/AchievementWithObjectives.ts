import achievement from "App/GraphQL/Fragments/Achievement";
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
