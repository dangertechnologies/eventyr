import React from "react";
import { graphql, QueryProps, DataProps, DataValue } from "react-apollo";
import get from "lodash/get";
import { compose, withStateHandlers } from "recompose";

interface Options<Variables = undefined> {
  query: QueryProps["query"];
  path: string;
  initialVariables?: Variables;
}

interface ChildFuncProps<T, Variables> {
  data: T | null;
  loading: DataValue<T>["loading"];
  error?: DataValue<T>["error"];
  setVariables(state: Variables): any;
  variables: Variables;
}

type ProviderProps<Type, Variables> = Maybe<Variables, {}> & {
  children(result: ChildFuncProps<Type, Variables>): React.ReactNode;
};

type InnerProps<
  Type,
  Variables extends QueryProps["variables"] = undefined
> = DataProps<Type> &
  Maybe<Variables, {}> & {
    setVariables(state: Variables): any;
    variables: Variables;
  };

type Maybe<T, Else> = T extends Else ? T : Else;

const createDataProvider = <
  T extends any,
  Variables extends QueryProps["variables"] = undefined
>({
  query,
  initialVariables,
  path
}: Options): React.ComponentType<ProviderProps<T, Variables>> => {
  const ProxyProvider = ({
    data,
    setVariables,
    variables,
    children
  }: InnerProps<T, Variables> & Variables): React.ReactNode =>
    children({
      data: get(data, path, null) as T | null,
      loading: data.loading,
      error: data.error,
      variables,
      setVariables
    });

  return compose<InnerProps<T, Variables>, ProviderProps<T, Variables>>(
    withStateHandlers(initialVariables || {}, {
      setVariables: () => (variables: Variables) => variables
    }),
    graphql<T, Variables>(query)
  )(ProxyProvider as React.ComponentType<InnerProps<T, Variables>>);
};

export default createDataProvider;
