import gql from "graphql-tag";
import listWithAchievements from "App/GraphQL/Fragments/ListWithAchievements";
import {
  Query,
  NotificationEdge,
  AchievementConnection,
  AchievementEdge,
  List,
  Achievement,
  SharedAchievement
} from "App/Types/GraphQL";
import { MutationResult } from "react-apollo";

export const updateQueries = {
  UserNotifications: (
    previous: Query,
    { mutationResult }: { mutationResult: MutationResult }
  ) => {
    // Find Notifications containing this CoopRequest and update it
    const { data } = mutationResult;

    if (
      data &&
      data.addToList &&
      data.addToList.lists &&
      previous &&
      previous.notifications &&
      previous.notifications.edges
    ) {
      previous.notifications.edges = previous.notifications.edges.map(
        (notificationEdge: NotificationEdge) => {
          if (
            notificationEdge.node &&
            notificationEdge.node.targetType === "SharedAchievement"
          ) {
            // Find Lists that include this Achievement
            const lists = data.addToList.lists.filter(
              ({ achievements }: List) =>
                achievements &&
                achievements.edges &&
                achievements.edges.map(
                  ({ node }: AchievementEdge) =>
                    notificationEdge.node &&
                    node &&
                    node.id === notificationEdge.node.target.id
                )
            );

            console.log(
              `Found ${lists.length} matching lists for notification`,
              lists,
              notificationEdge.node
            );

            const target = notificationEdge.node.target as SharedAchievement;

            if (lists.length) {
              notificationEdge.node = Object.assign({}, notificationEdge.node, {
                target: {
                  ...target,
                  achievement: {
                    ...(target.achievement || {}),
                    inLists: (target.achievement.inLists || []).concat(lists)
                  }
                }
              });
            }

            console.log("Updated Notifications with new Lists");
            console.log(notificationEdge);
          }
          return notificationEdge;
        }
      );
    }

    return previous;
  }
};

export default gql`
  mutation AddToLists($listIds: [String!]!, $achievementIds: [String!]!) {
    addToList(input: { listIds: $listIds, achievementIds: $achievementIds }) {
      lists {
        ...listWithAchievements
      }
      errors
    }
  }
  ${listWithAchievements}
`;
