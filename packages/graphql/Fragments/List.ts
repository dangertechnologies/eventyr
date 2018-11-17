export default `
  fragment list on List {
    id
    title
    isPublic
    isEditable
    isFollowed
    achievementsCount
    author {
      id
      name
    }
  }
`;
