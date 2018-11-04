import React from "react";
import { FlatList } from "react-native";
import { compose } from "recompose";

import NotificationCard from "App/Components/Cards/Notification";
import { withUser, UserContext } from "App/Providers/UserProvider";
import { NavigationScreenProps, NavigationState } from "react-navigation";
import { Container, Content } from "native-base";

interface Props extends NavigationScreenProps<NavigationState> {}

interface ComposedProps extends Props {
  currentUser: UserContext;
}

class NotificationsScreen extends React.PureComponent<ComposedProps> {
  componentDidUpdate(prevProps: ComposedProps) {
    if (
      this.props.navigation.isFocused() !== prevProps.navigation.isFocused() &&
      this.props.currentUser.refetchNotifications
    ) {
      this.props.currentUser.refetchNotifications();
    }
  }

  render() {
    const { currentUser } = this.props;

    console.log({ receivedNotifications: currentUser.notifications });
    return (
      <Container>
        <Content>
          <FlatList
            data={currentUser.notifications}
            keyExtractor={notification => notification.id || "N/A"}
            renderItem={({ item }) => <NotificationCard item={item} />}
            refreshing={currentUser.notificationsLoading}
            onRefresh={currentUser.refetchNotifications}
          />
        </Content>
      </Container>
    );
  }
}

export default compose<ComposedProps, Props>(withUser)(NotificationsScreen);
