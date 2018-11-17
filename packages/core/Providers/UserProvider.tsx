import React from "react";
import gql from "graphql-tag";
import { graphql, DataValue } from "react-apollo";
import jwtdecode from "jwt-decode";
import { isFuture } from "date-fns";

import { RehydrationContext, withRehydratedState } from "./RehydratedState";
import { compose, branch, lifecycle } from "recompose";
import {
  Query,
  Notification,
  NotificationEdge,
  CurrentUser
} from "@eventyr/graphql";
import QUERY_NOTIFICATIONS, {
  subscription
} from "@eventyr/graphql/Queries/Users/Notifications";

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
  onUserFetched?(user: CurrentUser): any;
  onNotificationReceived?(notification: Notification): any;
}

interface ComposedProps extends Props {
  rehydratedState: RehydrationContext;
  userQuery: DataValue<Query>;
}

interface ComposedPropsWithNotifications extends ComposedProps {
  notificationsQuery: DataValue<Query>;
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

const { Provider: InnerProvider, Consumer } = React.createContext(
  INITIAL_CONTEXT
);

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
    const {
      onUserFetched,
      userQuery,
      rehydratedState,
      notificationsQuery
    } = props;

    if (onUserFetched && userQuery && userQuery.currentUser) {
      onUserFetched(userQuery.currentUser as CurrentUser);
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
              ({ node }: NotificationEdge) => node as Notification
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
    return (
      <InnerProvider value={this.state}>{this.props.children}</InnerProvider>
    );
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

export { Consumer };
export const Provider = compose<ComposedPropsWithNotifications, Props>(
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

                if (this.props.onNotificationReceived) {
                  this.props.onNotificationReceived(newNotification);
                }

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
)(UserProvider);
