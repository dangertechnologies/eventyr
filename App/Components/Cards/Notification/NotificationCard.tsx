import React from "react";
import {
  CoopRequest,
  FriendRequest,
  Notification,
  Unlocked
} from "App/Types/GraphQL";

import CoopRequestNotification from "./CoopRequest";
import FriendRequestNotification from "./FriendRequest";
import SharedAchievementNotification from "./SharedAchievement";
import SharedListNotification from "./SharedList";
import UnlockedCard from "../Unlocked";

interface Props {
  item: Notification;
}

const NotificationCard = ({ item }: Props) => {
  switch (item.kind) {
    case "ACHIEVEMENT_UNLOCKED":
      return <UnlockedCard unlocked={item.target as Unlocked} />;
    case "ACHIEVEMENT_UNLOCKED_COOP_BONUS":
      return null;
    case "COOPERATION_REQUEST_ACCEPTED":
      return null;
    case "COOPERATION_REQUEST_RECEIVED":
      return <CoopRequestNotification item={item} />;
    case "SHARED_ACHIEVEMENT_RECEIVED":
      return <SharedAchievementNotification item={item} />;
    case "SHARED_LIST_RECEIVED":
      return <SharedListNotification item={item} />;
    case "FRIEND_REQUEST_RECEIVED":
      return <FriendRequestNotification item={item} />;
    default:
      return null;
  }
};

export default NotificationCard;
