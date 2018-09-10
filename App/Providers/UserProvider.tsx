import React from "react";
import PropTypes from "prop-types";
import { Platform } from "react-native";
// @ts-ignore
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";
import { compose, graphql } from "react-apollo";
import { get, now, toNumber, omit } from "lodash";

import {
  withCache,
  contextShape as cacheContext,
  CacheContext
} from "./CacheProvider";
import {
  withAuth0,
  Credentials,
  Auth0Context,
  DEFAULT_CREDENTIALS
} from "./Auth0Provider";
import {
  withOneSignal,
  contextShape as oneSignalContext,
  OneSignalContext
} from "./OneSignalProvider";
import { ApolloQueryResult } from "apollo-client";

// import { withAuth0, contextShape as auth0Context } from './Auth0Provider';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface UserContext extends User {
  isLoggedIn: boolean;
  credentials: Credentials;
  logout(): any;
  refreshCredentials(): any;
}

type Props = {
  cache: CacheContext;
  oneSignal: OneSignalContext;
  auth0: Auth0Context;
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
  credentials: DEFAULT_CREDENTIALS,
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

  static propTypes = {
    cache: PropTypes.shape(cacheContext).isRequired,
    oneSignal: PropTypes.shape(oneSignalContext).isRequired
  };

  state: State = {
    updatedSinceLogin: false
  };

  refreshCredentials = () =>
    this.props.cache.credentials.refreshToken &&
    this.props.auth0.refreshAuthToken({
      refreshToken: this.props.cache.credentials.refreshToken
    });

  refreshTokenTimer: number | null = null;

  render() {
    const { cache } = this.props;

    const contextValue: UserContext = {
      ...(get(this.props.data, "currentUser") || LOGGED_OUT_USER),
      credentials: cache.credentials,
      logout: cache.clear,
      refreshCredentials: this.refreshCredentials,
      isLoggedIn: now() / 1000 < get(this.props.cache, "credentials.expiryDate")
    };

    console.log({
      provider: "User",
      value: contextValue,
      props: omit(this.props, ["cache", "children"])
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

/*

export const withUser = (
  Component: ComponentType<*> | Function,
): ComponentType<*> => (props: Object): Node => (
  <Consumer>{user => <Component {...props} currentUser={user} />}</Consumer>
);
*/
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
    withCache,
    withOneSignal,
    withAuth0,
    graphql(QUERY_USER)
  )(UserProvider),
  Consumer
};
