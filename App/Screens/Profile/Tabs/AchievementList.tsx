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
import AchievementCard from "App/Components/Cards/Achievement";

/** UTILS */
import { compose, withProps } from "recompose";
import { graphql } from "react-apollo";

/** TYPES **/
import { ApolloQueryResult } from "apollo-client";
import { Query, User } from "App/Types/GraphQL";

import QUERY_USER_PERSONAL_ACHIEVEMENTS from "../../../GraphQL/Users/UserAchievements";

interface Props {
  user: User;
}
interface ComposedProps extends Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
}

export const scrollRangeForAnimation = 150;

const AchievementList = ({ data }: ComposedProps) => {
  const { user } = data;

  return (
    <FlatList
      data={
        user && user.userAchievements && user.userAchievements.edges
          ? user.userAchievements.edges
          : []
      }
      refreshing={data.loading}
      keyExtractor={({ node }) => (node ? node.id : "N/A")}
      renderItem={({ item }) =>
        item.node && (
          <AchievementCard achievement={item.node} onPress={() => null} />
        )
      }
    />
  );
};

export default compose<ComposedProps, Props>(
  withProps(({ user }: ComposedProps) => ({
    id: user.id
  })),
  graphql(QUERY_USER_PERSONAL_ACHIEVEMENTS)
)(AchievementList);
