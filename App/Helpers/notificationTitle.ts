import {
  Notification,
  Unlocked,
  CoopRequest,
  FriendRequest,
  SharedAchievement,
  SharedList
} from "App/Types/GraphQL";

export default (
  notification: Notification
): { message: string; title: string } => {
  let target;
  switch (notification.kind) {
    case "ACHIEVEMENT_UNLOCKED":
      target = notification.target as Unlocked;
      return {
        title: "Achievement Unlocked",
        message: `${target.achievement.name} (+${target.points})`
      };
    case "COOPERATION_REQUEST_RECEIVED":
      target = notification.target as CoopRequest;
      return {
        title: `${target.sender.name} wants to cooperate`,
        message: `${
          target.achievement
            ? target.achievement.name
            : target.list && target.list.title
        }`
      };
    case "FRIEND_REQUEST_RECEIVED":
      target = notification.target as FriendRequest;
      return {
        title: `${target.sender.name} wants to be your friend`,
        message: "Say hello!"
      };
    case "SHARED_ACHIEVEMENT_RECEIVED":
      target = notification.target as SharedAchievement;
      return {
        title: `${target.sender.name} shared an Achievement with you`,
        message: `${target.achievement.name}`
      };
    case "SHARED_LIST_RECEIVED":
      target = notification.target as SharedList;
      return {
        title: `${target.sender.name} shared a List with you`,
        message: `${target.list.title}`
      };
    case "COOPERATION_REQUEST_ACCEPTED":
      target = notification.target as CoopRequest;
      return {
        title: `${target.receiver.name} accepted your cooperation request`,
        message: `You will be awarded bonus points for ${
          target.achievement
            ? target.achievement.name
            : target.list && target.list.title
        }`
      };
    case "FRIEND_REQUEST_ACCEPTED":
      target = notification.target as FriendRequest;
      return {
        title: `${target.receiver.name} accepted your friend request`,
        message: "You are now friends"
      };
  }
  return {
    title: "Something went wrong",
    message: ""
  };
};
