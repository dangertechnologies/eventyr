export default `
fragment achievement on Achievement {
  id
  name
  points
  icon
  upvotes
  downvotes

  isSuggestedGlobal
  isGlobal

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
