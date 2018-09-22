import React from "react";
import PropTypes from "prop-types";
// @ts-ignore
import fsStorage from "redux-persist-fs-storage";
import {
  IntrospectionResultData,
  NormalizedCacheObject
} from "apollo-cache-inmemory";
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";
import { isEqual, omit } from "lodash";
import { compose } from "recompose";

// Caching
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";

import introspectionSchema from "../Config/fragmentMatcher.json";

import { BatchHttpLink } from "apollo-link-batch-http";
import { onError, ErrorResponse } from "apollo-link-error";
import { ApolloLink } from "apollo-link";

import { ApolloClient } from "apollo-client";

import { ApolloProvider } from "react-apollo";

import Config from "../../app.json";

// @ts-ignore
const SCHEMA_VERSION = Config.appVersion;
const SCHEMA_VERSION_KEY = "apollo-schema-version";
const introspectionQueryResultData: IntrospectionResultData = introspectionSchema;
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const MEMORY_CACHE: InMemoryCache = new InMemoryCache({
  fragmentMatcher,
  addTypename: true
});

const STORAGE: PersistentStorage<
  PersistedData<NormalizedCacheObject>
> = fsStorage();

interface State {
  cache: InMemoryCache;
  persistor?: CachePersistor<NormalizedCacheObject> | undefined;
  isFirstLaunch: boolean;
  restored: boolean;
  version: string;
  authenticationToken: string;
  client: ApolloClient<NormalizedCacheObject>;
}

interface Props {
  children: React.ReactNode;
}

export interface RehydrationContext
  extends Omit<State, "cache" | "persistor" | "client"> {
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
      response.errors = null;
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
      uri: Config.apiUrl,
      fetch: this.authenticatedFetch,
      batchMax: 3
    })
  ]);

  state: State = {
    persistor: undefined,
    cache: MEMORY_CACHE,
    isFirstLaunch: true,
    restored: false,
    version: SCHEMA_VERSION,
    authenticationToken: "",
    client: new ApolloClient({ cache: MEMORY_CACHE, link: this.link })
  };

  componentWillMount() {
    const CACHE_PERSISTOR = new CachePersistor({
      cache: MEMORY_CACHE,
      storage: STORAGE,
      debug: true
    });

    this.setState(
      {
        persistor: CACHE_PERSISTOR,
        cache: MEMORY_CACHE
      },
      this.restoreCache
    );
  }

  updateCredentials = async (authenticationToken: string): Promise<any> => {
    this.setState({
      authenticationToken
    });
    await STORAGE.setItem("authenticationToken", authenticationToken);
  };

  async restoreCache(options?: { forceClear?: boolean }): Promise<any> {
    const forceClear = (options && options.forceClear) || false;

    const { cache, persistor } = this.state;

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
      if (persistor) {
        await persistor.restore();
      } else {
        console.log("persistor doesnt exist!");
      }
    } else {
      // Otherwise, we'll want to purge the outdated persisted cache
      // and mark ourselves as having updated to the latest version.
      console.log({ name: "Rehydration#purge" });
      if (persistor) {
        await persistor.purge();
      } else {
        console.log("Persistor doesnt exist!");
      }
      await STORAGE.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
      await this.updateCredentials("");
    }
    return this.setState({
      cache,
      persistor,
      restored: true,
      client: new ApolloClient({ cache, link: this.link })
    });
  }

  purgeCache = () => this.restoreCache({ forceClear: true });

  render() {
    const { persistor } = this.state;

    // eslint-disable-next-line
    if (__DEV__ && persistor) {
      persistor.getLogs(true);
    }

    const contextValue: RehydrationContext = {
      ...omit(this.state, ["client", "cache", "persistor"]),
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
