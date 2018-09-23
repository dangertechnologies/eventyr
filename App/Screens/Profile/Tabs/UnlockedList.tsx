import React from "react";

/** COMPONENTS **/
import { FlatList, View } from "react-native";
import { H3 } from "native-base";
import UnlockedCard from "App/Components/Cards/Unlocked";

/** UTILS */
import { compose, withProps } from "recompose";
import { graphql } from "react-apollo";

/** TYPES **/
import { ApolloQueryResult } from "apollo-client";
import { Query, User } from "App/Types/GraphQL";

import EStyleSheet from "react-native-extended-stylesheet";

import QUERY_USER_UNLOCKED from "App/GraphQL/Queries/Users/UnlockedAchievements";

interface Props {
  user: User;
}
interface ComposedProps extends Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
}

export const scrollRangeForAnimation = 150;

const UnlockedList = ({ data }: ComposedProps) => {
  const { user } = data;

  const unlocked =
    user && user.unlockedAchievements && user.unlockedAchievements.edges
      ? user.unlockedAchievements.edges
      : [];

  if (!unlocked.length) {
    return (
      <View style={styles.empty}>
        <H3 numberOfLines={2} style={styles.emptyText}>
          You have not unlocked any achievements yet
        </H3>
      </View>
    );
  }

  return (
    <FlatList
      data={unlocked}
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
  },

  empty: {
    width: "100% - $spacingDouble",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexGrow: 1,
    minHeight: 250,
    alignSelf: "center"
  },

  emptyText: {
    textAlign: "center"
  }
});

export default compose<ComposedProps, Props>(
  withProps(({ user }: ComposedProps) => ({
    id: user.id
  })),
  graphql(QUERY_USER_UNLOCKED)
)(UnlockedList);
