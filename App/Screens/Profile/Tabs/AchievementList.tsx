import React from "react";

/** COMPONENTS **/
import { FlatList, View, Alert } from "react-native";
import { H3 } from "native-base";
import AchievementCard from "App/Components/Cards/Achievement";
import { withUIHelpers, UIContext } from "App/Providers/UIProvider";

/** UTILS */
import { compose, withProps } from "recompose";
import { graphql } from "react-apollo";
import { concat } from "lodash";
import {
  NavigationScreenProp,
  NavigationState,
  withNavigation
} from "react-navigation";

import { MutationFunc } from "react-apollo";

/** TYPES **/
import { ApolloQueryResult } from "apollo-client";
import { Query, User, Achievement } from "App/Types/GraphQL";

import EStyleSheet from "react-native-extended-stylesheet";

import QUERY_USER_PERSONAL_ACHIEVEMENTS from "../../../GraphQL/Queries/Users/UserAchievements";

interface Props {
  user: User;
}
interface ComposedProps extends Props {
  data: Query & ApolloQueryResult<Query> & { error: string };
  navigation: NavigationScreenProp<NavigationState>;
  ui: UIContext;
  mutate: MutationFunc;
}

import MUTATE_DELETE_ACHIEVEMENT, {
  updateQueries
} from "App/GraphQL/Mutations/Achievements/Delete";

class AchievementList extends React.PureComponent<ComposedProps> {
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

  addToLists = (achievement: Achievement | null) =>
    achievement &&
    this.props.navigation.navigate("AddToLists", {
      achievementIds: [achievement.id]
    });

  render() {
    const { data } = this.props;
    const { user } = data;

    const achievements =
      user && user.userAchievements && user.userAchievements.edges
        ? user.userAchievements.edges
        : [];

    if (!achievements.length) {
      return (
        <View style={styles.empty}>
          <H3 numberOfLines={2} style={styles.emptyText}>
            You have not created any achievements yet
          </H3>
        </View>
      );
    }

    return (
      <FlatList
        data={achievements}
        refreshing={data.loading}
        keyExtractor={({ node }) => (node ? node.id : "N/A")}
        renderItem={({ item }) =>
          item.node && (
            <AchievementCard
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
                item.node.author.id === `${user.id}`
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
              achievement={item.node}
              onPress={() => this.viewDetails(item.node)}
            />
          )
        }
      />
    );
  }
}

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

export default compose<ComposedProps, Props>(
  withProps(({ user }: ComposedProps) => ({
    id: user.id
  })),
  graphql(QUERY_USER_PERSONAL_ACHIEVEMENTS),
  graphql(MUTATE_DELETE_ACHIEVEMENT),
  withNavigation
)(AchievementList);
