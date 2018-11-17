import React from "react";
// @ts-ignore
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { omit } from "lodash";

import { BatchHttpLink } from "apollo-link-batch-http";
import { onError, ErrorResponse } from "apollo-link-error";
import { ApolloLink } from "apollo-link";

import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";

import Config from "../../app.json";

import {
  STORAGE,
  MEMORY_CACHE,
  SCHEMA_VERSION,
  SCHEMA_VERSION_KEY,
  CACHE_PERSISTOR,
  createWebsocketLink,
  hasSubscriptionOperation
} from "../Config/GraphQL";

interface State {
  isFirstLaunch: boolean;
  restored: boolean;
  version: string;
  authenticationToken: string;
  client: ApolloClient<NormalizedCacheObject>;
}

interface Props {
  children: React.ReactNode;
}

export interface RehydrationContext extends Omit<State, "client"> {
  clear: Function;
  updateCredentials: Function;
  isLoggedIn: boolean;
}

const DEFAULT_CONTEXT: RehydrationContext = {
  isFirstLaunch: true,
  isLoggedIn: false,
  restored: false,
  version: SCHEMA_VERSION,
  authenticationToken: "",
  clear: () => null,
  updateCredentials: () => null
};

const { Provider, Consumer } = React.createContext(DEFAULT_CONTEXT);

class RehydrationProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.restoreCache.bind(this);
    this.updateCredentials.bind(this);
  }

  onError = (result: ErrorResponse) => {
    const { graphQLErrors, networkError, response, operation } = result;

    console.log("NETWORK ERROR:");

    // Ignore errors on currentUser check, since the user may be logged out,
    // which will always cause an error.
    if (operation && operation.operationName === "UserCheck") {
      // @ts-ignore ref: https://www.apollographql.com/docs/react/features/error-handling.html
      if (response && response.errors) {
        response.errors = undefined;
      }
    } else {
      console.warn(JSON.stringify(response));
      console.warn(JSON.stringify(operation));
      console.warn(JSON.stringify(graphQLErrors));
    }
    if (graphQLErrors) {
      graphQLErrors.map(({ message }) => console.log(message));
    }

    if (networkError) {
      console.warn({ name: "Network error", value: networkError });
    }
  };

  authenticatedFetch = (
    uri: string,
    options: { headers: { Authorization: string } }
  ) => {
    if (this.state.authenticationToken !== "") {
      options.headers.Authorization = `Bearer ${
        this.state.authenticationToken
      }`;
    }

    return fetch(uri, options);
  };

  link: ApolloLink = ApolloLink.from([
    onError(this.onError),
    new BatchHttpLink({
      uri: `${
        __DEV__ ? `http://${Config.baseUrlDev}` : `https://${Config.baseUrl}`
      }/graphql`,
      fetch: this.authenticatedFetch,
      batchMax: 3
    })
  ]);

  state: State = {
    isFirstLaunch: true,
    restored: false,
    version: SCHEMA_VERSION,
    authenticationToken: "",
    client: new ApolloClient({ cache: MEMORY_CACHE, link: this.link })
  };

  componentDidMount() {
    this.restoreCache();
  }

  updateCredentials = async (authenticationToken: string): Promise<any> => {
    this.setState({
      authenticationToken
    });
    await STORAGE.setItem("authenticationToken", authenticationToken);
  };

  async restoreCache(options?: { forceClear?: boolean }): Promise<any> {
    const forceClear = (options && options.forceClear) || false;

    const currentVersion = await STORAGE.getItem(
      forceClear ? "EMPTY" : SCHEMA_VERSION_KEY
    );

    const authenticationToken = (await STORAGE.getItem(
      "authenticationToken"
    )) as string;

    console.log({
      name: "Rehydration#restoredAuth",
      value: authenticationToken
    });

    if (currentVersion === SCHEMA_VERSION && !forceClear) {
      // If the current version matches the latest version,
      // we're good to go and can restore the cache.
      console.log({ name: "Rehydration#restoredCache" });

      if (authenticationToken) {
        this.setState({ authenticationToken });
      }
      if (CACHE_PERSISTOR) {
        await CACHE_PERSISTOR.restore();
      } else {
        console.log("persistor doesnt exist!");
      }
    } else {
      // Otherwise, we'll want to purge the outdated persisted cache
      // and mark ourselves as having updated to the latest version.
      console.log({ name: "Rehydration#purge" });
      if (CACHE_PERSISTOR) {
        await CACHE_PERSISTOR.purge();
      } else {
        console.log("Persistor doesnt exist!");
      }
      await STORAGE.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
      await this.updateCredentials("");
    }
    return this.setState({
      restored: true,
      client: new ApolloClient({
        cache: MEMORY_CACHE,
        link: ApolloLink.split(
          // if hasSubscriptionOperation is true,
          // use the first link, otherwise use the
          // second link - this way we redirect WebSockets
          // to the websocket link
          hasSubscriptionOperation,
          createWebsocketLink({
            tokenAccessor: async () => this.state.authenticationToken
          }),
          this.link
        )
      })
    });
  }

  purgeCache = () => this.restoreCache({ forceClear: true });

  render() {
    const contextValue: RehydrationContext = {
      ...omit(this.state, ["client"]),
      isLoggedIn: this.state.authenticationToken !== "",
      clear: this.purgeCache,
      updateCredentials: this.updateCredentials
    };

    return (
      <ApolloProvider client={this.state.client}>
        <Provider value={contextValue}>{this.props.children}</Provider>
      </ApolloProvider>
    );
  }
}

export const withRehydratedState = <P extends object>(
  Component: React.ComponentType<P & { rehydratedState: RehydrationContext }>
) =>
  class RehydrationConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>
          {context => <Component {...props} rehydratedState={context} />}
        </Consumer>
      );
    }
  };

export default {
  Consumer,
  Provider: RehydrationProvider
};
