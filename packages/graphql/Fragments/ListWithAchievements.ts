import achievement from "./Achievement";
import list from "./List";

export default `
  fragment listWithAchievements on List {
    ...list

    achievements {
      edges {
        node {
          ...achievement
        }
      }
    }
  }
  ${list}
  ${achievement}
`;
