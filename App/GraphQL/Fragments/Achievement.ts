export default `
fragment achievement on Achievement {
  id
  name
  points
  icon

  author {
    id
    name
  }

  category {
    id
    title
    icon
  }
  mode
  kind
}`;
