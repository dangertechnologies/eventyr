import React from "react";
// @ts-ignore
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";
import { compose, graphql } from "react-apollo";
import { get } from "lodash";

import { RehydrationContext, withRehydratedState } from "./RehydrationProvider";
import { withOneSignal, OneSignalContext } from "./OneSignalProvider";
import { ApolloQueryResult } from "apollo-client";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface UserContext extends User {
  isLoggedIn: boolean;
  authenticationToken: string;
  logout(): any;
  refreshCredentials(): any;
}

type Props = {
  rehydratedState: RehydrationContext;
  oneSignal: OneSignalContext;
  children: React.ReactNode;
  data: ApolloQueryResult<any>;
};

type State = {
  updatedSinceLogin: boolean;
};

const LOGGED_OUT_USER = {
  id: 0,
  name: "",
  email: "",
  avatar: ""
};

const { Provider, Consumer } = React.createContext({
  ...LOGGED_OUT_USER,
  authenticationToken: "",
  logout: () => null,
  refreshCredentials: () => null,
  isLoggedIn: false
});

class UserProvider extends React.Component<Props, State> {
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
    const { rehydratedState } = this.props;

    const contextValue: UserContext = {
      ...(get(this.props.data, "currentUser") || LOGGED_OUT_USER),
      authenticationToken: rehydratedState.authenticationToken,
      logout: rehydratedState.clear,
      isLoggedIn: rehydratedState.isLoggedIn
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

export const contextShape = propType(UserProvider.fragments.user);

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
  Provider: compose(
    withRehydratedState,
    withOneSignal,
    // When we're logged out, this always yields an error, and thats ok. Drop it.
    graphql(QUERY_USER, { options: { errorPolicy: "ignore" } })
  )(UserProvider),
  Consumer
};
