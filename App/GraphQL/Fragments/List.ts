export default `
  fragment list on List {
    id
    title
    isPublic
    isEditable
    achievementsCount
    author {
      id
      name
    }
  }
`;
