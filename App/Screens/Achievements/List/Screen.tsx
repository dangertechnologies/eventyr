import React from "react";

/** PROVIDERS **/
import { withUIHelpers, UIContext } from "App/Providers/UIProvider";
import { withUser, UserContext } from "App/Providers/UserProvider";
import withLocation, { LocationContext } from "App/Providers/LocationProvider";

/** COMPONENTS **/
import { Container, Content, Text } from "native-base";

/** UTILS */
import { withProps, compose, shouldUpdate } from "recompose";
import { concat, sortBy, uniqBy, omit, isEqual } from "lodash";
// @ts-ignore
import haversine from "haversine-distance";

/** GRAPHQL **/
import { graphql, DataValue } from "react-apollo";

/** STYLES **/
import EStyleSheet from "react-native-extended-stylesheet";

/** TYPES **/
import { NavigationScreenProp, NavigationState } from "react-navigation";
import {
  Query,
  Achievement,
  List,
  ListEdge,
  AchievementEdge
} from "App/Types/GraphQL";
import { MutateProps } from "react-apollo";

import QUERY_ACHIEVEMENTS from "App/GraphQL/Queries/Achievements/List";
import QUERY_LISTS from "App/GraphQL/Queries/Lists/NearbyLists";

import Feed from "./Feed";

interface Props extends MutateProps {
  listsQuery: DataValue<Query>;
  achievementsQuery: DataValue<Query>;
  navigation: NavigationScreenProp<NavigationState>;
  type: "all" | "personal" | "suggested" | "community";
  list?: List;
  ui: UIContext;
  location: LocationContext;
  currentUser: UserContext;
  feed?: Array<ListEdge | AchievementEdge>;
}

const FeedFactory = ({
  location,
  listsQuery,
  achievementsQuery
}: Pick<Props, "location" | "listsQuery" | "achievementsQuery">) =>
  location &&
  location.latitude &&
  location.longitude &&
  listsQuery.lists &&
  listsQuery.lists.edges &&
  achievementsQuery.achievements &&
  achievementsQuery.achievements.edges
    ? {
        feed: sortBy(
          // Merge Lists and Achievements into one collection
          concat(
            [],
            listsQuery.lists.edges,
            // @ts-ignore
            achievementsQuery.achievements.edges
          ),

          // Sort by distance from current location, to allow us
          // to interleave two different queries as sorted by
          // distance and show up in a single feed
          (item: ListEdge | AchievementEdge) => {
            if (item.node) {
              // If it's a List, we have a special 'coordinates'
              // field which contains all coordinates for all
              // objectives in all Achievements for the list,
              // we can calculate the haversine distance for each
              // coordinate pair to find the distance
              // @ts-ignore
              if (item.node.__typename === "List") {
                const list = item.node as List;
                return Math.min(
                  ...list.coordinates.map(coordinates => {
                    if (coordinates && coordinates.length > 1) {
                      let [lat, lng] = coordinates;
                      return haversine(location, { lat, lng });
                    }
                  })
                );
                // For Achievements, we just calculate the haversine
                // distance to all objectives, and use this for sorting
              } else {
                const achievement = item.node as Achievement;

                return Math.min(
                  ...achievement.objectives.map(objective =>
                    haversine(location, objective)
                  )
                );
              }
            }
          }
        )
      }
    : // If we had no lists, return undefined and let the
      // component display only Achievements instead
      undefined;

const AchievementsScreen = ({ listsQuery, achievementsQuery, feed }: Props) => {
  if (listsQuery.error) {
    return <Text>{listsQuery.error.toString()}</Text>;
  }
  if (achievementsQuery.error) {
    return <Text>{achievementsQuery.error.toString()}</Text>;
  }

  // Display the feed, which contains Lists + Achievements sorted by distance
  // if its available, otherwise display Achievements only
  const data: Array<ListEdge | AchievementEdge> = (feed
    ? feed
    : achievementsQuery.achievements &&
      achievementsQuery.achievements.edges) as Array<
    ListEdge | AchievementEdge
  >;

  return (
    <Container style={styles.container}>
      <Content style={styles.content}>
        <Feed
          data={data || []}
          refreshing={listsQuery.loading || achievementsQuery.loading}
          onRefresh={() => achievementsQuery && achievementsQuery.refetch()}
          onEndReachedThreshold={60}
          onEndReached={() =>
            achievementsQuery &&
            achievementsQuery.achievements &&
            achievementsQuery.achievements.edges &&
            achievementsQuery.achievements.edges.length &&
            achievementsQuery.variables.after !==
              achievementsQuery.achievements.edges[
                achievementsQuery.achievements.edges.length - 1
              ].cursor &&
            achievementsQuery.fetchMore({
              variables: {
                after:
                  achievementsQuery.achievements.edges[
                    achievementsQuery.achievements.edges.length - 1
                  ].cursor
              },
              updateQuery: (
                prev: Query,
                { fetchMoreResult }: { fetchMoreResult?: Query }
              ) => {
                if (!fetchMoreResult) {
                  return prev;
                }
                return {
                  ...prev,
                  achievements: {
                    ...prev.achievements,
                    edges: uniqBy(
                      [
                        ...((prev.achievements && prev.achievements.edges) ||
                          []),
                        ...((fetchMoreResult.achievements &&
                          fetchMoreResult.achievements.edges) ||
                          [])
                      ],
                      ({ node }) => node && node.id
                    )
                  }
                };
              }
            })
          }
        />
      </Content>
    </Container>
  );
};

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "$colorBackground"
  },
  content: {
    paddingTop: "$spacing"
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

const ListWithDefaultProps = (
  defaultProps: object = {}
): React.ComponentType<Props> => {
  const ListScreen: React.ComponentType<Props> = compose<Props, Props>(
    withProps(defaultProps),
    withLocation(),

    shouldUpdate(
      (props: Props, newProps: Props) =>
        !isEqual(omit(props, ["location"]), omit(newProps, ["location"]))
    ),
    // Query for Achievements nearby
    graphql(QUERY_ACHIEVEMENTS, {
      name: "achievementsQuery",
      options: ({ type, location }: Props) => ({
        variables: {
          type,
          coordinates:
            location && location.latitude && location.longitude
              ? [location.latitude, location.longitude]
              : null
        }
      })
    }),

    // Query for Lists nearby
    graphql(QUERY_LISTS, {
      name: "listsQuery",
      options: ({ type, location }: Props) => ({
        variables: {
          type,
          coordinates:
            location && location.latitude && location.longitude
              ? [location.latitude, location.longitude]
              : null
        }
      })
    }),

    // Merge Lists and Achievements and order by distance
    withProps(FeedFactory),

    withUIHelpers,
    withUser
  )(AchievementsScreen);

  return ListScreen;
};

export default {
  All: ListWithDefaultProps({ type: "all" }),
  Suggested: ListWithDefaultProps({ type: "suggested" }),
  Personal: ListWithDefaultProps({ type: "personal" }),
  Community: ListWithDefaultProps({ type: "community" })
};
