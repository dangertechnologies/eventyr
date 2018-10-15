import React from "react";
import { FlatList } from "react-native";
import { compose } from "recompose";

import NotificationCard from "App/Components/Cards/Notification";
import { withUser, UserContext } from "App/Providers/UserProvider";

interface Props {}

interface ComposedProps extends Props {
  currentUser: UserContext;
}

class NotificationsScreen extends React.Component<ComposedProps> {
  render() {
    const { currentUser } = this.props;

    return (
      <FlatList
        data={currentUser.notifications}
        keyExtractor={notification => notification.id || "N/A"}
        renderItem={({ item }) => <NotificationCard item={item} />}
        refreshing={currentUser.notificationsLoading}
        onRefresh={currentUser.refetchNotifications}
      />
    );
  }
}

export default compose<ComposedProps, Props>(withUser)(NotificationsScreen);
