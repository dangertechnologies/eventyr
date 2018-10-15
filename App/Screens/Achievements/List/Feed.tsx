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
  AchievementEdge,
  User
} from "App/Types/GraphQL";
import { MutationFunc } from "react-apollo";
import { graphql } from "react-apollo";

import MUTATE_DELETE_ACHIEVEMENT, {
  updateQueries
} from "App/GraphQL/Mutations/Achievements/Delete";
import MUTATE_SEND_COOP_REQUEST from "App/GraphQL/Mutations/Coop/Request";

import Overview from "App/Components/List/Overview";
import RequestCooperationDrawer from "App/Components/Cooperation/Drawer";
import { LongPressAction } from "App/Components/Achievement/Overview";

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
  sendCoopRequest: MutationFunc;
}

interface State {
  coopAchievement: Achievement | null;
}

class Feed extends React.Component<ComposedProps, State> {
  state: State = {
    coopAchievement: null
  };

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

  addToLists = (achievement: Achievement) =>
    achievement &&
    this.props.navigation.navigate("AddToLists", {
      achievementIds: [achievement.id]
    });

  createCoopRequest = (achievement: Achievement | null) =>
    this.setState({ coopAchievement: achievement });

  sendCoopRequest = (model: { message: string; users: Array<User> }) => {
    this.state.coopAchievement &&
      this.props
        .sendCoopRequest({
          variables: {
            message: model.message || "",
            userIds: model.users.map(({ id }) => id),
            achievementId: this.state.coopAchievement.id
          }
        })
        .then(({ data }) =>
          this.props.ui.closeNotification().then(() =>
            this.setState({ coopAchievement: null }, () => {
              const { errors } = data.requestCoop;

              if (errors && errors.length) {
                this.props.ui.notifyError(errors[0]);
              }
              this.props.ui.notifySuccess("Sent");
            })
          )
        );
  };

  render() {
    const { data, loading, currentUser } = this.props;

    return loading ? (
      <Loading />
    ) : (
      <React.Fragment>
        <FlatList
          data={data || []}
          refreshing={loading}
          keyExtractor={({ node }) =>
            // @ts-ignore
            node && node.__typename === "List"
              ? `List:${node && node.id}`
              : `Achievement:${node && node.id}`
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
                    },
                    {
                      label: "Cooperate",
                      onPress: this.createCoopRequest
                    }
                  ],
                  item &&
                  item.node &&
                  item.node.author &&
                  item.node.author.id === `${currentUser.id}`
                    ? ([
                        {
                          label: "Edit",
                          onPress: this.editAchievement
                        },
                        {
                          label: "Delete",
                          onPress: this.confirmDelete,
                          destructive: true
                        }
                      ] as Array<LongPressAction>)
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
        {this.state.coopAchievement && (
          <RequestCooperationDrawer
            achievement={this.state.coopAchievement}
            onOutOfScreen={() => this.setState({ coopAchievement: null })}
            onCancel={() => this.setState({ coopAchievement: null })}
            onSend={this.sendCoopRequest}
          />
        )}
      </React.Fragment>
    );
  }
}

export default compose<ComposedProps, Props>(
  withUser,
  withLocation(),
  withUIHelpers,
  withNavigation,
  graphql(MUTATE_DELETE_ACHIEVEMENT),
  graphql(MUTATE_SEND_COOP_REQUEST, { name: "sendCoopRequest" })
)(Feed);
