export default `
fragment achievement on Achievement {
  id
  name
  points
  icon
  upvotes
  downvotes
  unlocked
  isSuggestedGlobal
  isGlobal
  cooperationUsers {
    id
    avatar
    name
  }

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
