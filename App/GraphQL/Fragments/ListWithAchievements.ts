import achievement from "App/GraphQL/Fragments/Achievement";
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
