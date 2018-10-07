import React from "react";

/** PROVIDERS **/
import { withUIHelpers, UIContext } from "App/Providers/UIProvider";
import { withUser, UserContext } from "App/Providers/UserProvider";
import withLocation, { LocationContext } from "App/Providers/LocationProvider";

/** COMPONENTS **/
import { FlatList, Alert } from "react-native";
import AchievementCard from "App/Components/Cards/Achievement";
import ListCard from "App/Components/Cards/List";
import Loading from "App/Components/Loading";

/** UTILS */
import { compose } from "recompose";
import { concat } from "lodash";

/** TYPES **/
import {
  NavigationScreenProp,
  NavigationState,
  withNavigation
} from "react-navigation";
import {
  Achievement,
  List,
  ListEdge,
  AchievementEdge
} from "App/Types/GraphQL";
import { MutationFunc } from "react-apollo";
import { graphql } from "react-apollo";

import MUTATE_DELETE_ACHIEVEMENT, {
  updateQueries
} from "App/GraphQL/Mutations/Achievements/Delete";
import Overview from "App/Components/List/Overview";

interface Props {
  data: Array<ListEdge | AchievementEdge> | Array<AchievementEdge>;
  loading: boolean;
  feed?: Array<ListEdge | AchievementEdge>;
}

interface ComposedProps extends Props {
  navigation: NavigationScreenProp<NavigationState>;
  ui: UIContext;
  location: LocationContext;
  currentUser: UserContext;
  mutate: MutationFunc;
}

class Feed extends React.PureComponent<ComposedProps> {
  deleteAchievement = (achievement: Achievement) => {
    this.props
      .mutate({
        variables: { id: achievement.id },
        // @ts-ignore
        updateQueries
      })
      .then(() =>
        this.props.ui
          .closeNotification()
          .then(() => this.props.ui.notifySuccess("Done"))
      );
  };

  confirmDelete = (achievement: Achievement) =>
    Alert.alert(`Delete ${achievement.name}`, "Are you sure?", [
      {
        text: "Cancel",
        onPress: () => null
      },
      {
        text: "Yes",
        onPress: () => this.deleteAchievement(achievement)
      }
    ]);
  editAchievement = (achievement: Achievement | null) =>
    achievement &&
    this.props.navigation.navigate("EditScreen", {
      id: achievement.id
    });

  viewDetails = (achievement: Achievement | null) =>
    achievement &&
    this.props.navigation.navigate("DetailsScreen", {
      id: achievement.id
    });

  viewList = (list: List | null) =>
    list &&
    this.props.navigation.navigate("ListContent", {
      list
    });

  addToLists = (achievement: Achievement | null) =>
    achievement &&
    this.props.navigation.navigate("AddToLists", {
      achievementIds: [achievement.id]
    });

  render() {
    const { data, loading, currentUser } = this.props;

    return loading ? (
      <Loading />
    ) : (
      <FlatList
        data={data || []}
        refreshing={loading}
        keyExtractor={({ node }) =>
          node && node.hasOwnProperty("Symbol(id)")
            ? // We know every node has a Symbol(id) from Apollo
              // @ts-ignore
              node["Symbol(id)"]
            : "N/A"
        }
        renderItem={({ item }) =>
          // @ts-ignore
          item.node.__typename === "List" ? (
            <ListCard>
              <Overview onPress={this.viewList} list={item.node as List} />
            </ListCard>
          ) : (
            <AchievementCard
              achievement={item.node as Achievement}
              actions={concat(
                [
                  {
                    label: "Add to List",
                    onPress: this.addToLists
                  }
                ],
                item &&
                item.node &&
                item.node.author &&
                item.node.author.id === `${currentUser.id}`
                  ? [
                      {
                        label: "Edit",
                        onPress: this.editAchievement
                      },
                      {
                        label: "Delete",
                        onPress: this.confirmDelete,
                        destructive: true
                      }
                    ]
                  : []
              )}
              onPress={() =>
                item.node &&
                this.props.navigation.navigate("DetailsScreen", {
                  id: item.node.id
                })
              }
            />
          )
        }
      />
    );
  }
}

export default compose<ComposedProps, Props>(
  withUser,
  withLocation(),
  withUIHelpers,
  withNavigation,
  graphql(MUTATE_DELETE_ACHIEVEMENT)
)(Feed);
