import React from "react";
import PropTypes from "prop-types";
import { omit } from "lodash";
import { compose } from "recompose";

// GraphQL
import { BatchHttpLink } from "apollo-link-batch-http";

import { onError, ErrorResponse } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import {
  withCache,
  contextShape as cacheContext,
  CacheContext
} from "./CacheProvider";

import { withTheme, ThemeContext } from "./ThemeProvider";

import Config from "../../app.json";

const DEFAULT_LINK: ApolloLink = ApolloLink.from([
  new BatchHttpLink({
    uri: Config.apiUrl,
    batchMax: 10
  })
]);

// const stateLink = withClientState({ cache });

interface Props {
  ui: ThemeContext;
  cache: CacheContext;
  children: React.ReactNode;
}

interface State {
  link: ApolloLink;
}

interface FetchContext extends State {
  cache?: InMemoryCache;
}

const DEFAULT_CONTEXT: FetchContext = {
  link: DEFAULT_LINK,
  cache: undefined
};

const { Provider, Consumer } = React.createContext(DEFAULT_CONTEXT);

class FetchProvider extends React.Component<Props, State> {
  state: State = {
    link: DEFAULT_LINK
  };

  componentWillMount() {
    if (
      this.props.cache &&
      this.props.cache.credentials &&
      this.props.cache.credentials.accessToken
    ) {
      this.setState({
        link: ApolloLink.from([
          onError(this.onError),
          new BatchHttpLink({
            uri: Config.apiUrl,
            fetch: this.authenticatedFetch,
            batchMax: 3
          })
        ])
      });
    } else {
      this.setState({
        link: DEFAULT_LINK
      });
    }
  }

  /**
   * Update the Apollo Link when the authorization token changes
   *
   * @param {*} param
   */
  componentWillReceiveProps(props: Props) {
    const { cache } = props;

    if (
      this.props.cache.credentials &&
      cache &&
      cache.credentials &&
      cache.credentials.accessToken !== this.props.cache.credentials.accessToken
    ) {
      this.setState({
        link: ApolloLink.from([
          onError(this.onError),
          new BatchHttpLink({
            uri: Config.apiUrl,
            fetch: this.authenticatedFetch,
            batchMax: 3
          })
        ])
      });
    }
  }

  componentDidCatch(error: Error) {
    console.log(error);
    this.props.cache.clear();
  }

  onError = (result: ErrorResponse) => {
    const { graphQLErrors, networkError, response } = result;

    console.log("NETWORK ERROR:");
    console.warn(JSON.stringify(response));
    console.warn(JSON.stringify(graphQLErrors));
    if (graphQLErrors) {
      graphQLErrors.map(({ message }) => console.log(message));
    }

    // result.errors = null;

    if (networkError) {
      console.warn({ name: "Network error", value: networkError });

      this.props.ui.notifyError("Something went wrong");
    }
  };

  authenticatedFetch = (
    uri: string,
    options: { headers: { Authorization: string } }
  ) => {
    if (
      this.props.cache.credentials &&
      this.props.cache.credentials.accessToken
    ) {
      options.headers.Authorization = `Bearer ${
        this.props.cache.credentials.accessToken
      }`;
    }

    return fetch(uri, options);
  };

  render() {
    console.log({
      provider: "Fetch",
      props: omit(this.props, ["cache", "children"])
    });

    const contextValue: FetchContext = {
      link: this.state.link,
      cache: this.props.cache.cache
    };

    return <Provider value={contextValue}>{this.props.children}</Provider>;
  }
}

export const withAuthorizedFetch = <P extends object>(
  Component: React.ComponentType<P & { apolloConfig: FetchContext }>
) =>
  class AuthorizedFetchConsumer extends React.PureComponent<P> {
    render() {
      const props = this.props || {};
      return (
        <Consumer>
          {context => <Component {...props} apolloConfig={context} />}
        </Consumer>
      );
    }
  };

export default {
  Consumer,
  Provider: compose<Props, {}>(
    withCache,
    withTheme
  )(FetchProvider)
};
