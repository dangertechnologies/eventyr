import React from "react";
import { FlatList } from "react-native";
import { compose } from "recompose";
import { Query as ApolloQuery, QueryProps, QueryResult } from "react-apollo";
import { List, Query, ListEdge } from "App/Types/GraphQL";
import Loading from "App/Components/Loading";
import ListCard from "App/Components/Cards/List";
import Overview from "App/Components/List/Overview";
import {
  withNavigation,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";

interface Props {
  selectable?: boolean;
  selected?: Array<List>;
  onSelect?(list: List): any;
  onDeselect?(list: List): any;
  emptyComponent?: React.ReactNode;
  query: Omit<QueryProps, "children">;
  listEdgeMapper(data: Query): Array<ListEdge>;
}

interface ComposedProps extends Props {
  navigation: NavigationScreenProp<NavigationState>;
}

/**
 * Displays a FlatList of Lists, with the option to make
 * the lists selectable. When using the default export of this
 * component, it automatically displays lists owned by the current
 * user.
 *
 * You must pass in a valid ApolloQuery to fetch the lists yourself,
 * and provide a way to find the lists in the data object through
 * listEdgeMapper. This way we can query for lists that are e.g
 * Followed, Shared, or any other way of finding lists, using the
 * same component.
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
class ListCollection extends React.PureComponent<ComposedProps> {
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
    console.log({ name: "ListsCollection#render", value: this.props });

    const {
      listEdgeMapper,
      emptyComponent,
      query,
      selected,
      selectable,
      navigation
    } = this.props;

    return (
      <ApolloQuery {...query}>
        {({ data, loading, refetch }: QueryResult<Query>) => {
          if (loading) {
            return <Loading />;
          }

          if (!data) {
            return emptyComponent || null;
          }

          const lists: Array<ListEdge> = listEdgeMapper(data);

          if (!lists || !lists.length) {
            return emptyComponent || null;
          }

          return (
            <FlatList
              data={lists}
              keyExtractor={item =>
                item.node && item.node.id ? item.node.id : "0"
              }
              extraData={selected}
              refreshing={loading}
              onRefresh={refetch}
              renderItem={({ item }) => (
                <ListCard
                  selected={
                    selected && item.node
                      ? selected
                          .map((list: List) => list.id)
                          .includes(item.node.id)
                      : undefined
                  }
                >
                  <Overview
                    list={
                      // Add +1 to Achievements count when the list is selected
                      // during achievement adding
                      selected &&
                      item.node &&
                      item.node.achievementsCount !== undefined
                        ? {
                            ...item.node,
                            achievementsCount: item.node.achievementsCount + 1
                          }
                        : item.node
                    }
                    onPress={() =>
                      selectable || !navigation
                        ? this.toggleSelect(item.node)
                        : this.viewDetails(item.node)
                    }
                  />
                </ListCard>
              )}
            />
          );
        }}
      </ApolloQuery>
    );
  }
}

export default compose<ComposedProps, Props>(withNavigation)(ListCollection);
