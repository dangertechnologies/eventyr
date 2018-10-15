import React from "react";
// @ts-ignore
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";
import { graphql, DataValue } from "react-apollo";
import { get } from "lodash";

import { RehydrationContext, withRehydratedState } from "./RehydrationProvider";
import { compose, branch, lifecycle } from "recompose";
import { Query, Notification, NotificationEdge } from "App/Types/GraphQL";
import QUERY_NOTIFICATIONS, {
  subscription
} from "App/GraphQL/Queries/Users/Notifications";

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
  notificationsQuery: DataValue<Query>;
}

type State = {
  updatedSinceLogin: boolean;
};

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

class UserProvider extends React.Component<ComposedProps, State> {
  static fragments = {
    user: gql`
      fragment userInfo on User {
        id
        name
        email
      }
    `
  };

  state: State = {
    updatedSinceLogin: false
  };

  render() {
    const { rehydratedState, userQuery, notificationsQuery } = this.props;

    const contextValue: UserContext = {
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

    console.log({
      provider: "User",
      value: contextValue
    });
    return <Provider value={contextValue}>{this.props.children}</Provider>;
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
  Provider: compose<ComposedProps, Props>(
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
      compose<ComposedProps, ComposedProps>(
        graphql(QUERY_NOTIFICATIONS, {
          name: "notificationsQuery"
        }),
        lifecycle<ComposedProps, State>({
          componentWillMount() {
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
                  !previous.notifications.edges.find(
                    (notification: NotificationEdge) =>
                      notification.node &&
                      notification.node.id === newNotification.id
                  )
                ) {
                  previous.notifications.edges = [
                    { __typename: "NotificationEdge", node: newNotification },
                    ...previous.notifications.edges
                  ];
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
