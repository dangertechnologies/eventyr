import React from "react";
import { FlatList } from "react-native";
import { compose, withProps } from "recompose";
import { graphql, DataValue } from "react-apollo";
import { List, Query, ListConnection } from "App/Types/GraphQL";
import { withUser, UserContext } from "../../Providers/UserProvider";
import Loading from "App/Components/Loading";
import ListCard from "App/Components/Cards/List";
import Overview from "App/Components/List/Overview";

import QUERY_USER_LISTS from "App/GraphQL/Queries/Lists/UserLists";
import {
  withNavigation,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";

interface Props {
  userId: string;
  selectable?: boolean;
  selected?: Array<List>;
  onSelect?(list: List): any;
  onDeselect?(list: List): any;
}

interface ComposedProps extends Props {
  currentUser: UserContext;
  data?: DataValue<Query>;
  lists: ListConnection;
  loading?: boolean;
  navigation?: NavigationScreenProp<NavigationState>;
}

/**
 * Displays a FlatList of Lists, with the option to make
 * the lists selectable. When using the default export of this
 * component, it automatically displays lists owned by the current
 * user;
 * to display lists owned by any specific user, you may import
 * the named export and manually pass lists (and currentUser)
 * instead.
 *
 * When selectable={true}, this component expects a set of lists
 * that have been selected to be passed in selected={[...]} to
 * display those lists as selected.
 *
 * FIXME: Currently, when lists are `selectable`, selecting a list
 * will add +1 on the AchievementsCount to indicate that the list
 * will receive an additional achievement. This needs to be reworked,
 * because
 * a) the Achievement may already be in the list, and
 * b) the selection may be for other purposes than to add Achievements
 */
export class ListCollection extends React.PureComponent<ComposedProps> {
  toggleSelect = (list?: List | null) => {
    if (!this.props.selected || !list) {
      return;
    }

    const selectedIds = this.props.selected.map(list => list.id);

    if (selectedIds.includes(list.id)) {
      if (this.props.onDeselect) {
        this.props.onDeselect(list);
      }
    } else if (this.props.onSelect) {
      this.props.onSelect(list);
    }
  };

  viewDetails = (list: List | null) => {
    if (!this.props.navigation || !list) {
      return;
    }
    this.props.navigation.navigate("ListContent", {
      list
    });
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    console.log({ name: "ListsCollection#render", value: this.props });

    return (
      <FlatList
        data={this.props.lists.edges || []}
        keyExtractor={item => (item.node && item.node.id ? item.node.id : "0")}
        extraData={this.props.selected}
        refreshing={this.props.data && this.props.data.loading}
        onRefresh={() => this.props.data && this.props.data.refetch()}
        renderItem={({ item }) => (
          <ListCard
            selected={
              this.props.selected && item.node
                ? this.props.selected
                    .map(list => list.id)
                    .includes(item.node.id)
                : undefined
            }
          >
            <Overview
              list={
                // Add +1 to Achievements count when the list is selected
                // during achievement adding
                this.props.selected &&
                item.node &&
                item.node.achievementsCount !== undefined
                  ? {
                      ...item.node,
                      achievementsCount: item.node.achievementsCount + 1
                    }
                  : item.node
              }
              onPress={() =>
                this.props.selectable || !this.props.navigation
                  ? this.toggleSelect(item.node)
                  : this.viewDetails(item.node)
              }
            />
          </ListCard>
        )}
      />
    );
  }
}

export default compose<ComposedProps, Props>(
  graphql(QUERY_USER_LISTS),
  withUser,
  withNavigation,
  withProps(({ data }: ComposedProps) => ({
    lists: (data && data.lists) || [],
    loading: data && data.loading
  }))
)(ListCollection);
