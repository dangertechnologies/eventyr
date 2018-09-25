export default `
fragment user on User {
  id
  name
  email
  points
  personalPoints
  unlockedCount
  coopPoints

  role {
    id
    name
  }
}
`;
