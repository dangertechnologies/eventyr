import React from "react";

/** COMPONENTS **/
import { FlatList, Animated } from "react-native";
import {
  Container,
  Header,
  Content,
  H1,
  H2,
  H3,
  Text,
  Icon,
  Left,
  Right,
  Body,
  Row
} from "native-base";
import UnlockedCard from "App/Components/Cards/Unlocked";

/** UTILS */
import { compose, withProps } from "recompose";
import { graphql } from "react-apollo";

/** TYPES **/
import { ApolloQueryResult } from "apollo-client";
import { Query, User } from "App/Types/GraphQL";

import EStyleSheet from "react-native-extended-stylesheet";

import QUERY_USER_UNLOCKED from "App/GraphQL/Users/UnlockedAchievements";

interface Props {
  user: User;
}
interface ComposedProps extends Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
}

export const scrollRangeForAnimation = 150;

const UnlockedList = ({ data }: ComposedProps) => {
  const { user } = data;

  console.log({ data });
  return (
    <FlatList
      data={
        user && user.unlockedAchievements && user.unlockedAchievements.edges
          ? user.unlockedAchievements.edges
          : []
      }
      refreshing={data.loading}
      keyExtractor={({ node }) => (node ? node.id : "N/A")}
      renderItem={({ item }) =>
        item.node && <UnlockedCard unlocked={item.node} onPress={() => null} />
      }
    />
  );
};

const styles = EStyleSheet.create({
  content: {
    flexGrow: 1,
    padding: "$spacing"
  }
});

export default compose<ComposedProps, Props>(
  withProps(({ user }: ComposedProps) => ({
    id: user.id
  })),
  graphql(QUERY_USER_UNLOCKED)
)(UnlockedList);
