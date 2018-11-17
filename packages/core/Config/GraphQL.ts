// @ts-ignore
import {
  IntrospectionResultData,
  NormalizedCacheObject,
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";

// Caching
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";
import { CachePersistor } from "apollo-cache-persist";
import ActionCableJwt from "./ActionCable";
// @ts-ignore
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";
import { Operation } from "apollo-link";
import { DefinitionNode } from "graphql";

import introspectionSchema from "@eventyr/graphql/fragmentMatcher.json";
import Config from "./app.json";

// @ts-ignore
const introspectionQueryResultData: IntrospectionResultData = introspectionSchema;

export const SCHEMA_VERSION = Config.appVersion;
export const SCHEMA_VERSION_KEY = "apollo-schema-version";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

export const MEMORY_CACHE: InMemoryCache = new InMemoryCache({
  fragmentMatcher,
  addTypename: true
});

export const createCache = ({
  storage
}: {
  storage: PersistentStorage<PersistedData<NormalizedCacheObject>>;
}) => {
  const persistor = new CachePersistor({
    cache: MEMORY_CACHE,
    storage,
    debug: true
  });

  return { storage, persistor };
};
const WEBSOCKET_URI = `ws://${
  process.env.NODE_ENV === "development" ? Config.baseUrlDev : Config.baseUrl
}/subscriptions`;

export const createWebsocketLink = ({
  tokenAccessor,
  useNative
}: {
  tokenAccessor(): Promise<string>;
  useNative: boolean;
}) => {
  const actionCableJwt = ActionCableJwt.createConnection(tokenAccessor, {
    native: useNative
  });
  const cable = actionCableJwt.createConsumer(WEBSOCKET_URI);
  return new ActionCableLink({ cable });
};

export const hasSubscriptionOperation = ({
  query: { definitions }
}: Operation): boolean => {
  return definitions.some(
    // @ts-ignore We know operation exists here
    ({ kind, operation }: DefinitionNode) =>
      kind === "OperationDefinition" && operation === "subscription"
  );
};
