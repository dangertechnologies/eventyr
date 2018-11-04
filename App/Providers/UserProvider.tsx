import React from "react";
// @ts-ignore
import gql from "graphql-tag";
import { graphql, DataValue } from "react-apollo";
import jwtdecode from "jwt-decode";
import { isFuture } from "date-fns";

import { RehydrationContext, withRehydratedState } from "./RehydrationProvider";
import { compose, branch, lifecycle } from "recompose";
import { Query, Notification, NotificationEdge } from "App/Types/GraphQL";
import QUERY_NOTIFICATIONS, {
  subscription
} from "App/GraphQL/Queries/Users/Notifications";
import { withUIHelpers, UIContext } from "./UIProvider";
import notificationTitle from "App/Helpers/notificationTitle";
import { Sentry } from "react-native-sentry";

export interface User {
  id: string | null;
  name: string;
  email: string;
  avatar: string | null;
}

export interface UserContext extends User {
  isLoggedIn: boolean;
  authenticationToken: string;
  logout: Function;
  refreshCredentials(): any;
  notifications: Array<Notification>;
  refetchNotifications: DataValue<Query>["refetch"] | null;
  notificationsLoading: boolean;
}

interface Props {
  children: React.ReactNode;
}

interface ComposedProps extends Props {
  rehydratedState: RehydrationContext;
  userQuery: DataValue<Query>;
}

interface ComposedPropsWithNotifications extends ComposedProps {
  notificationsQuery: DataValue<Query>;
  ui: UIContext;
}

type State = UserContext;

const LOGGED_OUT_USER = {
  id: "0",
  name: "",
  email: "",
  avatar: ""
};

const INITIAL_CONTEXT: UserContext = {
  ...LOGGED_OUT_USER,
  authenticationToken: "",
  logout: () => null,
  refreshCredentials: () => null,
  isLoggedIn: false,
  refetchNotifications: null,
  notifications: [],
  notificationsLoading: false
};

const { Provider, Consumer } = React.createContext(INITIAL_CONTEXT);

class UserProvider extends React.Component<
  ComposedPropsWithNotifications,
  State
> {
  static fragments = {
    user: gql`
      fragment userInfo on User {
        id
        name
        email
        avatar
        allowCoop
      }
    `
  };

  static getDerivedStateFromProps(props: ComposedPropsWithNotifications) {
    const { userQuery, rehydratedState, notificationsQuery } = props;

    // Set up Sentry user object so we can track the user
    // that received the error for better debugging :-)
    if (!__DEV__ && userQuery && userQuery.currentUser) {
      Sentry.setUserContext({
        email: userQuery.currentUser.email,
        username: userQuery.currentUser.name,
        id: userQuery.currentUser.id
      });
    }

    return {
      ...((userQuery && userQuery.currentUser) || LOGGED_OUT_USER),
      authenticationToken: rehydratedState.authenticationToken,
      refreshCredentials: () => null,
      logout: rehydratedState.clear,
      isLoggedIn: rehydratedState.isLoggedIn,
      refetchNotifications: notificationsQuery
        ? notificationsQuery.refetch
        : null,
      notificationsLoading: notificationsQuery
        ? notificationsQuery.loading
        : false,
      notifications:
        notificationsQuery &&
        notificationsQuery.notifications &&
        notificationsQuery.notifications.edges
          ? notificationsQuery.notifications.edges.map(
              ({ node }) => node as Notification
            )
          : []
    };
  }

  componentDidUpdate() {
    const { rehydratedState } = this.props;
    if (rehydratedState.restored && rehydratedState.authenticationToken) {
      this.sessionExpirationCheck(rehydratedState);
    }
    return null;
  }

  private sessionExpirationCheck = ({
    authenticationToken
  }: RehydrationContext) => {
    if (authenticationToken) {
      const { exp } = jwtdecode(authenticationToken);

      if (!isFuture(exp * 1000)) {
        this.props.rehydratedState.clear();
      }
    }
  };

  render() {
    console.log({
      provider: "User",
      value: this.state
    });
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

const QUERY_USER = gql`
  query UserCheck {
    currentUser {
      id
      ...userInfo
    }
  }
  ${UserProvider.fragments.user}
`;

export const withUser = <P extends object>(
  Component: React.ComponentType<P & { currentUser: UserContext }>
) =>
  class UserConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>
          {context => <Component {...props} currentUser={context} />}
        </Consumer>
      );
    }
  };

export default {
  Provider: compose<ComposedPropsWithNotifications, Props>(
    withRehydratedState,
    // When we're logged out, this always yields an error, and thats ok. Drop it.
    graphql(QUERY_USER, {
      name: "userQuery",
      options: { errorPolicy: "ignore" }
    }),
    branch(
      /*
        If currentUser exists on userQuery, we can set up a Websocket connection
        and begin querying for notifications
      */
      ({ userQuery }: ComposedProps) =>
        Boolean(userQuery && userQuery.currentUser && userQuery.currentUser.id),
      compose<ComposedPropsWithNotifications, ComposedProps>(
        graphql(QUERY_NOTIFICATIONS, {
          name: "notificationsQuery"
        }),
        withUIHelpers,
        lifecycle<ComposedPropsWithNotifications, State>({
          componentDidMount() {
            console.log({
              name: "UserProvider#subscription",
              value: "Subscribed to websockets"
            });
            this.props.notificationsQuery.subscribeToMore({
              document: subscription,
              variables: {},
              updateQuery: (previous, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return previous;
                }
                const newNotification =
                  subscriptionData.data.notificationReceived;

                if (
                  previous &&
                  previous.notifications &&
                  previous.notifications.edges &&
                  !previous.notifications.edges.find(
                    (notification: NotificationEdge) =>
                      notification.node &&
                      notification.node.id === newNotification.id
                  )
                ) {
                  previous.notifications.edges.unshift({
                    __typename: "NotificationEdge",
                    node: newNotification
                  });

                  console.log({
                    name: "UserProvider#subscription",
                    value: {
                      pushNotification: notificationTitle(newNotification),
                      newNotification
                    }
                  });

                  this.props.ui.localPushNotification(
                    notificationTitle(newNotification)
                  );

                  // FIXME: This is some weird Apollo bug? UserProvider
                  // doesn't update properly here, so we call forceUpdate.
                  this.forceUpdate();
                  return previous;
                }
                return previous;
              }
            });
          }
        })
      )
    )
  )(UserProvider),
  Consumer
};
