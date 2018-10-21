import React from "react";

/** PROVIDERS **/
import { withUIHelpers, UIContext } from "App/Providers/UIProvider";

/** COMPONENTS **/
import { Alert } from "react-native";

/** UTILS */
import { compose } from "recompose";
import { omit } from "lodash";

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
import MUTATE_SHARE_ACHIEVEMENT from "App/GraphQL/Mutations/Share/Achievement";
import MUTATE_SHARE_LIST from "App/GraphQL/Mutations/Share/List";

import RequestCooperationDrawer from "App/Components/Cooperation/Drawer";
import ShareItemDrawer from "App/Components/Share/Drawer";

interface Props {
  data: Array<ListEdge | AchievementEdge> | Array<AchievementEdge>;
  loading: boolean;
  feed?: Array<ListEdge | AchievementEdge>;
}

interface ComposedProps extends Props {
  navigation: NavigationScreenProp<NavigationState>;
  ui: UIContext;
  mutate: MutationFunc;
  pushCoopRequest: MutationFunc;
  pushAchievementDeleteRequest: MutationFunc;
  pushAchievementShareRequest: MutationFunc;
  pushListShareRequest: MutationFunc;
}

interface State {
  selectedItem: Achievement | List | null;
  currentAction:
    | "COOPERATION_REQUEST"
    | "FRIEND_REQUEST"
    | "SHARE_REQUEST"
    | null;
}

export interface Actions {
  deleteAchievement(achievement: Achievement): void;
  editAchievement(achievement: Achievement | null): void;
  viewDetails(item: Achievement | List): void;
  addToLists(achievement: Achievement | null): void;
  requestCooperation(achievement: Achievement): void;
  shareAchievement(achievement: Achievement): void;
  shareList(list: List): void;
}

const withAchievementActions = <P extends object>(
  Component: React.ComponentType<P & { actions: Actions }>
) => {
  class AchievementActionProvider extends React.Component<
    ComposedProps,
    State
  > {
    state: State = {
      selectedItem: null,
      currentAction: null
    };

    /**
     * Requests confirmation from the user before deleting
     * an achievement
     *
     * @memberof AchievementActionProvider
     */
    public deleteAchievement = (achievement: Achievement) =>
      Alert.alert(`Delete ${achievement.name}`, "Are you sure?", [
        {
          text: "Cancel",
          onPress: () => null
        },
        {
          text: "Yes",
          onPress: () => this.sendDeleteAchievementRequest(achievement)
        }
      ]);

    /**
     * Sends the user to the EditScreen with a given Achievement
     *
     * @memberof AchievementActionProvider
     */
    public editAchievement = (achievement: Achievement | null) =>
      achievement &&
      this.props.navigation.navigate("EditScreen", {
        id: achievement.id
      });

    /**
     * Sends the user to the DetailsScreen for an Achievement
     * or a List
     *
     * @memberof AchievementActionProvider
     */
    public viewDetails = (item: Achievement | List | null) =>
      item &&
      this.props.navigation.navigate(
        // @ts-ignore
        item.__typename === "List" ? "ListContent" : "DetailsScreen",
        // @ts-ignore
        item.__typename === "List"
          ? { list: item }
          : {
              id: item.id
            }
      );

    /**
     * Sends the user to the AddToList screen, with the
     * given Achievement
     *
     * @memberof AchievementActionProvider
     */
    public addToLists = (achievement: Achievement) =>
      achievement &&
      this.props.navigation.navigate("AddToLists", {
        achievementIds: [achievement.id]
      });

    /**
     * Selects an Achievement for cooperation and opens the
     * Cooperation drawer, where the user may select other users
     * to send a cooperation request to
     *
     * @memberof AchievementActionProvider
     */
    public requestCooperation = (achievement: Achievement | null) =>
      this.setState({
        selectedItem: achievement,
        currentAction: "COOPERATION_REQUEST"
      });

    /**
     * Selects an Achievement or a List for sharing and opens the Share
     * drawer where the user may select friends to share the
     * achievement or list with.
     *
     * @memberof AchievementActionProvider
     */
    public shareItem = (shareItem: Achievement | List) =>
      this.setState({
        selectedItem: shareItem,
        currentAction: "SHARE_REQUEST"
      });

    /**
     * Sends the request to the server
     *
     * @private
     * @param {{ message: string; users: Array<User> }} model
     * @memberof AchievementActionProvider
     */
    private sendShareRequest = async (model: {
      message: string;
      users: Array<User>;
    }) => {
      if (this.state.selectedItem) {
        // @ts-ignore
        if (this.state.selectedItem.__typename === "List") {
          const { data } = await this.props.pushListShareRequest({
            variables: {
              userIds: model.users.map(({ id }) => id),
              listId: this.state.selectedItem.id
            }
          });

          const { errors } = data.shareList;
          if (errors && errors.length) {
            this.props.ui.notifyError(errors[0]);
          }
          await this.props.ui.notifySuccess("Sent");
        } else {
          const { data } = await this.props.pushAchievementShareRequest({
            variables: {
              userIds: model.users.map(({ id }) => id),
              achievementId: this.state.selectedItem.id
            }
          });

          const { errors } = data.shareAchievement;
          if (errors && errors.length) {
            this.props.ui.notifyError(errors[0]);
          }
          await this.props.ui.notifySuccess("Sent");
        }
      }
      this.reset();
    };

    /**
     * Sends the cooperation request and notifies the user
     * about errors, or success, when complete
     *
     * @memberof AchievementActionProvider
     */
    private sendCoopRequest = async (model: {
      message: string;
      users: Array<User>;
    }) => {
      if (!this.state.selectedItem) {
        return;
      }

      const { data } = await this.props.pushCoopRequest({
        variables: {
          message: model.message || "",
          userIds: model.users.map(({ id }) => id),
          achievementId: this.state.selectedItem.id
        }
      });

      await this.props.ui.closeNotification();
      await this.reset();

      const { errors } = data.requestCoop;
      if (errors && errors.length) {
        this.props.ui.notifyError(errors[0]);
      }
      this.props.ui.notifySuccess("Sent");
    };

    /**
     * Attempts to delete an Achievement
     *
     * @memberof AchievementActionProvider
     */
    private sendDeleteAchievementRequest = async (achievement: Achievement) => {
      await this.props.mutate({
        variables: { id: achievement.id },
        // @ts-ignore
        updateQueries
      });
      await this.props.ui.closeNotification();
      await this.props.ui.notifySuccess("Done");

      this.reset();
    };

    private reset = (): Promise<void> =>
      new Promise(resolve =>
        this.setState({ selectedItem: null, currentAction: null }, resolve)
      );

    render() {
      const actions = {
        requestCooperation: this.requestCooperation,
        shareAchievement: this.shareItem,
        shareList: this.shareItem,
        viewDetails: this.viewDetails,
        editAchievement: this.editAchievement,
        deleteAchievement: this.deleteAchievement,
        addToLists: this.addToLists
      };

      let Drawer = null;

      switch (this.state.currentAction) {
        case "COOPERATION_REQUEST":
          Drawer = (
            <RequestCooperationDrawer
              achievement={this.state.selectedItem as Achievement}
              onOutOfScreen={this.reset}
              onCancel={this.reset}
              onSend={this.sendCoopRequest}
            />
          );
          break;

        case "SHARE_REQUEST":
          Drawer = (
            <ShareItemDrawer
              {...{
                achievement:
                  this.state.selectedItem &&
                  // @ts-ignore
                  this.state.selectedItem.__typename === "Achievement"
                    ? (this.state.selectedItem as Achievement)
                    : undefined,
                list:
                  this.state.selectedItem &&
                  // @ts-ignore
                  this.state.selectedItem.__typename === "List"
                    ? (this.state.selectedItem as List)
                    : undefined
              }}
              onOutOfScreen={this.reset}
              onCancel={this.reset}
              onSend={this.sendShareRequest}
            />
          );
          break;
      }

      const restProps = omit(this.props, [
        "pushAchievementDeleteRequest",
        "pushCoopRequest",
        "pushAchievementShareRequest",
        "pushListShareRequest",
        "navigation"
      ]);

      return (
        <React.Fragment>
          <Component actions={actions} {...restProps} />

          {Drawer}
        </React.Fragment>
      );
    }
  }

  return compose<ComposedProps, Props>(
    withUIHelpers,
    withNavigation,
    graphql(MUTATE_DELETE_ACHIEVEMENT, {
      name: "pushAchievementDeleteRequest"
    }),
    graphql(MUTATE_SEND_COOP_REQUEST, { name: "pushCoopRequest" }),
    graphql(MUTATE_SHARE_ACHIEVEMENT, { name: "pushAchievementShareRequest" }),
    graphql(MUTATE_SHARE_LIST, { name: "pushListShareRequest" })
  )(AchievementActionProvider);
};

export default withAchievementActions;
