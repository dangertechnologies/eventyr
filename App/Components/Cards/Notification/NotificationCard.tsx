import React from "react";
import { CoopRequest, FriendRequest, Notification } from "App/Types/GraphQL";

import CoopRequestNotification from "./CoopRequest";
import FriendRequestNotification from "./FriendRequest";

interface Props {
  item: Notification;
}

const NotificationCard = ({ item }: Props) => {
  switch (item.kind) {
    case "ACHIEVEMENT_UNLOCKED":
      return null;
    case "ACHIEVEMENT_UNLOCKED_COOP_BONUS":
      return null;
    case "COOPERATION_REQUEST_ACCEPTED":
      return null;
    case "COOPERATION_REQUEST_RECEIVED":
      return <CoopRequestNotification item={item} />;
    case "SHARED_ACHIEVEMENT_RECEIVED":
      return null;
    case "SHARED_LIST_RECEIVED":
      return null;
    case "FRIEND_REQUEST_RECEIVED":
      return <FriendRequestNotification item={item} />;
    default:
      return null;
  }
};

export default NotificationCard;
