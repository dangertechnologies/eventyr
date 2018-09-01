import React from "react";
import PropTypes from "prop-types";
// @ts-ignore
import fsStorage from "redux-persist-fs-storage";
import { UserInfo } from "react-native-auth0";
import {
  IntrospectionResultData,
  NormalizedCacheObject
} from "apollo-cache-inmemory";
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";
import { isEqual, get } from "lodash";
import { compose } from "recompose";

// Caching
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";
import {
  withAuth0,
  contextShape as auth0Context,
  Credentials,
  Auth0Context
} from "./Auth0Provider";

import * as Config from "../../app.json";
import introspectionSchema from "../Config/fragmentMatcher.json";

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
  credentials: Credentials;
  userInfo: UserInfo | {};
}

interface Props {
  auth0: Auth0Context;
  children: React.ReactNode;
}

export interface CacheContext extends State {
  clear: Function;
  updateCredentials: Function;
}

export const contextShape = {
  cache: PropTypes.instanceOf(InMemoryCache),
  persistor: PropTypes.instanceOf(CachePersistor),
  isFirstLaunch: PropTypes.bool.isRequired,
  restored: PropTypes.bool.isRequired,
  version: PropTypes.string.isRequired,
  credentials: auth0Context.credentials,
  clear: PropTypes.func.isRequired
};

const DEFAULT_CONTEXT: CacheContext = {
  persistor: undefined,
  cache: MEMORY_CACHE,
  isFirstLaunch: true,
  restored: false,
  version: SCHEMA_VERSION,
  userInfo: {},
  credentials: {
    idToken: "",
    scope: "",
    tokenType: "Bearer",
    accessToken: "",
    expiresIn: 0,
    expiryDate: 0,
    refreshToken: ""
  },
  clear: () => null,
  updateCredentials: () => null
};

const { Provider, Consumer } = React.createContext(DEFAULT_CONTEXT);

class CacheProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.restoreCache.bind(this);
    this.updateCredentials.bind(this);
  }

  state: State = {
    persistor: undefined,
    cache: MEMORY_CACHE,
    isFirstLaunch: true,
    restored: false,
    version: SCHEMA_VERSION,
    userInfo: {},
    credentials: {
      idToken: "",
      scope: "",
      tokenType: "Bearer",
      accessToken: "",
      expiresIn: 0,
      expiryDate: 0,
      refreshToken: ""
    }
  };

  componentWillMount() {
    const CACHE_PERSISTOR = new CachePersistor({
      cache: MEMORY_CACHE,
      storage: STORAGE,
      debug: true
    });

    console.log("SETTING UP CACHE 4");

    this.setState(
      {
        persistor: CACHE_PERSISTOR,
        cache: MEMORY_CACHE
      },
      this.restoreCache
    );
  }

  componentWillReceiveProps(props: Props) {
    const { auth0 }: { auth0: Auth0Context } = props;
    if (
      auth0 &&
      auth0.credentials &&
      auth0.credentials.accessToken &&
      !isEqual(
        auth0.credentials.accessToken,
        get(this.state, "credentials.accessToken")
      )
    ) {
      // $FlowFixMe
      this.updateCredentials(auth0);
    }
  }

  async updateCredentials({
    credentials,
    userInfo
  }:
    | {
        credentials: Credentials;
        userInfo: UserInfo | {};
      }
    | Auth0Context): Promise<any> {
    this.setState({
      credentials,
      userInfo
    });
    await STORAGE.setItem("auth0", JSON.stringify({ credentials, userInfo }));
  }

  async restoreCache(options?: { forceClear?: boolean }): Promise<any> {
    const forceClear = (options && options.forceClear) || false;

    const { cache, persistor } = this.state;

    const currentVersion = await STORAGE.getItem(
      forceClear ? "EMPTY" : SCHEMA_VERSION_KEY
    );

    const credentials: {
      credentials: Credentials;
      userInfo: UserInfo;
      // @ts-ignore-next-line
    } = await STORAGE.getItem("auth0").then(
      (c: string) => (c ? JSON.parse(c) : {})
    );

    console.log("3. Cache restore");

    if (currentVersion === SCHEMA_VERSION && !forceClear) {
      // If the current version matches the latest version,
      // we're good to go and can restore the cache.
      console.log({ name: "GraphQLCache#restore" });

      if (credentials.credentials) {
        this.setState(credentials);
      }
      if (persistor) {
        await persistor.restore();
      } else {
        console.log("persistor doesnt exist!");
      }
    } else {
      // Otherwise, we'll want to purge the outdated persisted cache
      // and mark ourselves as having updated to the latest version.
      console.log({ name: "GraphQLCache#clear" });
      if (persistor) {
        await persistor.purge();
      } else {
        console.log("Persistor doesnt exist!");
      }
      await STORAGE.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
      await this.updateCredentials({
        credentials: {
          expiresIn: 0,
          accessToken: "",
          refreshToken: "",
          expiryDate: 0,
          idToken: "",
          scope: "",
          tokenType: "Bearer"
        },
        userInfo: {}
      });
    }
    return this.setState({
      cache,
      persistor,
      restored: true
    });
  }

  purgeCache = () => this.restoreCache({ forceClear: true });

  render() {
    const { persistor } = this.state;

    // eslint-disable-next-line
    if (__DEV__ && persistor) {
      persistor.getLogs(true);
    }

    const contextValue: CacheContext = {
      ...this.state,
      clear: this.purgeCache,
      updateCredentials: this.updateCredentials
    };

    return <Provider value={contextValue}>{this.props.children}</Provider>;
  }
}

export const withCache = <P extends object>(
  Component: React.ComponentType<P & { cache: CacheContext }>
) =>
  class CacheConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>
          {context => <Component {...props} cache={context} />}
        </Consumer>
      );
    }
  };

export default {
  Consumer,
  Provider: compose<Props, {}>(withAuth0)(CacheProvider)
};
