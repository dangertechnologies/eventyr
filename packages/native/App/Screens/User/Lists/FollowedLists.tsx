import React from "react";
import { View } from "react-native";
import { Container, Content } from "native-base";
import { compose } from "recompose";
import { withUser, UserContext } from "@eventyr/core/Providers";
import { H3 } from "native-base";
import ListsCollection from "App/Components/List/Collection";
import EStyleSheet from "react-native-extended-stylesheet";
import { NavigationScreenProp, NavigationState } from "react-navigation";

import QUERY_FOLLOWED_LISTS from "@eventyr/graphql/Queries/Lists/FollowedLists";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
}

const FollowedListsTab = ({ currentUser }: ComposedProps) => (
  <Container>
    <Content>
      {currentUser.id && (
        <ListsCollection
          query={{
            query: QUERY_FOLLOWED_LISTS
          }}
          listEdgeMapper={query =>
            (query.followedLists && query.followedLists.edges) || []
          }
          emptyComponent={
            <View style={styles.empty}>
              <H3 numberOfLines={2} style={styles.emptyText}>
                You haven't followed any lists
              </H3>
            </View>
          }
        />
      )}
    </Content>
  </Container>
);
const styles = EStyleSheet.create({
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

export default compose<ComposedProps, Props>(withUser)(FollowedListsTab);
