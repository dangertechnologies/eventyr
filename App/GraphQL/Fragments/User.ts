export default `
fragment user on User {
  id
  name
  email
  points
  personalPoints
  unlockedCount
  coopPoints
  avatar
  isFriend
  isPendingFriend

  role {
    id
    name
  }
}
`;
