// @ts-ignore
import fsStorage from "redux-persist-fs-storage";
import {
  IntrospectionResultData,
  NormalizedCacheObject
} from "apollo-cache-inmemory";

// Caching
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";
import { CachePersistor } from "apollo-cache-persist";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
// @ts-ignore
import ActionCableJwt from "react-native-action-cable-jwt";
// @ts-ignore
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";
import { Operation } from "apollo-link";
import { DefinitionNode } from "graphql";

import introspectionSchema from "../Config/fragmentMatcher.json";
import Config from "../../app.json";

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

export const STORAGE: PersistentStorage<
  PersistedData<NormalizedCacheObject>
> = fsStorage();

export const CACHE_PERSISTOR = new CachePersistor({
  cache: MEMORY_CACHE,
  storage: STORAGE,
  debug: true
});

const WEBSOCKET_URI = `ws://${
  __DEV__ ? Config.baseUrlDev : Config.baseUrl
}/subscriptions`;

export const createWebsocketLink = ({
  tokenAccessor
}: {
  tokenAccessor(): Promise<string>;
}) => {
  const actionCableJwt = ActionCableJwt.createConnection(tokenAccessor);
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
