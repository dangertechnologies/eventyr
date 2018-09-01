import React from "react";
import { compose } from "recompose";
// @ts-ignore
import { ApolloClient } from "apollo-client";

import { ApolloProvider } from "react-apollo";
import { withAuthorizedFetch } from "../Providers/FetchProvider";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";

// const stateLink = withClientState({ cache });

interface Props {
  apolloConfig: {
    link: ApolloLink;
    cache: InMemoryCache;
  };
  children: React.ReactNode;
}

const GraphQLProvider = ({ apolloConfig, children }: Props) => (
  <ApolloProvider client={new ApolloClient(apolloConfig)}>
    {children}
  </ApolloProvider>
);

export default compose<Props, {}>(withAuthorizedFetch)(GraphQLProvider);
